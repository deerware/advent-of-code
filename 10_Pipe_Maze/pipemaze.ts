import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';
import * as global from '../global';

export default async function main() {
    log("Day 10: Pipe Maze");

    global.startExecution();
    if (logResult('Part 1 test 1', await part1(loadLines('10_Pipe_Maze/sampleData1.txt')), 4)) {
        global.logExectionTime();

        global.startExecution();
        if (logResult('Part 1 test 2', await part1(loadLines('10_Pipe_Maze/sampleData2.txt')), 8)) {
            global.logExectionTime();

            global.startExecution();
            logResult('Part 1', await part1(loadLines('10_Pipe_Maze/input.txt')), 7173)
        }
    }
    global.logExectionTime();

    log();

    global.startExecution();
    if (logResult('Part 2 test 1', await part2(loadLines('10_Pipe_Maze/sampleData3.txt')), 8)) {
        global.logExectionTime();

        global.startExecution();
        if (logResult('Part 1 test 2', await part2(loadLines('10_Pipe_Maze/sampleData4.txt')), 10)) {
            global.logExectionTime();

            global.startExecution();
            logResult('Part 2', await part1(loadLines('10_Pipe_Maze/input.txt')))
        }
    }
    global.logExectionTime();
}

type Pos = { l: number, c: number };

async function part1(data: string[], maze: Pos[] = []): Promise<number> {
    const start = findStart(data);
    const connected = startLeadsTo(data, start);


    let p1 = start;
    let p2 = start;
    let c1 = connected[0];
    let c2 = connected[1];

    maze.push(start, c1, c2);

    let steps = 1;
    while (true) {
        steps++;

        const n1 = leadsTo1(data[c1.l][c1.c], c1, p1);
        const n2 = leadsTo1(data[c2.l][c2.c], c2, p2);

        if (n1.l === n2.l && n1.c === n2.c) {
            maze.push(n1);
            return steps;
        }

        p1 = c1;
        p2 = c2;
        c1 = n1;
        c2 = n2;

        maze.push(c1);
        maze.push(c2);
    }
}

async function part2(data: string[]): Promise<number> {
    const maze: Pos[] = [];
    part1(data, maze);

    const prev: Pos[] = [];
    for (const pos of maze) {
        const enclosed = encloses(data[pos.l][pos.c], maze, pos);
    }

    return -Infinity;
}

function findStart(data: string[]): Pos {
    for (let l = 0; l < data.length; l++) {
        for (let c = 0; c < data[l].length; c++) {
            if (data[l][c] === 'S')
                return { l, c };
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

    return connected as [Pos, Pos];
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
        case '.':
            return [];
    }

    throw new Error(`Unknown symbol: ${symbol}`);
}

function encloses(symbol: string, maze: Pos[], pos: Pos) {
    let result: [Pos[], Pos[]];

    switch (symbol) {
        case '|':
            result = [
                [
                    { l: pos.l, c: pos.c - 1 },
                ],
                [
                    { l: pos.l, c: pos.c + 1 },
                ]
            ]
            break;
        case '-':
            result = [
                [
                    { l: pos.l - 1, c: pos.c },
                ],
                [
                    { l: pos.l + 1, c: pos.c },
                ]
            ]
            break;
        case 'L':
            result = [
                [
                    { l: pos.l - 1, c: pos.c + 1 },
                ],
                [
                    { l: pos.l, c: pos.c - 1 },
                    { l: pos.l + 1, c: pos.c },
                ]
            ];
            break;
        case 'J':
            result = [
                [
                    { l: pos.l - 1, c: pos.c - 1 },
                ],
                [
                    { l: pos.l, c: pos.c + 1 },
                    { l: pos.l + 1, c: pos.c },
                ]
            ];
            break;
        case '7':
            result = [
                [
                    { l: pos.l + 1, c: pos.c - 1 },
                ],
                [
                    { l: pos.l, c: pos.c + 1 },
                    { l: pos.l - 1, c: pos.c },
                ]
            ];
            break;
        case 'F':
            result = [
                [
                    { l: pos.l + 1, c: pos.c + 1 },
                ],
                [
                    { l: pos.l, c: pos.c - 1 },
                    { l: pos.l - 1, c: pos.c },
                ]
            ];
            break;
        case 'S':
        case '.':
            return [[], []];
            break;
        default:
            throw new Error(`Unknown symbol: ${symbol}`);
    }

    return [
        result[0].filter(x => !maze.some(y => y.l === x.l && y.c === x.c)),
        result[1].filter(x => !maze.some(y => y.l === x.l && y.c === x.c))
    ];
}


// function findBounds(maze: Pos[]) {
//     let minL = Infinity;
//     let minC = Infinity;
//     let maxL = -Infinity;
//     let maxC = -Infinity;

//     for (const pos of maze) {
//         if (pos.l < minL)
//             minL = pos.l;
//         if (pos.c < minC)
//             minC = pos.c;
//         if (pos.l > maxL)
//             maxL = pos.l;
//         if (pos.c > maxC)
//             maxC = pos.c;
//     }

//     return { min: { l: minL, c: minC }, max: { l: maxL, c: maxC } };
// }

// function findEligible(data: string[], maze: Pos[], bounds: { min: Pos, max: Pos }) {
//     const eligible: Pos[] = [];

//     for (let l = bounds.min.l; l < bounds.max.l; l++) {
//         for (let c = bounds.min.c; c < bounds.max.c; c++) {
//             if (data[l][c] !== '.')
//                 continue;

//             if (
//                 maze.some(x => x.l < l) &&
//                 maze.some(x => x.l > l) &&
//                 maze.some(x => x.c < l) &&
//                 maze.some(x => x.c > l)
//             )
//                 eligible.push({ l, c });
//         }
//     }

//     return eligible;
// }