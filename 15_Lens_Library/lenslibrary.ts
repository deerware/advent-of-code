import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 15: Lens Library');

    global.run('15_Lens_Library', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 52],
        ['Part 1 test 2', part1, 'sampleData2.txt', 1320],
        ['Part 1', part1, 'input.txt', 514639],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 145],
        ['Part 2', part2, 'input.txt', 279470],
    ]);
}

async function part1(data: string[]): Promise<number> {
    const lenses = parseData(data);

    let sum = 0;
    for (const lens of lenses) {
        sum += lens.hash;
    }
    return sum;
}

async function part2(data: string[]): Promise<number> {
    const lenses = parseData(data, true);
    const boxes: Boxes = {};
    for (const lens of lenses)
        processLens(boxes, lens);

    let sum = 0;
    for (const i of Object.keys(boxes)) {
        const boxNo = parseInt(i);
        const box = boxes[boxNo];

        for (const j in box) {
            const lensNo = parseInt(j);
            const lens = box[j];
            sum += (boxNo + 1) * (lensNo + 1) * lens.focal;
        }
    }
    return sum;
}

type Lens = { label: string, hash: number } & ({ operation: 'ADD', focal: number } | { operation: 'REMOVE' });
type ProcessedLens = { label: string, focal: number };
type Boxes = { [key: number]: ProcessedLens[] };

function parseData(data: string[], hashLabel: boolean = false): Lens[] {
    if (data.length > 1)
        throw new Error('Invalid data input');

    const lenses = data[0].split(',');
    return lenses.map(lens => {
        if (lens.endsWith('-')) {
            const label = lens.substring(0, lens.length - 1);
            return {
                label,
                operation: 'REMOVE',
                hash: hash(hashLabel ? label : lens)
            };
        }

        const parts = lens.split('=');
        return {
            label: parts[0],
            operation: 'ADD',
            focal: parseInt(parts[1]),
            hash: hash(hashLabel ? parts[0] : lens)
        };
    });
}

function processLens(boxes: Boxes, lens: Lens) {
    if (boxes[lens.hash] === undefined)
        boxes[lens.hash] = [];

    const box = boxes[lens.hash];
    const index = box.findIndex(storedLens => storedLens.label == lens.label);

    if (lens.operation === 'REMOVE')
        if (index >= 0)
            box.splice(index, 1);
    if (lens.operation === 'ADD')
        if (index >= 0)
            box[index] = lens;
        else
            box.push(lens);

    // renderBoxes(boxes, lens);
}

function renderBoxes(boxes: Boxes, lastLens: Lens) {
    if (lastLens.operation === 'ADD')
        log(`After "${lastLens.label}=${lastLens.focal}":`)
    else
        log(`After "${lastLens.label}-":`)

    for (const i in boxes)
        log(`Box ${i}: ${boxes[i].map((lens) => `[${lens.label} ${lens.focal}]`).join(' ')}`);

    log();
}

function hash(text: string) {
    let currentValue = 0;
    for (let i = 0; i < text.length; i++) {
        currentValue = (currentValue + text.charCodeAt(i)) * 17 % 256
    }
    return currentValue;
}