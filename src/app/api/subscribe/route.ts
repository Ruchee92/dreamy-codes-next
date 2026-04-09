import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Dreamy Codes <onboarding@resend.dev>',
      to: 'hello@dreamycodes.com',
      cc: 'wk.ruchira@gmail.com', // Added based on user's snippet
      subject: 'New Blog Subscription',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">New Subscriber Alert</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #666;">
            You have a new subscriber to your blog newsletter!
          </p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #000;">Email Address:</p>
            <p style="margin: 5px 0 0; color: #ef4444;">${email}</p>
          </div>
          <p style="font-size: 14px; color: #999;">
            This email was sent via the Resend API from your Dreamy Codes website.
          </p>
        </div>
      `
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscription successful' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
