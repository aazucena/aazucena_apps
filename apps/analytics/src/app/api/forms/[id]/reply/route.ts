import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { fetchStrapi } from '@/lib/services/strapi';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { subject, body } = await req.json();

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'subject and body are required' }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Fetch submission to get the recipient email
  let submission: any;
  try {
    const result = await fetchStrapi(`form-submissions/${id}`, {
      query: { fields: ['submitterEmail', 'submitterName', 'status'] },
    });
    submission = result?.data;
  } catch {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  const recipientEmail = submission?.submitterEmail;
  const recipientName = submission?.submitterName ?? 'there';

  if (!recipientEmail) {
    return NextResponse.json({ error: 'No email address on this submission' }, { status: 422 });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'Aldrin Azucena <hello@aazucena.com>';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
          <p>Hi ${recipientName},</p>
          ${body
            .split('\n')
            .map((line: string) => `<p>${line}</p>`)
            .join('')}
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="color:#6b7280;font-size:13px;">Aldrin Azucena · aazucena.com</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[Forms Reply] Resend failed:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  // Mark as Replied in Strapi (non-blocking on failure — email already sent)
  try {
    await fetchStrapi(`form-submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { status: 'Replied' } }),
    });
  } catch (err) {
    console.warn('[Forms Reply] Status update failed after send:', err);
  }

  return NextResponse.json({ sent: true, to: recipientEmail });
}
