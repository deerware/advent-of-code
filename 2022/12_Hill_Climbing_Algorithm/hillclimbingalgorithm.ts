import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import * as grid from '../../helpers/map/grid';
import { DIR, isWithinBounds, move, Pos, posKey } from '../../helpers/map/grid';
import dijkstras, { NextNode } from '../../helpers/map/path/dijkstras';

export default async function hillclimbingalgorithm() {
    log('Day 12: Hill Climbing Algorithm');

    await g.run('2022/12_Hill_Climbing_Algorithm', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 31],
        ['Part 1', part1, 'input.txt', 383],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 29],
        ['Part 2', part2, 'input.txt', 377],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let start: Pos;
    let target: Pos;
    let map: number[][] = [];

    for (let y = 0; y < _data.length; y++) {
        const line = _data[y];
        let row = [];

        for (let x = 0; x < line.length; x++) {
            const char = line[x];

            if (char === 'S') {
                start = [x, y];
                row.push(1);
                continue;
            }
            if (char === 'E') {
                target = [x, y];
                row.push(26);
                continue;
            }
            row.push(char.charCodeAt(0) - 96)
        }
        map.push(row);
    }

    return { map, start: start!, target: target! };
}

async function part1({ map, start, target }: Data): Promise<number> {
    const mapSize: [number, number] = [map[0].length, map.length];

    const nodeMap = dijkstras.xy(start, (current) => {
        const next: Pos[] = [];
        const height = map[current.tile[1]][current.tile[0]];
        for (const dir of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
            const nPos = move(current.tile, dir);
            if (!isWithinBounds(nPos, ...mapSize))
                continue;

            const nHeight = map[nPos[1]][nPos[0]];
            if (nHeight - height > 1)
                continue;

            next.push(nPos);
        }

        return next;
    });

    return nodeMap[posKey(target)].score;
}

async function part2({ map, start, target }: Data): Promise<number> {
    const mapSize: [number, number] = [map[0].length, map.length];

    const nodeMap = dijkstras.xy(target, (current) => {
        const next: Pos[] = [];
        const height = map[current.tile[1]][current.tile[0]];
        for (const dir of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
            const nPos = move(current.tile, dir);
            if (!isWithinBounds(nPos, ...mapSize))
                continue;

            const nHeight = map[nPos[1]][nPos[0]];
            if (height - nHeight > 1)
                continue;

            next.push(nPos);
        }

        return next;
    });

    let lowest = Infinity;
    grid.forEach(map, (tile, pos) => {
        if (tile !== 1)
            return;

        const key = posKey(pos);
        if (nodeMap[key] && nodeMap[key].score < lowest)
            lowest = nodeMap[key].score
    });

    return lowest;
}