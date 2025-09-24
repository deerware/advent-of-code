import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { mapInt } from '../../helpers/general';
import { manhattan, Pos } from '../../helpers/map/grid';

export default async function beaconexclusionzone() {
    log('Day 15: Beacon Exclusion Zone');

    await g.run('2022/15_Beacon_Exclusion_Zone', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 26, 10],
        ['Part 1', part1, 'input.txt', 5100463, 2000000],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 56000011, 20],
        ['Part 2', part2, 'input.txt', 11557863040754, 4000000],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(_line => {
        const line = _line.split(': closest beacon is at x=');

        const sensor = line[0].split('x=')[1].split(', y=').map(mapInt) as Pos;
        const beacon = line[1].split(', y=').map(mapInt) as Pos;
        const distance = manhattan.distance(sensor, beacon)

        return { sensor, beacon, distance };
    });
}

type Map = { [y: number]: { [x: number]: string } };

async function part1(data: Data, checkRow: number): Promise<number> {
    const map: Map = {};

    let i = 0;
    for (const { sensor, beacon } of data) {
        console.log(`Rendering sensors ${++i}/${data.length}`)

        if (!map[beacon[1]])
            map[beacon[1]] = [];

        map[beacon[1]][beacon[0]] = 'B';

        const distance = manhattan.distance(sensor, beacon);

        const y = checkRow;

        if (y < sensor[1] - distance || y > sensor[1] + distance)
            continue;

        for (let x = sensor[0] - distance; x <= sensor[0] + distance; x++) {
            if (manhattan.distance(sensor, [x, y]) > distance)
                continue;

            if (!map[y])
                map[y] = [];

            if (!map[y][x])
                map[y][x] = '#';
        }
    }

    return Object.values(map[checkRow]).filter(v => v == '#').length;
}

async function part2(data: Data, limit: number): Promise<number> {
    for (let y = 0; y <= limit; y++) {
        if (y % 100000 == 0)
            console.log(`Checking rows ${Math.floor(100 / limit * y * 1000) / 1000} %`);

        for (let x = 0; x <= limit; x++) {
            let found = false;
            for (const { sensor, distance } of data) {
                const cd = manhattan.distance(sensor, [x, y])
                if (cd <= distance) {
                    found = true;
                    x += distance - cd; // could be better if we're still before the sensor, and not after it, but this is enough for me.
                    break;
                }
            }
            if (!found)
                return x * 4000000 + y;
        }
    }

    throw new Error('Not found.');
}

function render(map: Map) {
    for (let y = -2; y <= 22; y++) {
        let line = y.toString().padStart(2, ' ') + ' ';

        for (let x = -2; x <= 25; x++)
            line += map[y]?.[x] ?? '.';

        console.log(line);
        line = '';
    }
}