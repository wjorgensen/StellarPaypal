import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/passkey';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();         // expects { tx: <base64-XDR> }
    const hash = await backend.send(body.tx);
    return NextResponse.json({ hash });
  } catch (error) {
    console.error('Error sending transaction:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 