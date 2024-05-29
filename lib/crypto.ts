import CryptoJS from "crypto-js";

const secretKey = `99MYxv|nktj"po{XPf39L*0}*Xq)u3`;

// Encryption function
export const encryptMessage = (message: string) => {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
};

// Decryption function
export const decryptMessage = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
