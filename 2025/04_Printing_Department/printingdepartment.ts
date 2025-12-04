import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { z } from 'zod';
import * as grid from '../../helpers/map/grid'

export default async function printingdepartment() {
    log('Day 4: Printing Department');

    await g.run('2025/04_Printing_Department', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 13],
        ['Part 1', part1, 'input.txt', 1449],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 43],
        ['Part 2', part2, 'input.txt', 8746],
    ], parseData);
}

enum TILE {
    '.' = '.',
    '@' = '@',
}
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return z.array(z.array(z.nativeEnum(TILE)))
        .parse(_data.map(l => l.split('')));
}

async function part1(data: Data): Promise<number> {
    return (await part0(data)).length;
}

async function part2(_data: Data): Promise<number> {
    const data = JSON.parse(JSON.stringify(_data));

    let accessible = 0;

    while (true) {
        const result = await part0(data);
        if (result.length == 0)
            return accessible;

        accessible += result.length;
        for (const pos of result) {
            data[pos[1]][pos[0]] = TILE['.'];
        }
    }
}

async function part0(data: Data): Promise<grid.Pos[]> {
    let accessible: grid.Pos[] = [];

    grid.forEach(data, (tile, pos) => {
        if (tile != TILE['@'])
            return;

        let adjacent = 0;
        for (const dir of Object.values(grid.DIR8)) {
            const newPos = grid.move(pos, dir);
            if (!grid.isWithinBounds(newPos, data[0].length, data.length))
                continue;

            if (data[newPos[1]][newPos[0]] == TILE['@'])
                adjacent++;

            if (adjacent >= 4)
                break;
        }
        if (adjacent < 4)
            accessible.push(pos);
    })

    return accessible;
}