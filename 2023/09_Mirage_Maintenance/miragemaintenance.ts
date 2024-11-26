import log from '../../log'
import { colors } from '../../types'
import { loadLines, logResult } from '../../global';

export default async function main() {
    const startTime = new Date();
    log("Day 9: Mirage Maintenance");

    if (logResult('Part 1 test', await part1(loadLines('09_Mirage_Maintenance/sampleData1.txt')), 114))
        logResult('Part 1', await part1(loadLines('09_Mirage_Maintenance/input.txt')), 1584748274);

    log();

    if (logResult('Part 2 test', await part2(loadLines('09_Mirage_Maintenance/sampleData1.txt')), 2))
        logResult('Part 2', await part2(loadLines('09_Mirage_Maintenance/input.txt')), 1026);

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    const values = data.map(x => x.split(' ').map(x => parseInt(x)));
    let sum = 0;
    for (const line of values)
        sum += getNextValue(line);

    return sum;
}

async function part2(data: string[]): Promise<number> {
    const values = data.map(x => x.split(' ').map(x => parseInt(x)));
    let sum = 0;
    for (const line of values)
        sum += getPrevValue(line);

    return sum;
}

function getNextValue(line: number[]) {
    const extrapolated = extrapolate(line).reverse();
    extrapolated[0].push(0);
    for (let i = 1; i < extrapolated.length; i++) {
        extrapolated[i].push(
            extrapolated[i][extrapolated[i].length - 1] + extrapolated[i - 1][extrapolated[i - 1].length - 1]
        );
    };
    extrapolated.reverse();

    return extrapolated[0][extrapolated[0].length - 1];
}

function getPrevValue(line: number[]) {
    const extrapolated = extrapolate(line).reverse();
    extrapolated[0].unshift(0);
    for (let i = 1; i < extrapolated.length; i++) {
        extrapolated[i].unshift(
            extrapolated[i][0] - extrapolated[i - 1][0]
        );
    };
    extrapolated.reverse();

    return extrapolated[0][0];
}

function extrapolate(line: number[]) {
    const fullLine: number[][] = [line];
    while (true) {
        const { nextLine, allZero } = extrapolateLine(fullLine[fullLine.length - 1]);
        fullLine.push(nextLine);
        if (allZero)
            return fullLine;
    }
}

function extrapolateLine(line: number[]) {
    const nextLine: number[] = []
    for (let i = 0; i < line.length - 1; i++) {
        nextLine.push(line[i + 1] - line[i]);
    }
    return {
        nextLine,
        allZero: nextLine.every(x => x === 0)
    }
}