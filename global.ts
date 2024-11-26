import fs from 'fs';
import { colors } from './types';
import log from './log';

let startDate: Date;

type Entry = [name: string, ((path: string[], ...extra: any[]) => number | Promise<number>), path: string, expected: number | ((result: number) => boolean) | null, ...extra: any[]];
export async function run(dayPath: string, entries: (Entry | null | false)[]) {
    for (let entry of entries) {
        if (entry === null) {
            log();
            continue;
        }
        if (entry === false) {
            log(colors.fg.gray, 'Break');
            break;
        }
        startExecution();
        const [name, fn, path, expected, ...extra] = entry;
        try {
            const result = await fn(loadLines(dayPath + '/' + path), ...extra);
            const success = logResult(name, result, expected === null ? undefined : expected);
            logExectionTime();
            if (!success) {
                log(colors.fg.gray, 'Attempt unsuccessful.');
                break;
            }
        } catch (e: any) {
            log(colors.fg.red, `${name}: <ERROR> !== ${expected} FAIL`);
            log(colors.fg.gray, e.message);
            logExectionTime();
            break;
        }
    }
}

export function logResult(title: string, result: number, expected?: number | ((n: number) => boolean)) {
    const pass = (typeof expected === 'function') ? expected(result) : result === expected;

    if (expected !== undefined)
        log(pass ? colors.fg.green : colors.fg.red, `${title}: ${result} ${pass ? '===' : '!=='} ${expected} ${pass ? "PASS" : "FAIL"}`);
    else
        log(colors.fg.yellow, `${title}: ${result}`);

    return pass || expected === undefined;
}

export function startExecution() {
    startDate = new Date();
}

export function getExecutionTime() {
    return `${(parseDuration(new Date().getTime() - startDate.getTime()))}`;
}

export function logExectionTime() {
    log(colors.fg.gray, `Executed in ${getExecutionTime()}`);
}

export function loadLines(path: string) {
    return fs.readFileSync(path).toString().split(/\r?\n/);
}

export function regexIndexOf(string: string, regex: RegExp, startpos?: number) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

function parseDuration(duration: number) {
    const seconds = Math.floor(duration) / 1000;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours >= 1) {
        return `${hours}h ${minutes % 24}m ${seconds % 60}s`;
    } else if (minutes >= 1) {
        return `${minutes}m ${seconds % 60}s`;
    } else if (seconds >= 10) {
        return `${seconds}s`;
    } else {
        return `${duration}ms`;
    }
}