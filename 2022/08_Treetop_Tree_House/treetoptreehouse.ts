import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function treetoptreehouse() {
    log('Day 8: Treetop Tree House');

    await g.run('2022/08_Treetop_Tree_House', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 21],
        ['Part 1', part1, 'input.txt', 1695],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 8],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => Array.from(line).map(n => parseInt(n)));
}

async function part1(data: Data): Promise<number> {
    let visible = 0;

    for (let r = 0; r < data.length; r++) {
        const row = data[r];

        for (let c = 0; c < row.length; c++)
            if (isVisible(data, row, r, c))
                visible++;
    }

    return visible;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function isVisible(data: Data, row: number[], r: number, c: number) {
    if (
        r === 0 || r === data.length - 1 ||
        c == 0 || c === row.length - 1
    )
        return true;

    const height = data[r][c];

    if (Math.max(...row.slice(0, c)) < height) {
        // console.log("test 1", [...row.slice(0, c)])
        return true;
    }

    if (Math.max(...row.slice(c + 1)) < height) {
        // console.log("test 2", [...row.slice(c + 1)])
        return true;
    }

    const column = [];

    for (let i = 0; i < data.length; i++)
        column.push(data[i][c]);

    if (Math.max(...column.slice(0, r)) < height) {
        // console.log("test 3", [...column.slice(0, r)])
        return true;
    }

    if (Math.max(...column.slice(r + 1)) < height) {
        // console.log("test 4", [...column.slice(r + 1)])
        return true;
    }

    return false;
}