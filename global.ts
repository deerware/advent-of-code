import fs from 'fs';

export function loadLines(path: string) {
    return fs.readFileSync('02_Cube_Conundrum/sampleData1.txt').toString().split('\r\n');
}