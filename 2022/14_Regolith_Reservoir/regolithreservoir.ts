import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { mapInt } from '../../helpers/general';
import { move, DIR8, Pos } from '../../helpers/map/grid';

export default async function regolithreservoir() {
    log('Day 14: Regolith Reservoir');

    await g.run('2022/14_Regolith_Reservoir', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 24],
        ['Part 1', part1, 'input.txt', 665],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 93],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

enum TILE {
    AIR = '.',
    ROCK = '#',
    SAND = 'o',
};

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const map: TILE[][] = [];

    for (const _line of _data) {
        const line = _line.split(' -> ').map(cords => cords.split(',').map(mapInt));

        for (let i = 1; i < line.length; i++) {
            const prev = line[i - 1];
            const curr = line[i];

            if (prev[0] !== curr[0] && prev[1] === curr[1]) { // left / right
                const y = curr[1];
                const from = Math.min(prev[0], curr[0]);
                const to = Math.max(prev[0], curr[0]);
                for (let x = from; x <= to; x++) {
                    if (!map[y])
                        map[y] = [];

                    map[y][x] = TILE.ROCK;
                }

                continue;
            }

            if (prev[0] === curr[0] && prev[1] !== curr[1]) { // up / down
                const x = curr[0];
                const from = Math.min(prev[1], curr[1]);
                const to = Math.max(prev[1], curr[1]);
                for (let y = from; y <= to; y++) {
                    if (!map[y])
                        map[y] = [];

                    map[y][x] = TILE.ROCK;
                }

                continue;
            }

            throw 'Data error';
        }
    }

    // console.log(map);
    return map;
}

async function part1(map: Data): Promise<number> {
    const sandIn: Pos = [500, 0];

    let settled = 0;
    while (true) { // New sand entered

        if (map[sandIn[1]]?.[sandIn[0]])
            throw 'Sand entry position occupied';

        let current = sandIn;
        while (true) { // Still the same sand loop
            let moved = false;
            for (const dir of [DIR8.DOWN, DIR8.DOWN_LEFT, DIR8.DOWN_RIGHT]) {
                const next = move(current, dir);

                if (!map[next[1]]?.[next[0]]) {
                    current = next;
                    moved = true;
                    break;
                }
            }
            if (!moved) {
                if (!map[current[1]])
                    map[current[1]] = [];

                map[current[1]][current[0]] = TILE.SAND;

                settled++;
                break;
            }

            if (current[1] > map.length)
                return settled;
        }
    }

    return -Infinity;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function render(map: Data) {
    for (let y = 0; y < map.length; y++) {
        let line = y.toString().padStart(2, ' ') + " ";
        for (let x = 494; x <= 503; x++) {
            line += map[y]?.[x] ?? TILE.AIR;
        }
        console.log(line);
    }
}