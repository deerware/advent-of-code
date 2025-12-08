import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { randomUUID } from 'crypto';

export default async function playground() {
    log('Day 8: Playground');

    await g.run('2025/08_Playground', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 40, 10],
        ['Part 1', part1, 'input.txt', 244188, 1000],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0, 0],
        ['Part 2', part2, 'input.txt', null, 0],
    ], parseData);
}
type Pos = [x: number, y: number, z: number];
type Box = { pos: Pos, group: string | null };
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(row => ({
        pos: row.split(',').map(n => parseInt(n)) as Pos,
        group: null,
    } as Box));
}

async function part1(boxes: Data, noOfConnections: number): Promise<number> {
    let distances = [];

    for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++)
            distances.push({
                box1: boxes[i], box2: boxes[j],
                d: distance3D(boxes[i].pos, boxes[j].pos),
            });

    distances = distances.sort((a, b) => a.d - b.d);

    for (let i = 0; i < noOfConnections; i++) {
        const dist = distances.shift() ?? (() => { throw new Error('Not enough entries'); })();

        if (!dist.box1.group && !dist.box2.group) {
            dist.box1.group = randomUUID();
            dist.box2.group = dist.box1.group;
            continue;
        }

        if (dist.box1.group == dist.box2.group)
            continue;

        if (!dist.box1.group || !dist.box2.group) {
            const id = dist.box1.group ?? dist.box2.group;
            dist.box1.group = id;
            dist.box2.group = id;
            continue;
        }

        const newId = randomUUID();
        for (const box of boxes.filter(b => b.group == dist.box1.group || b.group == dist.box2.group))
            box.group = newId;
    }

    // console.log(boxes.filter(b => !!b.group));

    const result = boxes
        .reduce((acc, b) => {
            if (!b.group)
                return acc;
            // b.group = "null";

            if (acc[b.group])
                return (acc[b.group].push(b), acc);

            acc[b.group] = [b];
            return acc;
        }, {} as { [key: string]: Box[] });

    const sorted = Object.values(result).sort((a, b) => b.length - a.length);
    console.log(sorted);
    // console.log(sorted[0].length * sorted[1].length * sorted[2].length);

    return sorted[0].length * sorted[1].length * sorted[2].length;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function distance3D([x1, y1, z1]: Pos, [x2, y2, z2]: Pos): number {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2) +
        Math.pow(z2 - z1, 2)
    )
}