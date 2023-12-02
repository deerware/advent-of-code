import fs from 'fs';
import { colors } from './types';
import log from './log';

export function logResult(title: string, result: number, expected?: number) {
    const pass = result === expected;

    if (expected !== undefined)
        log((pass ? colors.fg.green : colors.fg.red) + `${title}: ${result} ${pass ? '===' : '!=='} ${expected} ${pass ? "PASS" : "FAIL"}`);
    else
        log(colors.fg.yellow + `${title}: ${result}`);
}

export function loadLines(path: string) {
    return fs.readFileSync(path).toString().split('\r\n');
}