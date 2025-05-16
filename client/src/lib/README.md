# Stellar Paypal Library Functions

This directory contains the core library functions for the Stellar Paypal application, focusing on Soroban smart contract interactions, authentication with passkeys, and wallet management.

## soroban.ts

Handles interactions with the Soroban RPC and Stellar blockchain.

- `getRpcClient()`: Returns a client for interacting with the Soroban RPC endpoint.
- `getAccount(publicKey)`: Retrieves account details for a given Stellar public key.
- `submitTransaction(tx)`: Builds, submits, and polls for the status of a transaction on the Stellar network.

## passkey.ts

Manages the Passkey authentication system using the PasskeyKit library.

- `account`: Singleton instance of PasskeyKit for client-side operations.
- `backend`: Singleton instance of PasskeyServer for server-side operations.
- Debug utilities for logging and troubleshooting passkey operations.

## passkey-wallet.ts

Handles WebAuthn (passkey) operations specifically for wallet creation and authentication.

- `generateChallenge()`: Creates a random challenge for WebAuthn operations.
- `createRegistrationOptions(username)`: Generates options for registering a new passkey.
- `createAuthenticationOptions()`: Generates options for authenticating with an existing passkey.
- `deploySmartWallet(adminPublicKey, passkeyPublicKey)`: Deploys a new smart wallet contract with the user's passkey.
- `registerWalletWithFactory(adminPublicKey, walletAddress, passkeyPublicKey)`: Registers a wallet with the factory contract.
- `lookupWalletByPasskey(passkeyPublicKey)`: Retrieves a wallet address using the passkey's public key.

## wallet-auth.ts

High-level functions for user authentication using passkeys and smart wallets.

- `signupWithPasskey(username, adminPublicKey)`: Complete flow for registering a new user with a passkey and creating their smart wallet.
- `loginWithPasskey()`: Complete flow for authenticating a user with their passkey and retrieving their wallet.

## Usage Examples

### Creating a New User Wallet

```typescript
import { signupWithPasskey } from './lib/wallet-auth';

const handleSignup = async (username, adminKey) => {
  const result = await signupWithPasskey(username, adminKey);
  if (result.success) {
    console.log(`Wallet created at: ${result.walletAddress}`);
  } else {
    console.error(`Signup failed: ${result.error}`);
  }
};
```

### Authenticating a User

```typescript
import { loginWithPasskey } from './lib/wallet-auth';

const handleLogin = async () => {
  const result = await loginWithPasskey();
  if (result.success) {
    console.log(`Logged in to wallet: ${result.walletAddress}`);
  } else {
    console.error(`Login failed: ${result.error}`);
  }
};
``` 