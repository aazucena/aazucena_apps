import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'UP', 
      timestamp: new Date().toISOString(),
      service: 'analytics',
      framework: 'Next.js',
    },
    { status: 200 }
  );
}
