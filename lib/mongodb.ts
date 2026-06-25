import dns from 'dns';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  appName: 'EventHubApp',
};

const dnsServers = process.env.MONGODB_DNS_SERVERS
  ? process.env.MONGODB_DNS_SERVERS.split(',').map((entry) => entry.trim()).filter(Boolean)
  : [];

if (dnsServers.length) {
  try {
    dns.setServers(dnsServers);
    if (uri && uri.includes('+srv')) {
      // eslint-disable-next-line no-console
      console.warn('MONGODB_URI uses +srv; using MONGODB_DNS_SERVERS for SRV resolution.');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to set custom DNS servers from MONGODB_DNS_SERVERS, falling back to system DNS:', err instanceof Error ? err.message : String(err));
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let cachedPromise: Promise<MongoClient> | undefined;

function createMongoClient() {
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }

  if (!cachedPromise) {
    const client = new MongoClient(uri, options);
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect();
      }
      cachedPromise = global._mongoClientPromise;
    } else {
      cachedPromise = client.connect();
    }
  }

  return cachedPromise;
}

export async function getMongoClient() {
  return createMongoClient();
}

export async function getMongoDb() {
  const client = await createMongoClient();
  return client.db(process.env.MONGODB_DB || 'eventhub');
}
