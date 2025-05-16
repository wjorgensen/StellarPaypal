import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import base64url from 'base64url';
import { Buffer } from 'buffer';
import { 
  Address, 
  BASE_FEE, 
  TimeoutInfinite, 
  Networks
} from '@stellar/stellar-sdk';
import { getRpcClient, NETWORK, FACTORY_CONTRACT_ID, submitTransaction, getAccount } from './soroban';

// Random challenge generator for WebAuthn
export function generateChallenge() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64url.encode(Buffer.from(array));
}

// Create registration options for WebAuthn
export function createRegistrationOptions(username: string): PublicKeyCredentialCreationOptionsJSON {
  return {
    challenge: generateChallenge(),
    rp: {
      name: 'Stellar Passkey Wallet',
      id: window.location.hostname
    },
    user: {
      id: base64url.encode(username),
      name: username,
      displayName: username
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' }, // ES256
    ],
    timeout: 60000,
    attestation: 'direct',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      requireResidentKey: true,
      residentKey: 'required',
      userVerification: 'required'
    }
  };
}

// Create authentication options for WebAuthn
export function createAuthenticationOptions(): PublicKeyCredentialRequestOptionsJSON {
  return {
    challenge: generateChallenge(),
    timeout: 60000,
    userVerification: 'required',
    rpId: window.location.hostname
  };
}

// Deploy a new smart wallet with the user's passkey
export async function deploySmartWallet(
  adminPublicKey: string, 
  passkeyPublicKey: Uint8Array
): Promise<string> {
  try {
    // First load the account
    const account = await getAccount(adminPublicKey);
    
    console.log("Account loaded:", adminPublicKey);
    console.log("Account data:", account);
    
    // For demo purposes - this would need proper implementation with the actual WASM
    console.log("Demo: Would deploy the contract WASM here in a real implementation");
    
    // Using a mock contract address for demo
    const mockContractAddress = new Address('GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI').toString();
    console.log("Deployed mock wallet at:", mockContractAddress);
    
    return mockContractAddress;
  } catch (error) {
    console.error("Error deploying smart wallet:", error);
    throw error;
  }
}

// Register a wallet with the factory
export async function registerWalletWithFactory(
  adminPublicKey: string,
  walletAddress: string,
  passkeyPublicKey: Uint8Array
): Promise<void> {
  try {
    console.log(`Demo: Would register wallet ${walletAddress} with factory ${FACTORY_CONTRACT_ID}`);
    console.log(`Demo: Using admin key ${adminPublicKey}`);
    console.log(`Demo: Passkey public key length: ${passkeyPublicKey.length} bytes`);
    
    // In a real implementation, we would call the factory contract
    
    console.log("Demo: Wallet successfully registered with factory");
  } catch (error) {
    console.error("Error registering wallet:", error);
    throw error;
  }
}

// Look up a wallet by passkey
export async function lookupWalletByPasskey(
  passkeyPublicKey: Uint8Array
): Promise<string> {
  try {
    console.log(`Demo: Would look up wallet by passkey in factory ${FACTORY_CONTRACT_ID}`);
    console.log(`Demo: Passkey public key length: ${passkeyPublicKey.length} bytes`);
    
    // In a real implementation, we would query the factory contract
    
    // Return a mock wallet address for demo
    const mockWalletAddress = new Address('GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI').toString();
    console.log(`Demo: Found wallet at ${mockWalletAddress}`);
    
    return mockWalletAddress;
  } catch (error) {
    console.error("Error looking up wallet:", error);
    throw error;
  }
} 