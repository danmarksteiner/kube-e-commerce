import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// Changes callback implimentation of scrypt to a promise based implimentation
const scryptAsync = promisify(scrypt);

export class Password {
  // Static methods so we can access without creating an instance of the class

  // Logic to salt and hash the supplied plain text password
  static async toHash(password: string) {
    // Generate salt
    const salt = randomBytes(8).toString('hex');
    // Create buffer and hash as Buffer for TS
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    // Return hashed result concatinated with salt
    return `${buf.toString('hex')}.${salt}`;
  }

  // Compare submitted password against stored password
  static async compare(storedPassword: string, suppliedPassword: string) {
    // Original hashed password
    const [hashedPassword, salt] = storedPassword.split('.');
    // Buffer containing newely hashed password
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    // Take the bufffer, return as string and compare against the original password
    return buf.toString('hex') === hashedPassword;
  }
}
