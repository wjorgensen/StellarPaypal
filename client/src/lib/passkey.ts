// client/src/lib/passkey.ts
import { PasskeyKit, PasskeyServer } from 'passkey-kit';
import type { Signer, SignerLimits, SignerKey, SignerStore } from 'passkey-kit'; // Basic types
import { Buffer } from 'buffer'; // For mock keyId

// Debug logging helper
const logPrefix = '🔑 [PASSKEY LIB]';
const debug = (message: string, data?: any) => {
  if (data) {
    console.log(`${logPrefix} ${message}`, data);
  } else {
    console.log(`${logPrefix} ${message}`);
  }
};

// Make debugging easier by exposing variables in window
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._passkeyDebug = {
    env: {
      NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
      NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
      NEXT_PUBLIC_WALLET_WASM_HASH: process.env.NEXT_PUBLIC_WALLET_WASM_HASH,
      NEXT_PUBLIC_WALLET_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_WALLET_CONTRACT_ADDRESS
    }
  };
}

// Ensure all required environment variables are available
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK;
const walletWasmHash = process.env.NEXT_PUBLIC_WALLET_WASM_HASH; 
const walletFactoryAddress = process.env.NEXT_PUBLIC_WALLET_CONTRACT_ADDRESS;

debug("PasskeyKit Configuration:", {
  rpcUrl: rpcUrl ? `${rpcUrl.substring(0, 10)}...` : undefined,
  networkPassphrase: networkPassphrase ? `${networkPassphrase.substring(0, 10)}...` : undefined,
  walletWasmHash: walletWasmHash ? `${walletWasmHash.substring(0, 10)}...` : undefined,
  walletFactoryAddress // Will be used by service functions, not directly in PasskeyKit constructor unless specified by its API
});

// Client-side wallet instance
let accountInstance: PasskeyKit | undefined;
try {
  if (typeof window !== 'undefined') {
    debug("Running in browser environment");

    if (!rpcUrl || !networkPassphrase || !walletWasmHash) {
      debug("Cannot initialize PasskeyKit: Missing one or more required environment variables (RPC_URL, NETWORK, WALLET_WASM_HASH).", {
        hasRpcUrl: !!rpcUrl,
        hasNetworkPassphrase: !!networkPassphrase,
        hasWalletWasmHash: !!walletWasmHash,
      });
    } else {
      if (window.PublicKeyCredential) {
        debug("WebAuthn is supported ✅");
      } else {
        debug("WebAuthn is NOT supported ❌");
      }

      debug("Attempting to initialize PasskeyKit...");
      accountInstance = new PasskeyKit({
        rpcUrl,
        networkPassphrase,
        walletWasmHash, // This WASM hash is for the type of wallet PasskeyKit manages/deploys
        // contractId: walletFactoryAddress, // Removed based on linter error; factory address will be used by service methods if needed
      });

      debug("PasskeyKit initialized successfully", {
        hasCreateWallet: accountInstance && typeof accountInstance.createWallet === 'function',
        hasConnectWallet: accountInstance && typeof accountInstance.connectWallet === 'function',
        hasSign: accountInstance && typeof accountInstance.sign === 'function'
      });

      // @ts-ignore
      window._passkeyDebug.account = accountInstance;
    }
  } else {
    debug("Not in browser environment, skipping PasskeyKit initialization");
  }
} catch (error) {
  debug("Error initializing PasskeyKit:", error);
}

if (!accountInstance && typeof window !== 'undefined') {
  debug("PasskeyKit initialization failed or critical variables missing. Creating mock account for UI testing.");
  
  accountInstance = {
    createWallet: async (appName: string, userName: string): Promise<any> => { // Using any for mock return type flexibility
      debug("MOCK: createWallet called", { appName, userName });
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockContractId = 'mock-wallet-contract-id-' + Date.now();
      const mockKeyId = Buffer.from('mock-key-id-' + userName);
      debug("MOCK: Wallet created", { contractId: mockContractId });
      return {
        rawResponse: { id: 'mock-raw-id', rawId: 'mock-raw-id', response: { clientDataJSON: '', attestationObject: ''}, type: 'public-key' },
        keyId: mockKeyId,
        keyIdBase64: mockKeyId.toString('base64'),
        contractId: mockContractId,
        signedTx: { xdr: 'mock-tx-xdr' } 
      };
    },
    connectWallet: async (options?: { walletPublicKey?: string }): Promise<any> => { // Using any for mock return type
      debug("MOCK: connectWallet called", options);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!options?.walletPublicKey) throw new Error("Mock connectWallet requires walletPublicKey");
      const mockKeyId = Buffer.from('mock-key-id-connected-' + options.walletPublicKey);
      return {
        rawResponse: { id: 'mock-auth-resp-id', rawId: 'mock-auth-resp-id', response: { clientDataJSON: '', authenticatorData: '', signature: '', userHandle: '' }, type: 'public-key' },
        keyId: mockKeyId,
        keyIdBase64: mockKeyId.toString('base64'),
        contractId: options.walletPublicKey,
      };
    },
    sign: async (txXdr: string | { xdr: string } , options?: { walletPublicKey?: string, keyId?: string }): Promise<any> => { // Using any for mock return type
      debug("MOCK: sign called", { txXdr, options });
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!options?.walletPublicKey) throw new Error("Mock sign requires walletPublicKey");
      return { xdr: `${typeof txXdr === 'string' ? txXdr : txXdr.xdr}_signed_by_mock_${options.walletPublicKey}` };
    },
    call: async (params: { contractId: string, method: string, args?: any[], fee?: number }): Promise<any> => {
      debug("MOCK: call called", params);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { result: `mock_result_for_${params.method}`, contractId: params.contractId };
    }
  } as unknown as PasskeyKit; // Cast to PasskeyKit using unknown as intermediate step
  // @ts-ignore
  window._passkeyDebug.mockAccount = accountInstance;
  debug("Mock account instance created and assigned to window._passkeyDebug.mockAccount");
}

export const account = accountInstance as PasskeyKit; 

let backendInstance: PasskeyServer | undefined;
try {
  if (typeof process !== 'undefined' && process.env && process.env.RPC_URL) {
    debug("Initializing PasskeyServer (backend)...");
    backendInstance = new PasskeyServer({
      rpcUrl: process.env.RPC_URL,
      launchtubeUrl: process.env.LAUNCHTUBE_URL,
      launchtubeJwt: process.env.LAUNCHTUBE_JWT,
      mercuryUrl: process.env.MERCURY_URL,
      mercuryJwt: process.env.MERCURY_JWT,
      mercuryProjectName: process.env.MERCURY_PROJECT_NAME || 'passkey-wallets',
    });
    debug("PasskeyServer initialized successfully");
  } else {
    debug("Skipping PasskeyServer initialization (not in a compatible backend environment or missing RPC_URL)");
  }
} catch (error) {
  debug("Error initializing PasskeyServer:", error);
}

export const backend = backendInstance;

export { PasskeyKit, PasskeyServer };
export type { Signer, SignerLimits, SignerKey, SignerStore };
