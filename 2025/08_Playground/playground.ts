import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { randomUUID } from 'crypto';

export default async function playground() {
    log('Day 8: Playground');

    await g.run('2025/08_Playground', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 40, 10],
        ['Part 1', part1, 'input.txt', 244188, 1000],
        null,
        ['Part 2 test 1', part1, 'sampleData1.txt', 25272, true],
        ['Part 2', part1, 'input.txt', null, true],
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

async function part1(boxes: Data, noOfConnections: number | true): Promise<number> {
    let distances = [];

    for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++)
            distances.push({
                box1: boxes[i], box2: boxes[j],
                d: distance3D(boxes[i].pos, boxes[j].pos),
            });

    distances = distances.sort((a, b) => a.d - b.d);

    // let mainGroup = boxes[0].group;
    // let nullBox: Box | undefined = boxes[0];
    for (let i = 0; noOfConnections === true || i < noOfConnections; i++) {
        const dist = distances.shift();
        if (!dist)
            throw new Error('Not enough entries.');

        if (!dist.box1.group && !dist.box2.group) {
            dist.box1.group = randomUUID();
            dist.box2.group = dist.box1.group;
        } else if (dist.box1.group == dist.box2.group) {
            continue;
        } else if (!dist.box1.group || !dist.box2.group) {
            const id = dist.box1.group ?? dist.box2.group;
            dist.box1.group = id;
            dist.box2.group = id;
        } else {
            const newId = randomUUID();
            for (const box of boxes.filter(b => b.group == dist.box1.group || b.group == dist.box2.group))
                box.group = newId;
        }

        let randomBox = boxes[0];
        if (randomBox.group !== null) {
            const box = boxes.find(b => b.group != randomBox.group);
            if (!box) {
                console.log(dist.box1, dist.box2);
                return dist.box1.pos[0] * dist.box2.pos[0];
            }
        }

        // if (nullBox) {
        //     if (!!nullBox.group)
        //         nullBox = boxes.find(b => !b.group);

        //     console.log(nullBox?.group);
        // }

        // if (!nullBox) {
        //     let mainGroup = boxes[0].group;
        //     let box = boxes.find(b => b.group != mainGroup)
        //     if (!box)
        //         return dist.box1.pos[2] * dist.box2.pos[2];

        //     console.log(box);
        // }
    }

    const result = boxes
        .reduce((acc, b) => {
            if (!b.group)
                return acc;

            if (acc[b.group])
                return (acc[b.group].push(b), acc);

            acc[b.group] = [b];
            return acc;
        }, {} as { [key: string]: Box[] });

    const sorted = Object.values(result).sort((a, b) => b.length - a.length);

    return sorted[0].length * sorted[1].length * sorted[2].length;
}

function distance3D([x1, y1, z1]: Pos, [x2, y2, z2]: Pos): number {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2) +
        Math.pow(z2 - z1, 2)
    )
}