import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 13: Point of Incidence');

    global.run('13_Point_of_Incidence', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 405],
        ['Part 1', part1, 'input.txt', 41859],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 400],
        ['Part 2', part2, 'input.txt', 30842],
    ]);
}

async function part1(data: string[]): Promise<number> {
    return part0(data, false);
}

async function part2(data: string[]): Promise<number> {
    return part0(data, true);
}

async function part0(data: string[], allowOneMistake: boolean): Promise<number> {
    const images = getImages(data);

    let sum = 0;
    let i = 0;
    for (const image of images) {
        i++;
        let count = findSymmetry(image.lines, allowOneMistake);
        if (count === null)
            count = findSymmetry(image.cols, allowOneMistake);
        else
            count *= 100;

        if (count === null)
            throw new Error('Symmetry not found');

        sum += count;
    }

    return sum;
}

type Image = { lines: string[], cols: string[] };
function getImages(data: string[]) {
    const images: Image[] = [];
    data.push("");

    let firstLine = 0;
    let image: Image = { lines: [], cols: [] };
    for (let i in data) {
        const line = data[i];

        if (line !== "")
            image.lines.push(line);
        else {
            if (firstLine === parseInt(i))
                break;
            for (let j = 0; j < data[firstLine].length; j++) {
                const max = parseInt(i);
                let column = '';
                for (let k = firstLine; k < max; k++) {
                    column += data[k][j];
                }
                image.cols.push(column);
            }
            images.push(image);
            image = { lines: [], cols: [] };
            firstLine = parseInt(i) + 1;
        }
    }
    return images;
}

function findSymmetry(data: string[], allowOneMistake: boolean) {
    const startingPoint = Math.floor(data.length / 2);
    let point = startingPoint;
    let doBreak = 0;

    for (let i = 1; i < 50; i++) {
        if (i % 2 == 0)
            point = startingPoint - i / 2;
        else
            point = startingPoint + (i - 1) / 2;

        if (point < 1 || point >= data.length)
            doBreak++;

        if (doBreak >= 2)
            break;

        if (checkSymmetry(data, point, allowOneMistake))
            return point;
    }

    return null;
}

function checkSymmetry(data: string[], point: number, allowOneMistake: boolean) {
    if (point <= 0 || point > data.length - 1)
        return false;

    const mustBeOneMistake = allowOneMistake;
    const areEqual: ((l: string, r: string) => boolean) = allowOneMistake ? (l, r) => {
        if (l === r)
            return true;
        if (!allowOneMistake)
            return false;

        let errFound = false;
        for (let i = 0; i < l.length; i++)
            if (l[i] !== r[i])
                if (errFound)
                    return false;
                else
                    errFound = true;

        allowOneMistake = false;
        return true;
    } : (l, r) => l === r;

    for (let i = 0; ; i++) {
        const l = point - i - 1;
        const r = point + i;

        if (l < 0 || r >= data.length)
            return !mustBeOneMistake || (mustBeOneMistake && !allowOneMistake);

        if (!areEqual(data[l], data[r]))
            return false;
    }
}