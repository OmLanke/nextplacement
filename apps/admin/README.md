# Mailer Setup

Configure the following environment variables (e.g., in `.env` at repo root used by `dotenv-cli`):

- SMTP_HOST
- SMTP_PORT (465 for SSL, 587 for TLS)
- SMTP_USER
- SMTP_PASS
- SMTP_FROM (optional, defaults to SMTP_USER)
- SMTP_MAX_CONNECTIONS (optional)
- SMTP_MAX_MESSAGES (optional)

The status update API at `app/api/applications/[applicationId]/status/route.ts` sends an email whenever the status is updated. Templates live in `lib/mail-templates.ts`. 