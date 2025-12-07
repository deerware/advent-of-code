import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { unknown, z } from 'zod';
import * as grid from '../../helpers/map/grid';
import { DIR, Pos } from '../../helpers/map/grid';

export default async function laboratories() {
    log('Day 7: Laboratories');

    await g.run('2025/07_Laboratories', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 21],
        ['Part 1', part1, 'input.txt', 1613],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

enum TILE {
    '.' = '.',
    '^' = '^',
}
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let start;
    const data = z.array(z.array(z.nativeEnum(TILE)))
        .parse(_data.map((row, i) => {
            const nrow = row.split('');
            if (nrow.indexOf('S') > -1) {
                start = [nrow.indexOf('S'), i] as Pos;
                nrow[nrow.indexOf('S')] = '.';
            }

            return nrow;
        }));

    if (!start)
        throw new Error('No start');

    return { data, start: start as unknown as Pos };
}

async function part1({ data, start }: Data): Promise<number> {
    let beams = [start];
    let splits = 0;

    for (let r = start[1]; r < data.length - 1; r++) {
        let nextBeams = [];
        for (const beam of beams) {
            const nextBeam = grid.move(beam, DIR.DOWN);
            if (grid.tile(data, nextBeam) == TILE['^']) {
                nextBeams.push(grid.move(nextBeam, DIR.LEFT));
                nextBeams.push(grid.move(nextBeam, DIR.RIGHT));
                splits += 1;
            } else {
                nextBeams.push(nextBeam);
            }
        }
        beams = nextBeams.filter((nb, i) => i == nextBeams.findIndex(nb2 => grid.same(nb, nb2)));
    }

    return splits;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}