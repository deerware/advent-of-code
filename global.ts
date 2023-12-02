import fs from 'fs';

export function loadLines(path: string) {
    return fs.readFileSync(path).toString().split('\r\n');
}