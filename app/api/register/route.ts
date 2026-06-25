import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getMongoClient } from '../../../lib/mongodb';

const validatePayload = (payload: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+0-9 ()-]{7,20}$/;

  if (!payload) return 'Missing payload.';
  if (!payload.fullName?.trim()) return 'Full name is required.';
  if (!payload.email?.trim() || !emailRegex.test(payload.email)) return 'A valid email address is required.';
  if (!payload.phone?.trim() || !phoneRegex.test(payload.phone)) return 'A valid phone number is required.';
  if (!payload.guests || Number(payload.guests) < 1 || Number(payload.guests) > 10) return 'Guest count must be between 1 and 10.';
  if (typeof payload.notes === 'string' && payload.notes.length > 500) return 'Notes may not exceed 500 characters.';
  return null;
};

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const entryToEmailBody = (payload: any) => {
  return `New event registration received:\n\nFull name: ${payload.fullName}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nCompany: ${payload.company || 'N/A'}\nEvent: ${payload.eventName}\nGuests: ${payload.guests}\nDietary: ${payload.dietary}\nNotes: ${payload.notes || 'None'}`;
};

const entryToUserEmailBody = (payload: any) => {
  return `Hi ${payload.fullName},\n\nThank you for registering for ${payload.eventName}.\n\nWe have received your registration with the following details:\n\nFull name: ${payload.fullName}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nCompany: ${payload.company || 'N/A'}\nEvent: ${payload.eventName}\nGuests: ${payload.guests}\nDietary: ${payload.dietary}\nNotes: ${payload.notes || 'None'}\n\nWe will contact you shortly with more information.\n\nBest regards,\nEvent Hub Team`;
};

