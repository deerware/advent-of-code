import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function rockpaperscissors() {
    log('Day 2: Rock Paper Scissors');

    await g.run('2022/02_Rock_Paper_Scissors', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 15],
        ['Part 1', part1, 'input.txt', 15632],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 12],
        ['Part 2', part2, 'input.txt', 14416],
    ], parseData);
}

enum RPS {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

type Match = { them: RPS, us: RPS };

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

function matchScore(match: Match): number {
    let score = 0;
    if (match.us === match.them)
        score += 3;

    if (
        (match.us === RPS.Rock && match.them === RPS.Scissors) ||
        (match.us === RPS.Paper && match.them === RPS.Rock) ||
        (match.us === RPS.Scissors && match.them === RPS.Paper)
    )
        score += 6;

    return score + match.us;
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data;
}

async function part1(data: Data): Promise<number> {
    const matches: Match[] = [];
    for (const line of data)
        matches.push({
            them: toRPS(line[0]),
            us: toRPS(line[2])
        });

    return matches.reduce((sum, match) => sum + matchScore(match), 0);
}

async function part2(data: Data): Promise<number> {
    const matches: Match[] = [];
    for (const line of data) {
        const them = toRPS(line[0]);
        const strategy = line[2];

        if (strategy === 'Y') { // draw
            matches.push({ them, us: them });
            continue;
        }

        if (strategy === 'X') { // lose
            let us: RPS;
            switch (them) {
                case RPS.Rock:
                    us = RPS.Scissors;
                    break;
                case RPS.Paper:
                    us = RPS.Rock;
                    break;
                case RPS.Scissors:
                    us = RPS.Paper;
                    break;
            }
            matches.push({ them, us });
            continue;
        }

        // win
        let us: RPS;
        switch (them) {
            case RPS.Rock:
                us = RPS.Paper;
                break;
            case RPS.Paper:
                us = RPS.Scissors;
                break;
            case RPS.Scissors:
                us = RPS.Rock;
                break;
        }

        const match = { them, us }

        matches.push(match);
    }

    return matches.reduce((sum, match) => sum + matchScore(match), 0);
}