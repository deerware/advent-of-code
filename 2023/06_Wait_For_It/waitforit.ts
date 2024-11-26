import log from '../../log'
import { colors } from '../../types'
import { loadLines, logResult } from '../../global';

export default async function main() {
    const startTime = new Date();
    log("Day 6: Wait For It");

    if (logResult('Part 1 test', await part1(loadLines('06_Wait_For_It/sampleData1.txt')), 288))
        logResult('Part 1', await part1(loadLines('06_Wait_For_It/input.txt')), 1159152)

    log();

    if (logResult('Part 2 test', await part2(loadLines('06_Wait_For_It/sampleData1.txt')), 71503))
        logResult('Part 2', await part2(loadLines('06_Wait_For_It/input.txt')), 41513103)

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    const races: { time: number, target: number }[] = [];

    const times = data[0].split(/ +/).slice(1).map(x => parseInt(x));
    const targets = data[1].split(/ +/).slice(1).map(x => parseInt(x));
    if (times.length !== targets.length || times.length === 0)
        throw new Error('Parse error or invalid input');

    for (const time in times) {
        races.push({
            time: times[time],
            target: targets[time],
        });
    }

    return part0(races);
}

async function part2(data: string[]): Promise<number> {
    return part0([{
        time: parseInt(data[0].split(/ +/).slice(1).join('')),
        target: parseInt(data[1].split(/ +/).slice(1).join(''))
    }]);
}

async function part0(races: { time: number, target: number }[]) {
    let sum = 1;

    for (const race of races) {
        let win = 0;
        for (let i = 1; i <= race.time; i++) {
            if (i * (race.time - i) > race.target)
                win++;
        }
        sum *= win;
    }

    return sum;
}
