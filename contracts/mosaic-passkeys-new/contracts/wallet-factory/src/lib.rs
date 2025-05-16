#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, symbol_short, vec, Address, BytesN, Env, Symbol, 
    IntoVal, Val,
};

#[contract]
pub struct Factory;

#[contracterror]
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub enum Error {
    NotInited = 1,
    AlreadyInited = 2,
    PasskeyAlreadyRegistered = 3,
    PasskeyNotRegistered = 4,
    InvalidCaller = 5,
}

const INITIALIZED_KEY: Symbol = symbol_short!("inited");
const PASSKEY_TO_WALLET_MAP: Symbol = symbol_short!("pk_map");

#[contractimpl]
impl Factory {
    pub fn extend_ttl(env: Env) {
        let max_ttl = env.storage().max_ttl();
        let contract_address = env.current_contract_address();

        env.storage().instance().extend_ttl(max_ttl, max_ttl);
        // Extend TTL for the factory contract's own code and instance
        env.deployer()
            .extend_ttl(contract_address, max_ttl, max_ttl); 
        // The following are less relevant if the factory doesn't deploy other contracts
        // env.deployer()
        //     .extend_ttl_for_code(contract_address.clone(), max_ttl, max_ttl);
        // env.deployer()
        //     .extend_ttl_for_contract_instance(contract_address.clone(), max_ttl, max_ttl);
    }
    
    /// Call once after deploy to initialize the factory.
    pub fn __constructor(env: Env) -> Result<(), Error> {
        if env.storage().instance().has(&INITIALIZED_KEY) {
            return Err(Error::AlreadyInited);
        }

        env.storage().instance().set(&INITIALIZED_KEY, &true);
        // Initialize the map in persistent storage
        env.storage().persistent().set(&PASSKEY_TO_WALLET_MAP, &soroban_sdk::Map::<BytesN<65>, Address>::new(&env));

        Self::extend_ttl(env);

        Ok(())
    }
    
    /// Public initialization function that can be called from CLI
    pub fn initialize(env: Env) -> Result<(), Error> {
        Self::__constructor(env)
    }
    
    /// Check if the contract is already initialized
    pub fn is_initialized(env: Env) -> bool {
        env.storage().instance().has(&INITIALIZED_KEY)
    }

    /// Registers a wallet address for a given passkey public key.
    /// This should be called after a smart wallet has been independently deployed.
    ///
    /// * `pk` – 65-byte SEC-p256r1 public key from the authenticator.
    /// * `wallet_address` – The address of the deployed smart wallet.
    pub fn register_wallet(
        env: Env,
        pk: BytesN<65>,
        wallet_address: Address,
    ) -> Result<(), Error> {
        if !env.storage().instance().has(&INITIALIZED_KEY) {
            return Err(Error::NotInited);
        }

        let mut pk_to_wallet_map = env
            .storage()
            .persistent()
            .get::<Symbol, soroban_sdk::Map<BytesN<65>, Address>>(&PASSKEY_TO_WALLET_MAP)
            .ok_or(Error::NotInited)?; // Should be inited by constructor

        if pk_to_wallet_map.contains_key(pk.clone()) {
            return Err(Error::PasskeyAlreadyRegistered);
        }

        pk_to_wallet_map.set(pk, wallet_address);
        env.storage().persistent().set(&PASSKEY_TO_WALLET_MAP, &pk_to_wallet_map);
        
        Self::extend_ttl(env);
        Ok(())
    }

    /// Retrieves the wallet address associated with a given passkey public key.
    ///
    /// * `pk` – 65-byte SEC-p256r1 public key from the authenticator.
    pub fn get_wallet_by_pk(env: Env, pk: BytesN<65>) -> Result<Address, Error> {
        if !env.storage().instance().has(&INITIALIZED_KEY) {
            return Err(Error::NotInited);
        }

        let pk_to_wallet_map = env
            .storage()
            .persistent()
            .get::<Symbol, soroban_sdk::Map<BytesN<65>, Address>>(&PASSKEY_TO_WALLET_MAP)
            .ok_or(Error::NotInited)?; // Should be inited by constructor

        pk_to_wallet_map.get(pk).ok_or(Error::PasskeyNotRegistered)
    }
}
