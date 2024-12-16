import crypto from 'crypto';
import fs from 'fs';

const prefix = `=== MJE ENCRYPTED ===\n`
const key = crypto
    .createHash('sha256')
    .update(fs.readFileSync('secrets/input.txt', 'utf-8').trim())
    .digest('hex')
    .substring(0, 32)
const encryptionIV = crypto
    .createHash('sha256')
    .update(fs.readFileSync('secrets/iv.txt', 'utf-8').trim())
    .digest('hex')
    .substring(0, 16)

export default {
    encrypt(text: string) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, encryptionIV);
        return prefix + Buffer.from(
            cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
        ).toString('base64');
    },
    decrypt(text: string) {
        if (!text.startsWith(prefix))
            return text;

        const buff = Buffer.from(text.substring(prefix.length), 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, encryptionIV);
        return (
            decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
            decipher.final('utf8')
        );
    }
}