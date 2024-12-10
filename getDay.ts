import { z } from "zod";
import log from "./log";
import axios from "axios";
import strBetween from "./helpers/str";
import fs from "fs";
import { colors } from "./types";

const defaultYear = 2024;
const defaultDay = new Date().getDate();
const session = fs.readFileSync('session.txt', 'utf-8').trimEnd();

(async () => {
    const args = z.tuple([
        z.string(),
        z.string(),
        z.coerce.number(),
        z.coerce.number(),
    ]).or(z.tuple([
        z.string(),
        z.string(),
        z.coerce.number(),
    ])).or(z.tuple([
        z.string(),
        z.string(),
    ])).parse(process.argv);


    let year, day;

    switch (args.length) {
        case 4:
            year = process.argv[2];
            day = process.argv[3];
            break;
        case 3:
            year = defaultYear;
            day = process.argv[2];
            break;
        default:
            year = defaultYear.toString();
            day = defaultDay.toString();
    }

    const challenge = await axios({
        method: 'GET',
        url: `https://adventofcode.com/${year}/day/${day}`,
        headers: { Cookie: `session=${session}` }
    });
    const input = await axios({
        method: 'GET',
        url: `https://adventofcode.com/${year}/day/${day}/input`,
        headers: { Cookie: `session=${session}` }
    });

    const fullname = strBetween(challenge.data, '<h2>--- ', ' ---</h2>');
    const title = fullname.split(': ')[1];
    const clean = title.replace(/[^a-zA-Z0-9]/g, '_');
    const short = title.replace(/[^a-zA-Z]/g, '').toLocaleLowerCase();

    const path = `${year}/${day.padStart(2, '0')}_${clean}`;

    const tsContent = `import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function ${short}() {
    log('${fullname}');

    await global.run('${path}', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 0],
        ['Part 1', part1, 'input.txt', null],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data;
}

async function part1(data: Data): Promise<number> {
    return -Infinity;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}`;

    if (fs.existsSync(path))
        throw new Error('Path already exists');

    fs.mkdirSync(path, { recursive: true });
    fs.writeFileSync(`${path}/${short}.ts`, tsContent);
    fs.writeFileSync(`${path}/input.txt`, input.data.toString().trimEnd());
    fs.writeFileSync(`${path}/sampleData1.txt`, '');
    fs.writeFileSync(`${path}/sampleData2.txt`, '');

    log(colors.fg.green, 'Successfully created: ' + path);
})();