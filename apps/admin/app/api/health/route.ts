import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // You can add additional health checks here
    // For example, database connectivity, external service checks, etc.
    
    return NextResponse.json(
      { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'admin-app'
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