import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import regex from '../../helpers/regex';
import { z } from 'zod';

export default async function nospaceleftondevice() {
    log('Day 7: No Space Left On Device');

    await g.run('2022/07_No_Space_Left_On_Device', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 95437],
        ['Part 1', part1, 'input.txt', 1491614],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 24933642],
        ['Part 2', part2, 'input.txt', 6400111],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const currentPath: string[] = [];
    const fileSizes: { [path: string]: number } = {};
    const uniqueDirectories = new Set<string>();

    const dirname = () => (currentPath.length ? '/' + currentPath.join('/') : '') + '/'

    for (const line of _data) {
        if (line === '$ ls' || line.startsWith('dir'))
            continue;

        if (line === '$ cd ..') {
            if (currentPath.length < 1)
                throw 'where we goin?'

            currentPath.pop();
            continue;
        }
        if (line === '$ cd /') {
            currentPath.splice(0, currentPath.length);
            continue;
        }

        if (line.startsWith('$ cd ')) {
            currentPath.push(line.substring(5));
        }

        if (line.startsWith('$ cd ')) {
            uniqueDirectories.add(dirname());
            continue;
        }

        const _parsed = regex.firstMatchG(line, /(\d+) (.+)/g);
        const [filesize, filename] = z.tuple([
            z.coerce.number().int(),
            z.string()
        ]).parse(_parsed?.groups);

        fileSizes[dirname() + filename] = filesize;
    }

    return { uniqueDirectories, fileSizes };
}

async function part1(data: Data): Promise<number> {
    let total = 0;

    for (const dir of Array.from(data.uniqueDirectories)) {
        let dirTotal = 0;
        for (const path of Object.keys(data.fileSizes)) {
            if (path.startsWith(dir))
                dirTotal += data.fileSizes[path];
        }

        if (dirTotal <= 100000)
            total += dirTotal;
    }

    console.log(data);

    return total;
}

async function part2(data: Data): Promise<number> {
    const TOTAL_SPACE = 70000000;
    const REQ_SPACE = 30000000;
    const TAKEN_SPACE = Object.values(data.fileSizes).reduce((a, b) => a + b, 0);
    const AVAILABLE_SPACE = TOTAL_SPACE - TAKEN_SPACE;
    const NEEDED_SPACE = REQ_SPACE - AVAILABLE_SPACE;

    if (NEEDED_SPACE < 0)
        throw 'Bad input';

    let bestCandidate = Infinity;

    for (const dir of Array.from(data.uniqueDirectories)) {
        let dirTotal = 0;
        for (const path of Object.keys(data.fileSizes)) {
            if (path.startsWith(dir))
                dirTotal += data.fileSizes[path];
        }

        if (dirTotal >= NEEDED_SPACE)
            if (dirTotal < bestCandidate)
                bestCandidate = dirTotal;
    }

    if (bestCandidate === Infinity)
        throw 'No folders big enough.'

    return bestCandidate;
}