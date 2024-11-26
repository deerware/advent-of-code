import fs from 'fs';
import log from '../../log'
import { colors } from '../../types'

export default function main() {
    const startTime = new Date();
    log("Day 2: Cube Conundrum");

    const p1test = part1(fs.readFileSync('02_Cube_Conundrum/sampleData1.txt').toString());
    const p1testr = 8;
    log((p1test === p1testr ? colors.fg.green : colors.fg.red) + `Part 1 test: ${p1test} ${p1test === p1testr ? '===' : '!=='} ${p1testr} ${p1test === p1testr ? "PASS" : "FAIL"}`);

    const p1 = part1(fs.readFileSync('02_Cube_Conundrum/input.txt').toString());
    log(colors.fg.yellow + `Part 1: ${p1}`);

    log();

    const p2test = part2(fs.readFileSync('02_Cube_Conundrum/sampleData1.txt').toString());
    const p2testr = 2286;
    log((p2test === p2testr ? colors.fg.green : colors.fg.red) + `Part 2 test: ${p2test} ${p2test === p2testr ? '===' : '!=='} ${p2testr} ${p2test === p2testr ? "PASS" : "FAIL"}`);

    const p2 = part2(fs.readFileSync('02_Cube_Conundrum/input.txt').toString());
    log(colors.fg.yellow + `Part 2: ${p2}`);
    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

function part1(data: string): number {
    const texts = data.split('\r\n');

    const limits: { [key: string]: number } = {
        'red': 12,
        'green': 13,
        'blue': 14,
    }

    let sums = 0;

    texts.forEach((text) => {
        const data = text.split(': ');
        const gameno = parseInt(data[0].substring(5));
        let accept = true;

        const sets = data[1].split('; ');
        sets.forEach((set) => {
            const colors = set.split(', ');
            const counts: { [key: string]: number } = { 'red': 0, 'green': 0, 'blue': 0 };

            colors.forEach((color) => {
                const cdata = color.split(' ');

                if (!Object.keys(counts).includes(cdata[1]))
                    throw new Error(`Unknown color ${cdata[1]} - '${text}'`);

                counts[cdata[1]] += parseInt(cdata[0]);
            });

            Object.keys(counts).forEach((color) => {
                if (counts[color] > limits[color])
                    accept = false;
            });
        });

        if (!accept)
            return;

        sums += gameno;
    });
    return sums;
}

function part2(data: string): number {
    const texts = data.split('\r\n');

    const limits: { [key: string]: number } = {
        'red': 12,
        'green': 13,
        'blue': 14,
    }

    let sums = 0;

    texts.forEach((text) => {
        const data = text.split(': ');
        const gameno = parseInt(data[0].substring(5));
        let accept = true;

        const counts: { [key: string]: number } = { 'red': 0, 'green': 0, 'blue': 0 };
        const sets = data[1].split('; ');

        sets.forEach((set) => {
            const colors = set.split(', ');

            colors.forEach((color) => {
                const cdata = color.split(' ');

                if (!Object.keys(counts).includes(cdata[1]))
                    throw new Error(`Unknown color ${cdata[1]} - '${text}'`);

                const count = parseInt(cdata[0]);
                if (count > counts[cdata[1]])
                    counts[cdata[1]] = count;
            });
        });



        sums += counts['red'] * counts['green'] * counts['blue'];
    });
    return sums;
}