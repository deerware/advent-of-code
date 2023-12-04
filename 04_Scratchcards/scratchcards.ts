import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day 4: Scratchcards");

    if (logResult('Part 1 test', await part1(loadLines('04_Scratchcards/sampleData1.txt')), 13))
        logResult('Part 1', await part1(loadLines('04_Scratchcards/input.txt')))

    log();

    if (logResult('Part 2 test', await part2(loadLines('04_Scratchcards/sampleData2.txt')), 30))
        logResult('Part 2', await part2(loadLines('04_Scratchcards/input.txt')))

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    let sum = 0;
    data.forEach(line => {
        let data = line.split(': ');
        const cardNo = parseInt(data[0].split(" ")[1]);
        data = data[1].split(' | ');
        const winningNos = data[0].split(' ').map(n => n === "" ? false : parseInt(n)).filter(n => n !== false);
        const myNos = data[1].split(' ').map(n => n === "" ? false : parseInt(n)).filter(n => n !== false);

        let points = 0;
        myNos.forEach(n => {
            if (winningNos.includes(n)) {
                if (points == 0)
                    points = 1;
                else
                    points *= 2;
            }
        });
        sum += points;
    });

    return sum;
}

async function part2(data: string[]): Promise<number> {
    const counts: { [key: number]: number } = {};

    for (let i = 1; i <= data.length; i++)
        counts[i] = 1;

    data.forEach(line => {
        let data = line.split(': ');
        const cardNo = parseInt(data[0].split(" ").slice(-1)[0]);
        if (isNaN(cardNo))
            throw new Error("NaN");

        data = data[1].split(' | ');
        const winningNos = data[0].split(' ').map(n => n === "" ? false : parseInt(n)).filter(n => n !== false);
        const myNos = data[1].split(' ').map(n => n === "" ? false : parseInt(n)).filter(n => n !== false);

        const myPoints = counts[cardNo];
        const points = myNos.filter(n => winningNos.includes(n)).length;
        for (let i = 1; i <= points; i++) {
            counts[cardNo + i] += myPoints;
        }
    });

    let sum = 0;
    Object.values(counts).forEach(c => {
        sum += c;
    });
    return sum;
}