import nacl from "tweetnacl";
import { Buffer } from "buffer";

const keyPair = nacl.box.keyPair();
const publicKey = keyPair.publicKey;
const privateKey = keyPair.secretKey;

const stringToUint8Array = (str: string) => {
  const arr = new Uint8Array(str.length * 2);
  for (let i = 0, j = 0; i < str.length; i++, j += 2) {
    arr[j] = str.charCodeAt(i) & 0xff;
    arr[j + 1] = str.charCodeAt(i) >> 8;
  }
  return arr;
};

const uint8ArrayToString = (arr: Uint8Array) => {
  let str = "";
  for (let i = 0; i < arr.length; i += 2) {
    str += String.fromCharCode(arr[i] + (arr[i + 1] << 8));
  }
  return str;
};

const encode = (message: string) => stringToUint8Array(message);
const decode = (message: Uint8Array) => uint8ArrayToString(message);

function encodeToBase64(buffer: Uint8Array) {
  return Buffer.from(buffer).toString("base64");
}

function decodeFromBase64(buffer: string) {
  return Buffer.from(buffer, "base64");
}

const encryptMessage = (message: string) => {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encrypted = nacl.box(encode(message), nonce, publicKey, privateKey);
  return {
    message: encodeToBase64(encrypted),
    nonce: encodeToBase64(nonce),
  };
};

const decryptMessage = (message: string, nonce: string) => {
  const decrypted = nacl.box.open(
    decodeFromBase64(message),
    decodeFromBase64(nonce),
    publicKey,
    privateKey,
  );
  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }
  return decode(decrypted);
};

export { encryptMessage, decryptMessage };
