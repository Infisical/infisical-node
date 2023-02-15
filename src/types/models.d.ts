export interface Secret {
    id: string;
    version: number;
    workspace: string;
    type: string;
    environment: string;
    secretKeyCiphertext: string;
    secretKeyIV: string;
    secretKeyTag: string;
    secretValueCiphertext: string;
    secretValueIV: string;
    secretValueTag: string;
    secretCommentCiphertext: string;
    secretCommentIV: string;
    secretCommentTag: string;
    createdAt: string;
    updatedAt: string;
}