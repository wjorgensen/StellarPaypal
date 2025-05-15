// client/src/lib/passkey.ts
import { PasskeyKit, PasskeyServer } from 'passkey-kit';

// Client-side wallet instance
export const account = new PasskeyKit({
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  networkPassphrase: process.env.NEXT_PUBLIC_NETWORK!,
  walletWasmHash: process.env.NEXT_PUBLIC_WALLET_WASM_HASH!,
});

// Server-side helper
export const backend = new PasskeyServer({
  rpcUrl: process.env.RPC_URL!,
  launchtubeUrl: process.env.LAUNCHTUBE_URL,
  launchtubeJwt: process.env.LAUNCHTUBE_JWT,
  mercuryUrl: process.env.MERCURY_URL,
  mercuryJwt: process.env.MERCURY_JWT,
  mercuryProjectName: process.env.MERCURY_PROJECT_NAME || 'passkey-wallets',
});

// Re-export types and components for convenience
export { 
  PasskeyKit, 
  PasskeyServer,
  SignerKey,  
  SignerStore,
  type Signer, 
  type SignerLimits 
} from 'passkey-kit';
