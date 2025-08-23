import * as CryptoJS from 'crypto-js';
import {environment} from '../../../environments/environment';

export class EncryptionUtil {
  private static encryptionKey: string = environment.encryptionKey;

  /**
   * Criptografa o texto fornecido
   * @param text - O texto que será criptografado
   * @returns O texto criptografado
   */
  static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  /**
   * Descriptografa o texto fornecido
   * @param encryptedText - O texto criptografado
   * @returns O texto original
   */
  static decrypt(encryptedText: string): string {
    return CryptoJS.AES.decrypt(encryptedText, this.encryptionKey).toString(CryptoJS.enc.Utf8);
  }
}
