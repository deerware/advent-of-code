import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function rockpaperscissors() {
    log('Day 2: Rock Paper Scissors');

    await g.run('2022/02_Rock_Paper_Scissors', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 15],
        ['Part 1', part1, 'input.txt', null],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

enum RPS {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

function toRPS(char: string): RPS {
    switch (char) {
        case 'A':
        case 'X':
            return RPS.Rock;
        case 'B':
        case 'Y':
            return RPS.Paper;
        case 'C':
        case 'Z':
            return RPS.Scissors;
    }

    throw new Error(`Invalid RPS character: ${char}`);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const matches = [];

    for (const line of _data) {
        const match = {
            them: toRPS(line[0]),
            us: toRPS(line[2])
        }

        let score = 0;
        if (match.us === match.them)
            score += 3;

        if (
            (match.us === RPS.Rock && match.them === RPS.Scissors) ||
            (match.us === RPS.Paper && match.them === RPS.Rock) ||
            (match.us === RPS.Scissors && match.them === RPS.Paper)
        )
            score += 6;

        matches.push({ ...match, score: score + match.us });
    }

    return matches;
}

async function part1(data: Data): Promise<number> {
    return data.reduce((a, b) => a + b.score, 0);
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}