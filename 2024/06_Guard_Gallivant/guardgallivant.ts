import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function guardgallivant() {
    log('Day 6: Guard Gallivant');

    await global.run('2024/06_Guard_Gallivant', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 41],
        ['Part 1', part1, 'input.txt', 5305],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 6],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

enum DIR {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

type Pos = { r: number, c: number };
type Data = { obstacles: Pos[], pos: Pos, dir: DIR, width: number, height: number, visited: Pos[] };

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
    return { obstacles, pos, dir, width, height, visited: [] };
}

async function part1(data: Data): Promise<number> {
    const positions: Pos[] = [];

    while (true) {
        if (!positions.find(p => p.r === data.pos.r && p.c === data.pos.c))
            positions.push({ ...data.pos });

        if (!move(data))
            return positions.length;
    }
}

async function part2(data: ReturnType<typeof parseData>): Promise<number> {
    return -Infinity;
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

// function renderData(data: Data) {
//     for (let r = 0; r < data.height; r++) {
//         let row = '';
//         for (let c = 0; c < data.width; c++) {
//             if (data.obstacles.find(o => o.r === r && o.c === c))
//                 row += colors.bgBlack(' ');
//             else if (data.pos.r === r && data.pos.c === c)
//                 row += colors.bgRed(' ');
//             else
//                 row += ' ';
//         }
//         console.log(row);
//     }
// }