const entryToUserEmailHtml = (payload: any) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registration Confirmed</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f4f5f7; color: #0f172a; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12); overflow: hidden; }
      .header { background: #047857; color: #f8fafc; padding: 24px; text-align: center; }
      .content { padding: 24px; }
      .title { margin: 0 0 12px; font-size: 20px; }
      .subtitle { margin: 0 0 24px; color: #d1fae5; }
      .details { width: 100%; border-collapse: collapse; }
      .details th, .details td { padding: 12px 14px; text-align: left; }
      .details th { background: #ecfdf5; color: #065f46; width: 200px; }
      .details tr:nth-child(even) td { background: #f8fafc; }
      .footer { margin-top: 24px; color: #64748b; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">Registration Confirmed</h1>
        <p class="subtitle">Thank you for registering with Event Hub.</p>
      </div>
      <div class="content">
        <p>Hello ${payload.fullName},</p>
        <p>We received your registration for <strong>${payload.eventName}</strong>. Here are the details we received:</p>
        <table class="details">
          <tr><th>Full name</th><td>${payload.fullName}</td></tr>
          <tr><th>Email</th><td>${payload.email}</td></tr>
          <tr><th>Phone</th><td>${payload.phone}</td></tr>
          <tr><th>Company</th><td>${payload.company || 'N/A'}</td></tr>
          <tr><th>Event</th><td>${payload.eventName}</td></tr>
          <tr><th>Guests</th><td>${payload.guests}</td></tr>
          <tr><th>Dietary</th><td>${payload.dietary}</td></tr>
          <tr><th>Notes</th><td>${payload.notes || 'None'}</td></tr>
        </table>
        <p>If you need to update your registration, please reply to this email.</p>
        <p class="footer">Warm regards,<br/>Event Hub Team</p>
      </div>
    </div>
  </body>
</html>`;
};

const entryToEmailHtml = (payload: any) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Event Registration</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f4f5f7; color: #0f172a; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12); overflow: hidden; }
      .header { background: #111827; color: #f8fafc; padding: 24px; text-align: center; }
      .content { padding: 24px; }
      .title { margin: 0 0 12px; font-size: 20px; }
      .subtitle { margin: 0 0 24px; color: #64748b; }
      .details { width: 100%; border-collapse: collapse; }
      .details th, .details td { padding: 12px 14px; text-align: left; }
      .details th { background: #f8fafc; color: #475569; width: 200px; }
      .details tr:nth-child(even) td { background: #f8fafc; }
      .footer { margin-top: 24px; color: #64748b; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">New Event Registration</h1>
        <p class="subtitle">A new registration was submitted through Event Hub.</p>
      </div>
      <div class="content">
        <table class="details">
          <tr><th>Full name</th><td>${payload.fullName}</td></tr>
          <tr><th>Email</th><td>${payload.email}</td></tr>
          <tr><th>Phone</th><td>${payload.phone}</td></tr>
          <tr><th>Company</th><td>${payload.company || 'N/A'}</td></tr>
          <tr><th>Event</th><td>${payload.eventName}</td></tr>
          <tr><th>Guests</th><td>${payload.guests}</td></tr>
          <tr><th>Dietary</th><td>${payload.dietary}</td></tr>
          <tr><th>Notes</th><td>${payload.notes || 'None'}</td></tr>
        </table>
        <p class="footer">This message was generated automatically by Event Hub.</p>
      </div>
    </div>
  </body>
</html>`;
};

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const error = validatePayload(payload);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Persist registration to MongoDB. If persistence fails, capture the
    // error but continue so we can still attempt to send the notification
    // email. We only return a 500 if both persistence and email fail.
    let dbErrorMessage: string | null = null;
    try {
      const client = await getMongoClient();
      const database = client.db(process.env.MONGODB_DB || 'eventhub');
      const collection = database.collection('registrations');

      await collection.insertOne({
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        company: payload.company?.trim() || null,
        eventName: payload.eventName,
        guests: Number(payload.guests),
        dietary: payload.dietary,
        notes: payload.notes?.trim() || null,
        createdAt: new Date(),
      });
    } catch (dbError) {
      dbErrorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      // eslint-disable-next-line no-console
      console.warn('Warning: failed to persist registration to MongoDB:', dbErrorMessage);
    }

    // Send admin and user confirmation emails if configured.
    const adminEmail = process.env.ADMIN_EMAIL;
    let mailErrorMessage: string | null = null;
    const mailAttempted = Boolean(adminEmail);
    if (!adminEmail) {
      // eslint-disable-next-line no-console
      console.warn('Warning: ADMIN_EMAIL is not configured; skipping email notification.');
    } else {
      try {
        const transporter = createTransporter();

        await transporter.sendMail({
          from: `Event Hub <${adminEmail}>`,
          to: adminEmail,
          subject: 'New Event Registration',
          text: entryToEmailBody(payload),
          html: entryToEmailHtml(payload),
        });

        await transporter.sendMail({
          from: `Event Hub <${adminEmail}>`,
          to: payload.email,
          subject: 'Your Event Registration is Confirmed',
          text: entryToUserEmailBody(payload),
          html: entryToUserEmailHtml(payload),
        });
      } catch (mailError) {
        mailErrorMessage = mailError instanceof Error ? mailError.message : String(mailError);
        // eslint-disable-next-line no-console
        console.warn('Warning: failed to send notification email:', mailErrorMessage);
      }
    }

    // If both DB persistence failed and the email either failed or wasn't
    // attempted, surface an error. Otherwise return success with warnings
    // included for visibility.
    if (dbErrorMessage && (mailErrorMessage || !mailAttempted)) {
      return NextResponse.json(
        { error: 'Failed to persist registration and send notification.', details: { db: dbErrorMessage, mail: mailErrorMessage } },
        { status: 500 }
      );
    }

    if (dbErrorMessage) {
      return NextResponse.json({ message: 'Registration received; notification sent. Failed to persist to DB.', details: dbErrorMessage });
    }

    if (mailErrorMessage) {
      return NextResponse.json({ message: 'Registration saved; failed to send notification email.', details: mailErrorMessage });
    }

    return NextResponse.json({ message: 'Registration submitted successfully.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
