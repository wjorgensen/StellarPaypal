# Mosaic Passkeys

A Soroban-based implementation of WebAuthn/Passkeys for authentication on the Stellar blockchain.

## Project Structure

The project consists of two main contracts:

1. **wallet-factory**: A factory contract that deploys new wallet instances initialized with the user's passkey.
2. **smart-wallet**: Implementation of a smart contract wallet with passkey authentication logic.

## Overview

This system allows users to create smart contract wallets on Stellar that can be controlled using their device's passkeys. The general flow is:

1. The user generates a passkey (WebAuthn credential) on their device
2. The wallet-factory contract is called with the public key from the passkey
3. A new smart-wallet contract is deployed and initialized with the passkey as a signer
4. The user can now use their passkey to sign transactions from the wallet

## Development

### Prerequisites

- Rust
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)

### Building

```bash
cargo build --release
```

### Testing

```bash
cargo test
```

## License

MIT 