import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { Buffer } from 'buffer';
import { 
  createRegistrationOptions, 
  createAuthenticationOptions, 
  deploySmartWallet, 
  registerWalletWithFactory,
  lookupWalletByPasskey
} from './passkey-wallet';

// Handle user signup with passkey
export async function signupWithPasskey(
  username: string, 
  adminPublicKey: string
): Promise<{ 
  success: boolean;
  walletAddress?: string;
  error?: string;
}> {
  try {
    console.log('Signup: Creating WebAuthn credential options');
    // 1. Create WebAuthn credential options
    const options = createRegistrationOptions(username);
    
    console.log('Signup: Starting registration process with browser');
    // 2. Start registration (triggers browser passkey UI)
    const credential = await startRegistration({
      optionsJSON: options
    });
    
    console.log('Signup: Registration successful, processing attestation');
    // 3. Extract the public key from attestation response
    // Note: In a real implementation, you would verify this attestation response
    // on the server side before proceeding
    const attestationObject = Buffer.from(
      credential.response.attestationObject,
      'base64'
    );
    
    // Extract public key (simplified for demo)
    // In reality, you would need to parse the CBOR-encoded attestationObject
    // and extract the correct public key bytes
    const publicKeyBytes = new Uint8Array(65).fill(1); // Placeholder for the actual public key
    
    console.log('Signup: Deploying smart wallet');
    // 4. Deploy a new smart wallet with the passkey
    const walletAddress = await deploySmartWallet(adminPublicKey, publicKeyBytes);
    
    console.log('Signup: Wallet deployed, registering with factory');
    // 5. Register the wallet with the factory
    await registerWalletWithFactory(adminPublicKey, walletAddress, publicKeyBytes);
    
    console.log('Signup: Complete');
    return {
      success: true,
      walletAddress
    };
  } catch (error) {
    console.error('Error in signupWithPasskey:', error);
    
    // More detailed error information
    let errorMessage = 'Unknown error during signup';
    
    if (error instanceof Error) {
      errorMessage = `${error.name}: ${error.message}`;
      console.error('Error stack:', error.stack);
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Handle user login with passkey
export async function loginWithPasskey(): Promise<{
  success: boolean;
  walletAddress?: string;
  error?: string;
}> {
  try {
    console.log('Login: Creating WebAuthn authentication options');
    // 1. Create WebAuthn authentication options
    const options = createAuthenticationOptions();
    
    console.log('Login: Starting authentication process with browser');
    // 2. Start authentication (triggers browser passkey UI)
    const credential = await startAuthentication({
      optionsJSON: options
    });
    
    console.log('Login: Authentication successful, looking up wallet');
    // 3. Extract the public key from the credential ID
    // This is simplified - normally you'd get this from the server
    // which would have stored it during registration
    const publicKeyBytes = new Uint8Array(65).fill(1); // Placeholder
    
    // 4. Look up the wallet address in the factory
    const walletAddress = await lookupWalletByPasskey(publicKeyBytes);
    
    console.log('Login: Complete, wallet found');
    return {
      success: true,
      walletAddress
    };
  } catch (error) {
    console.error('Error in loginWithPasskey:', error);
    
    // More detailed error information
    let errorMessage = 'Unknown error during login';
    
    if (error instanceof Error) {
      errorMessage = `${error.name}: ${error.message}`;
      console.error('Error stack:', error.stack);
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
} 