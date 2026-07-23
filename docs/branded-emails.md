# Branded auth emails (WorkWith)

The signup / magic-link / recovery emails currently use Supabase's plain default
template. This makes them look untrustworthy — a real problem for a Lebanon-first
free product where the FIRST touch is that email. Two steps, both in the Supabase
dashboard (they can't be set from app code):

## 1. Connect a real sender (Resend) — 10 min
The Supabase built-in email sender is **rate-capped** (a signup burst silently
drops confirmation emails) and sends from a generic address. Use Resend:
1. Create a Resend account → add & verify the domain **work-withme.com** (add the
   DKIM/SPF/return-path DNS records Resend shows, at GoDaddy).
2. Supabase → **Project Settings → Auth → SMTP Settings** → enable custom SMTP:
   - Host `smtp.resend.com`, Port `465`, User `resend`, Password = your Resend API key.
   - Sender email `hello@work-withme.com`, Sender name `WorkWith`.
3. Raise **Auth → Rate Limits → email** above the tiny default once SMTP is live.

## 2. Paste these branded templates
Supabase → **Auth → Email Templates**. For each type, paste the HTML below.
Supabase variables: `{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .SiteURL }}`.
Keep the accent (#e8623d) and the "elevate your online presence" voice.

---

### Confirm signup  (Subject: `Confirm your WorkWith page`)
```html
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#faf8f3;padding:32px 0;">
  <div style="max-width:440px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
    <div style="background:#171310;padding:22px 28px;">
      <span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:-.02em;">Work<span style="color:#e8623d;">With</span></span>
    </div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 8px;font-size:20px;color:#171310;">One tap and your page is live</h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#6b655c;">
        Confirm your email to finish setting up your professional page — free, at your own link.
      </p>
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#e8623d;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:999px;">
        Confirm &amp; build my page →
      </a>
      <p style="margin:22px 0 0;font-size:12px;color:#a8a29a;">
        Didn’t sign up? Ignore this email. · WorkWith — we help you look established online.
      </p>
    </div>
  </div>
</div>
```

### Magic link  (Subject: `Your WorkWith sign-in link`)
```html
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#faf8f3;padding:32px 0;">
  <div style="max-width:440px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
    <div style="background:#171310;padding:22px 28px;">
      <span style="color:#fff;font-weight:800;font-size:18px;">Work<span style="color:#e8623d;">With</span></span>
    </div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 8px;font-size:20px;color:#171310;">Sign in to WorkWith</h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#6b655c;">Tap below to sign in. This link expires shortly.</p>
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#e8623d;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:999px;">Sign in →</a>
      <p style="margin:22px 0 0;font-size:12px;color:#a8a29a;">Not you? Ignore this email.</p>
    </div>
  </div>
</div>
```

### Reset password  (Subject: `Reset your WorkWith password`)
```html
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#faf8f3;padding:32px 0;">
  <div style="max-width:440px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
    <div style="background:#171310;padding:22px 28px;">
      <span style="color:#fff;font-weight:800;font-size:18px;">Work<span style="color:#e8623d;">With</span></span>
    </div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 8px;font-size:20px;color:#171310;">Reset your password</h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#6b655c;">Tap below to choose a new password.</p>
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#e8623d;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:999px;">Set a new password →</a>
      <p style="margin:22px 0 0;font-size:12px;color:#a8a29a;">Didn’t ask for this? Ignore this email — your password is unchanged.</p>
    </div>
  </div>
</div>
```

---

## Phone / SMS (Lebanon-first)
Phone-number signup already works in the app (`/auth/phone`, +961 normalized, SMS
OTP). It needs an SMS provider: Supabase → **Auth → Providers → Phone** → Twilio
Verify (SMS channel ONLY — never enable the WhatsApp channel, it routes through
Meta which the red lines ban). SMS OTP has per-message cost; confirm Lebanon
deliverability with Twilio before relying on it as the primary path.
