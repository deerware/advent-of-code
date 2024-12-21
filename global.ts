import fs from 'fs';
import { colors } from './types';
import log from './log';
import inputCrypt from './inputCrypt';

let startDate: Date;

type Entry<I, E extends any[], R> = [
    name: string,
    fn: (data: I, ...extra: E) => R | Promise<R>,
    path: string,
    expected: R | ((result: R) => boolean) | null,
    ...extra: E
];

export async function run<I, E extends any[], R>(dayPath: string, entries: (Entry<I, E, R> | null | false)[], dataParser?: (data: string[]) => I): Promise<void>;
export async function run<I>(dayPath: string, entries: (Entry<I, any[], any> | null | false)[], dataParser: undefined | ((data: string[]) => I), noTypeCheck: true): Promise<void>;
export async function run<I, E extends any[], R>(dayPath: string, entries: (Entry<I, any[], any> | null | false)[], dataParser?: (data: string[]) => I, noTypeCheck = false) {
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
            const lines = loadLines(dayPath + '/' + path);
            const result = await fn((dataParser ? dataParser(lines) : lines) as any, ...extra);
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

export function e<I, E extends any[], R>(params: Entry<I, E, R>): Entry<I, E, R>
export function e<I, E extends any[], R>(...params: Entry<I, E, R>): Entry<I, E, R>
export function e<I, E extends any[], R>(...params: Entry<I, E, R> | [Entry<I, E, R>]): Entry<I, E, R> {
    if (Array.isArray(params[0]) && params.length === 1)
        return params[0];

    return params as any;
}

export function logResult<V>(title: string, result: V, expected?: V | ((n: V) => boolean)) {
    const pass = (typeof expected === 'function') ? (expected as ((n: V) => boolean))(result) : result === expected;

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
    return inputCrypt
        .decrypt(fs.readFileSync(path).toString())
        .split(/\r?\n/);
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
        return `${minutes}m ${Math.round(seconds % 60 * 100) / 100}s`;
    } else if (seconds >= 10) {
        return `${Math.round(seconds % 62 * 100) / 100}s`;
    } else {
        return `${duration}ms`;
    }
}