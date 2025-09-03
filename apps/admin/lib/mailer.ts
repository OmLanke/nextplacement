import nodemailer, { Transporter } from 'nodemailer';

/**
 * Singleton pooled transporter for server-side usage
 */
let cachedTransporter: Transporter | null = null;

function getEnv(name: string, fallbacks: string[] = []): string | undefined {
  const keys = [name, ...fallbacks];
  for (const key of keys) {
    const val = process.env[key];
    if (val && String(val).length > 0) return val;
  }
  return undefined;
}

function createTransporter(): Transporter {
  // Support URL-style config first
  const smtpUrl = getEnv('SMTP_URL', ['MAIL_URL']);
  const host = getEnv('SMTP_HOST', ['MAIL_HOST']);
  const portStr = getEnv('SMTP_PORT', ['MAIL_PORT']);
  const user = getEnv('SMTP_USER', ['SMTP_USERNAME', 'MAIL_USER', 'MAIL_USERNAME']);
  const pass = getEnv('SMTP_PASS', ['SMTP_PASSWORD', 'MAIL_PASS', 'MAIL_PASSWORD']);
  const secureStr = getEnv('SMTP_SECURE');

  if (smtpUrl) {
    return nodemailer.createTransport({
      pool: true,
      url: smtpUrl,
      maxConnections: Number(process.env.SMTP_MAX_CONNECTIONS || 5),
      maxMessages: Number(process.env.SMTP_MAX_MESSAGES || 100),
    } as any);
  }

  const port = Number(portStr || 587);
  const isSecure = secureStr ? /^(1|true|yes)$/i.test(secureStr) : port === 465;

  if (!host || !user || !pass) {
    const missing: string[] = [];
    if (!host) missing.push('SMTP_HOST');
    if (!user) missing.push('SMTP_USER');
    if (!pass) missing.push('SMTP_PASS');
    throw new Error(
      `SMTP configuration missing. Please set ${missing.join(', ')} (alternatives supported: SMTP_URL, SMTP_USERNAME/SMTP_PASSWORD, MAIL_*).`
    );
  }

  return nodemailer.createTransport({
    pool: true,
    host,
    port,
    secure: isSecure,
    auth: { user, pass },
    maxConnections: Number(process.env.SMTP_MAX_CONNECTIONS || 5),
    maxMessages: Number(process.env.SMTP_MAX_MESSAGES || 100),
  });
}

export function getMailer(): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = createTransporter();
  }
  return cachedTransporter;
}

export type SendEmailParams = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  fromOverride?: string;
};

export async function sendEmail({ to, subject, html, text, fromOverride }: SendEmailParams): Promise<void> {
  const transporter = getMailer();
  const from = fromOverride || process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
} 