const { MongoClient } = require('mongodb');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const [key, ...rest] = line.split('=');
    acc[key.trim()] = rest.join('=').trim();
    return acc;
  }, {});

(async () => {
  try {
    const client = new MongoClient(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      appName: 'TempMongoCheck',
    });
    await client.connect();
    const db = client.db(env.MONGODB_DB || 'eventhub');
    const collections = await db.listCollections().toArray();
    console.log('collections:', collections.map((c) => c.name));
    const sample = await db.collection('registrations').find().limit(5).toArray();
    console.log('sample docs:', sample);
    await client.close();
  } catch (err) {
    console.error('error:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
})();
