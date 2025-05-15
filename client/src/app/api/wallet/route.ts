import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/passkey';

// Get contract ID from passkey ID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const passkeyId = url.searchParams.get('passkeyId');
    
    if (!passkeyId) {
      return NextResponse.json({ error: 'Missing passkeyId parameter' }, { status: 400 });
    }
    
    const contractId = await backend.getContractId({ keyId: passkeyId });
    
    if (!contractId) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }
    
    return NextResponse.json({ contractId });
  } catch (error) {
    console.error('Error getting contract ID:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Get signers for a contract
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId } = body;
    
    if (!contractId) {
      return NextResponse.json({ error: 'Missing contractId in request body' }, { status: 400 });
    }
    
    const signers = await backend.getSigners(contractId);
    return NextResponse.json({ signers });
  } catch (error) {
    console.error('Error getting signers:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 