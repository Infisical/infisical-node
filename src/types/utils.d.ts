export interface EncryptAsymmetric {
    plaintext: string;
    publicKey: string;
    privateKey: string;
}

export interface DecryptAsymmetric {
    ciphertext: string;
    nonce: string;
    publicKey: string;
    privateKey: string;
}

export interface EncryptSymmetric {
    plaintext: string;
    key: string;
}

export interface DecryptSymmetric {
    ciphertext: string;
    iv: string;
    tag: string;
    key: string;
}




