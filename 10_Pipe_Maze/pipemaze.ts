import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';
import * as global from '../global';

export default async function main() {
    log("Day 10: Pipe Maze");

    global.startExecution();
    if (logResult('Part 1 test 4', await part1(loadLines('10_Pipe_Maze/sampleData1.txt')), 4)) {
        global.logExectionTime();

        global.startExecution();
        if (logResult('Part 1 test 2', await part1(loadLines('10_Pipe_Maze/sampleData2.txt')), 8)) {
            global.logExectionTime();

            global.startExecution();
            logResult('Part 1', await part1(loadLines('10_Pipe_Maze/input.txt')))
        }
    }
    global.logExectionTime();

    // log();

    // global.startExecution();
    // if (logResult('Part 2 test', await part2(loadLines('10_Pipe_Maze/sampleData3.txt')), 0)) {
    //     global.logExectionTime();

    //     global.startExecution();
    //     logResult('Part 2', await part2(loadLines('10_Pipe_Maze/input.txt')))
    // }
    // global.logExectionTime();
}

type Pos = { l: number, c: number };

async function part1(data: string[]): Promise<number> {
    const start = findStart(data);
    const connected = startLeadsTo(data, start);

    let p1 = start;
    let p2 = start;
    let c1 = connected[0];
    let c2 = connected[1];
    let steps = 1;
    while (true) {
        steps++;

        const n1 = leadsTo1(data[c1.l][c1.c], c1, p1);
        const n2 = leadsTo1(data[c2.l][c2.c], c2, p2);

        if (n1.l === n2.l && n1.c === n2.c)
            return steps;

        p1 = c1;
        p2 = c2;
        c1 = n1;
        c2 = n2;
    }

    return -Infinity;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}

function findStart(data: string[]): Pos {
    for (let l in data) {
        for (let c = 0; c < data[l].length; c++) {
            if (data[l][c] === 'S')
                return { l: parseInt(l), c: parseInt(c) };
        }
    }
    throw new Error('Start not found');
}

function startLeadsTo(data: string[], start: Pos): [Pos, Pos] {
    const connected: Pos[] = [];

    for (let l = start.l - 1; l <= start.l + 1; l++) {
        for (let c = start.c - 1; c <= start.c + 1; c++) {
            if (l < 0 || c < 0)
                continue;

            const connections = leadsTo(data[l][c], { l, c }, start);
            if (connections.length === 1)
                connected.push({ l, c });
        }
    }

    if (connected.length !== 2)
        throw new Error(`Start has ${connected.length} connections`);

    return connected;
}

function leadsTo(symbol: string, pos: Pos, prev: Pos): Pos[] {
    const connections = connects(symbol, pos);
    return connections.filter(x => x.l !== prev.l || x.c !== prev.c);
}

function leadsTo1(symbol: string, pos: Pos, prev: Pos): Pos {
    const connections = connects(symbol, pos);
    const connection = connections.filter(x => x.l !== prev.l || x.c !== prev.c);
    if (connection.length !== 1)
        throw new Error(`Didn't find unique connection!`);

    return connection[0];
}

function connects(symbol: string, pos: Pos): [Pos, Pos] | [] {
    switch (symbol) {
        case '|':
            return [{ l: pos.l - 1, c: pos.c }, { l: pos.l + 1, c: pos.c }];
        case '-':
            return [{ l: pos.l, c: pos.c - 1 }, { l: pos.l, c: pos.c + 1 }];
        case 'L':
            return [{ l: pos.l - 1, c: pos.c }, { l: pos.l, c: pos.c + 1 }];
        case 'J':
            return [{ l: pos.l - 1, c: pos.c }, { l: pos.l, c: pos.c - 1 }];
        case '7':
            return [{ l: pos.l + 1, c: pos.c }, { l: pos.l, c: pos.c - 1 }];
        case 'F':
            return [{ l: pos.l + 1, c: pos.c }, { l: pos.l, c: pos.c + 1 }];
        case 'S':
            log('Warning! Found S!');
        case '.':
            return [];
    }

    throw new Error(`Unknown symbol: ${symbol}`);
}