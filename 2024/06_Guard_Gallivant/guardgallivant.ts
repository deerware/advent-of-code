import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import { Worker, isMainThread, parentPort } from 'worker_threads';
import { z } from 'zod';

if (!isMainThread) {
    parentPort!.once('message', (_message) => {
        const message = z.object({
            data: z.any(),
            startAt: z.number(),
            take: z.number(),
        }).parse(_message);
        part2Worker(message.data, message.startAt, message.take);
    });
}

export default async function guardgallivant() {
    log('Day 6: Guard Gallivant');

    await global.run('2024/06_Guard_Gallivant', [
        ['Part 1 test 1', part1, 'sampleData.txt', 41],
        ['Part 1', part1, 'input.txt', 5305],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', 6],
        ['Part 2', part2, 'input.txt', 2143],
    ], parseData);
}

enum DIR {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

type Pos = { r: number, c: number };
type PosDir = Pos & { dir: DIR };
type Data = { obstacles: Pos[], startingPos: Pos, pos: Pos, dir: DIR, width: number, height: number, visited: Pos[], visitedDir: PosDir[] };

function parseData(data: string[]) {
    const obstacles = [];
    const pos = { r: 0, c: 0 };
    const dir = DIR.UP;
    const width = data[0].length;
    const height = data.length;

    for (const rs in data) {
        const r = parseInt(rs);
        const row = data[rs];

        for (let c = 0; c < row.length; c++) {
            const cell = row[c];

            if (cell === '#')
                obstacles.push({ r, c });

            if (cell === '^') {
                pos.r = r;
                pos.c = c;
            }
        }
    }

    return { obstacles, startingPos: pos, pos, dir, width, height, visited: [], visitedDir: [] } as Data;
}

async function part1(data: Data, forPart2?: false): Promise<number>;
async function part1(data: Data, forPart2: true): Promise<boolean>;
async function part1(data: Data, forPart2 = false): Promise<number | boolean> {
    while (true) {
        if (!data.visited.find(p => p.r === data.pos.r && p.c === data.pos.c))
            data.visited.push({ ...data.pos });

        if (data.visitedDir.find(p => p.r === data.pos.r && p.c === data.pos.c && p.dir === data.dir))
            if (forPart2)
                return true;
            else
                throw new Error('Part 1: Infinite loop');

        data.visitedDir.push({ ...data.pos, dir: data.dir });

        if (!move(data))
            return forPart2 ? false : data.visited.length;
    }
}

async function part2(data: ReturnType<typeof parseData>): Promise<number> {
    await part1(data);

    let workers: Promise<number>[] = [];

    for (let i = 0; i < data.visited.length; i += 500) {
        workers.push(new Promise(resolve => {
            const worker = new Worker(__filename);
            worker.once('message', (_message) => {
                const message = z.object({
                    loops: z.number(),
                }).parse(_message);
                resolve(message.loops);
            });
            worker.once('error', (error) => {
                throw error;
            });
            worker.postMessage({ data, startAt: i, take: 500 });
        }));
    }

    return Promise.all(workers).then(loops => loops.reduce((a, b) => a + b, 0));
}

async function part2Worker(data: Data, startAt: number, take: number) {
    let loops = 0;
    const stopAt = startAt + take;
    for (let i = startAt; i < stopAt && i < data.visited.length; i++) {
        const visited = data.visited[i];
        const currentData = { ...data, obstacles: data.obstacles.concat(visited), pos: data.startingPos, dir: DIR.UP, visited: [], visitedDir: [] };

        if (visited.r !== data.startingPos.r || visited.c !== data.startingPos.c)
            if (await part1(currentData, true))
                loops++;
    }
    parentPort!.postMessage({ loops });
}

function move(data: Data) {
    while (true) {
        const np = nextPos(data);

        if (np.r < 0 || np.r >= data.height || np.c < 0 || np.c >= data.width)
            return false;

        if (!data.obstacles.find(o => o.r === np.r && o.c === np.c)) {
            data.pos = np;
            return true;
        }

        data.dir = (data.dir + 1) % 4;
    }
}

function nextPos(data: Data) {
    const { r, c } = data.pos;
    switch (data.dir) {
        case DIR.UP:
            return { r: r - 1, c };
        case DIR.RIGHT:
            return { r, c: c + 1 };
        case DIR.DOWN:
            return { r: r + 1, c };
        case DIR.LEFT:
            return { r, c: c - 1 };
    }
}