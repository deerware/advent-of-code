import fs from 'fs';
import { colors } from './types';
import log from './log';

export function logResult(title: string, result: number, expected?: number) {
    const pass = result === expected;

    if (expected !== undefined)
        log((pass ? colors.fg.green : colors.fg.red) + `${title}: ${result} ${pass ? '===' : '!=='} ${expected} ${pass ? "PASS" : "FAIL"}`);
    else
        log(colors.fg.yellow + `${title}: ${result}`);

    return pass || expected === undefined;
}

export function loadLines(path: string) {
    return fs.readFileSync(path).toString().split('\r\n');
}

export function regexIndexOf(string: string, regex: RegExp, startpos?: number) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}