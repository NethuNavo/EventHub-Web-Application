# Event Hub Registration

A Next.js registration form with responsive Tailwind UI, frontend validation, MongoDB persistence, and Nodemailer email notifications.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=eventhub
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=your_email@example.com
```

If your environment cannot resolve Atlas SRV records, this will force Node to use public DNS servers for MongoDB lookup.

> For Gmail SMTP, you must use an app password if you have 2-step verification enabled. Regular Gmail login credentials are usually rejected by Google SMTP.

3. Run locally:

```bash
npm run dev
```

4. Open: `http://localhost:3000`

## Features

- Responsive dark UI optimized for desktop and mobile
- Real-time field validation with inline feedback
- Email notification to developer/admin on successful submission
- Stores submissions in MongoDB Atlas
- Clear success/error states and loading feedback
