import { NextResponse } from 'next/server'
import { getMailer } from '@/lib/mailer'
import { db } from '@workspace/db'
import { sql } from '@workspace/db/drizzle'

export async function GET() {
  try {
    const envSeen = {
      SMTP_URL: Boolean(process.env.SMTP_URL || process.env.MAIL_URL),
      SMTP_HOST: Boolean(process.env.SMTP_HOST || process.env.MAIL_HOST),
      SMTP_PORT: Boolean(process.env.SMTP_PORT || process.env.MAIL_PORT),
      SMTP_USER: Boolean(process.env.SMTP_USER || process.env.SMTP_USERNAME || process.env.MAIL_USER || process.env.MAIL_USERNAME),
      SMTP_PASS: Boolean(process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.MAIL_PASS || process.env.MAIL_PASSWORD),
      SMTP_FROM: Boolean(process.env.SMTP_FROM),
    }

    let smtp: { ok: boolean; message?: string } = { ok: false }
    try {
      await getMailer().verify()
      smtp = { ok: true }
    } catch (e) {
      smtp = { ok: false, message: e instanceof Error ? e.message : 'unknown error' }
    }

    let database: { ok: boolean; message?: string } = { ok: false }
    try {
      await db.execute(sql`select 1`)
      database = { ok: true }
    } catch (e) {
      database = { ok: false, message: e instanceof Error ? e.message : 'unknown error' }
    }

    return NextResponse.json(
      { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'admin-app',
        smtp,
        database,
        envSeen
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        service: 'admin-app'
      },
      { status: 500 }
    )
  }
} 