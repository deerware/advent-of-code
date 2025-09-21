import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { DIR, isWithinBounds, move, Pos, posKey } from '../../helpers/map/grid';

export default async function hillclimbingalgorithm() {
    log('Day 12: Hill Climbing Algorithm');

    await g.run('2022/12_Hill_Climbing_Algorithm', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 31],
        ['Part 1', part1, 'input.txt', 383],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 29],
        ['Part 2', part2, 'input.txt', null],
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

    type Node = {
        pos: Pos,
        key: string,
        parent: Node | null,
        distance: number,
    }
    const nodeMap: { [posKey: string]: Node } = {};

    const startKey = posKey(start);
    const queue = [startKey];

    nodeMap[startKey] = { pos: start, key: startKey, parent: null, distance: 0 };

    let nextPos;
    while (nextPos = queue.shift()) {
        const node = nodeMap[nextPos];

        const height = map[node.pos[1]][node.pos[0]];

        for (const dir of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
            const nPos = move(node.pos, dir);
            if (!isWithinBounds(nPos, ...mapSize))
                continue;

            const nHeight = map[nPos[1]][nPos[0]];
            if (nHeight - height > 1)
                continue;

            const distance = node.distance + 1;

            const nKey = posKey(nPos);
            const existing = nodeMap[nKey];
            if (existing && existing.distance <= distance) {
                existing.distance = distance;
                existing.parent = node;
            } else {
                nodeMap[nKey] = {
                    pos: nPos,
                    key: nKey,
                    parent: node,
                    distance,
                }
                queue.push(nKey);
            }
        }
    }

    // console.log(nodeMap);
    // console.log(nodeMap[posKey(target)]);

    return nodeMap[posKey(target)].distance;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}