import fs from 'fs';
import log from '../log'
import { colors } from '../types'
import { loadLines, logResult, regexIndexOf } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day 3: Gear Ratios");

    logResult('Part 1 test', await part1(loadLines('03_Gear_Ratios/sampleData1.txt')), 4361)

    const p1 = await part1(loadLines('03_Gear_Ratios/input.txt'));
    log(colors.fg.yellow + `Part 1: ${p1}`);

    log();

    // const p2test = await part2(loadLines('03_Gear_Ratios/sampleData2.txt'));
    // const p2testr = 0;
    // log((p2test === p2testr ? colors.fg.green : colors.fg.red) + `Part 2 test: ${p2test} ${p2test === p2testr ? '===' : '!=='} ${p2testr} ${p2test === p2testr ? "PASS" : "FAIL"}`);

    // const p2 = part2(await loadLines('03_Gear_Ratios/input.txt'));
    // log(colors.fg.yellow + `Part 2: ${p2}`);
    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    const symbols: [number, number, string][] = [];
    const numbers: [number, number, string][] = [];

    data.forEach((line, i) => {
        let j = -1;
        while (true) {
            j = regexIndexOf(line, /[^\d\.\s]/gm, j + 1);
            if (j === -1)
                break;

            symbols.push([i, j, line[j]]);
        }
    });
    // log(symbols);

    data.forEach((line, i) => {
        let j = -1;
        while (true) {
            j = regexIndexOf(line, /\d+/gm, j + 1);
            if (j === -1)
                break;

            const match = line.substring(j).match(/\d+/)?.[0];
            if (!match)
                throw new Error('No match');

            numbers.push([i, j, match]);

            j += match.length - 1;
        }
    });
    // log(numbers);

    let sum = 0;
    numbers.forEach(number => {
        const valid = symbols.find(symbol => {
            if (symbol[0] === number[0])
                if (symbol[1] === number[1] - 1 || symbol[1] === number[1] + number[2].length)
                    return true;

            if (symbol[0] == number[0] - 1 || symbol[0] == number[0] + 1)
                if (symbol[1] >= number[1] - 1)
                    if (symbol[1] <= number[1] + number[2].length)
                        return true;

            return false;
        }) ?? false;

        // log(`${number[0]}:${number[1]} ${number[2]} ${valid ? 'valid' : 'invalid'}`);

        if (valid)
            sum += parseInt(number[2]);
    });

    return sum;
}

async function part2(data: string[]): Promise<number> {
    throw new Error('Not implemented');
}