import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

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
    part1(data);

    let loops = 0;
    let i = 0;

    for (const visited of data.visited) {
        i++;
        let cl = false;
        const currentData = { ...data, obstacles: data.obstacles.concat(visited), pos: data.startingPos, dir: DIR.UP, visited: [], visitedDir: [] };

        if (visited.r !== data.startingPos.r || visited.c !== data.startingPos.c)
            if (await part1(currentData, true))
                (cl = true, loops++);

        if (i % 500 === 0)
            console.log(`${i}/${data.visited.length}: ${loops}`);

        // renderData(currentData, cl);
        // console.log('Loops: ' + loops);

        // await new Promise(r => setTimeout(r, cl ? 2000 : 500));
    }

    return loops;
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

function renderData(data: Data, loop = false) {
    console.log('----');
    for (let r = 0; r < data.height; r++) {
        let row = '';
        for (let c = 0; c < data.width; c++) {
            if (data.startingPos.r === r && data.startingPos.c === c)
                row += colors.bg.green + '##';
            else if (data.obstacles.find(o => o.r === r && o.c === c))
                row += colors.bg.red + '  ';
            else if (data.visited.find(p => p.r === r && p.c === c))
                row += (loop ? colors.bg.yellow : colors.bg.gray) + '  ';
            else
                row += colors.reset + '  ';
        }
        console.log(row);
    }
}