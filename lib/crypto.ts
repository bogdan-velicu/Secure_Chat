import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { saveKey, getKey } from "./secureStore";

// Generate and store a new key pair
export async function generateAndStoreKeyPair() {
  const keyPair = nacl.box.keyPair();
  await saveKey("publicKey", naclUtil.encodeBase64(keyPair.publicKey));
  await saveKey("secretKey", naclUtil.encodeBase64(keyPair.secretKey));
}

export async function getStoredKeyPair() {
  const publicKey = await getKey("publicKey");
  const secretKey = await getKey("secretKey");
  if (!publicKey || !secretKey) throw new Error("Key pair not found");
  return {
    publicKey: naclUtil.decodeBase64(publicKey),
    secretKey: naclUtil.decodeBase64(secretKey),
  };
}

// Encrypt message
export const encryptMessage = (
  message: string,
  nonce: Uint8Array,
  publicKey: Uint8Array,
  secretKey: Uint8Array,
) => {
  const messageUint8 = naclUtil.decodeUTF8(message);
  const encrypted = nacl.box(messageUint8, nonce, publicKey, secretKey);
  return naclUtil.encodeBase64(encrypted);
};

// Decrypt message
export const decryptMessage = (
  encryptedMessage: string,
  nonce: Uint8Array,
  publicKey: Uint8Array,
  secretKey: Uint8Array,
) => {
  const messageUint8 = naclUtil.decodeBase64(encryptedMessage);
  const decrypted = nacl.box.open(messageUint8, nonce, publicKey, secretKey);
  if (!decrypted) {
    throw new Error("Decryption failed");
  }
  return naclUtil.encodeUTF8(decrypted);
};

// Generate a nonce
export const generateNonce = () => {
  return nacl.randomBytes(nacl.box.nonceLength);
};
