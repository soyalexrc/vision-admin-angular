import * as CryptoJS from "crypto-js";

export const masterCryptoKey = '123456$#@$^@1ERF'

export function decryptValue(value: any): string {
  const key = CryptoJS.enc.Utf8.parse(masterCryptoKey);
  const iv = CryptoJS.enc.Utf8.parse(masterCryptoKey);
  const decrypted = CryptoJS.AES.decrypt(value, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });


  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function encryptValue(value: any): string {
  const key = CryptoJS.enc.Utf8.parse(masterCryptoKey);
  const iv = CryptoJS.enc.Utf8.parse(masterCryptoKey);
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

  return encrypted.toString();
}

