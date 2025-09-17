import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function supplystacks() {
    log('Day 5: Supply Stacks');

    await g.run('2022/05_Supply_Stacks', [
        ['Part 1 test 1', part1, 'sampleData1.txt', "CMZ"],
        ['Part 1', part1, 'input.txt', "CWMTGHBDW"],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', "MCD"],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let firstInstructionLine;

    const stacks: string[][] = [];

    for (let n = 0; n < _data.length; n++) {
        const line = _data[n];
        if (line[0] == " " && line[1] !== " ") {
            firstInstructionLine = n + 2;
            break;
        }

        let stack = 0;
        for (let i = 1; i < line.length; i += 4) {
            stack++;

            if (line[i] == " ")
                continue;

            if (stacks[stack] === undefined)
                stacks[stack] = [line[i]]
            else
                stacks[stack].push(line[i]);
        }
    }

    if (!firstInstructionLine)
        throw ('firstInstructionLine');

    const instructions = [];

    for (let i = firstInstructionLine; i < _data.length; i++) {
        const line = _data[i];

        const parts = line.split(' from ');
        const count = parseInt(parts[0].split(' ')[1]);
        const fromto = parts[1].split(' to ').map(n => parseInt(n));

        instructions.push({ count, from: fromto[0], to: fromto[1] });
    }

    return { stacks, instructions };
}

async function part1(data: Data): Promise<string> {
    for (const instruction of data.instructions)
        for (let i = 0; i < instruction.count; i++)
            data.stacks[instruction.to].unshift(
                data.stacks[instruction.from].shift()!);

    return getTops(data.stacks);
}

async function part2(data: Data): Promise<string> {
    for (const instruction of data.instructions)
        data.stacks[instruction.to].unshift(...data.stacks[instruction.from].splice(0, instruction.count));

    return getTops(data.stacks);
}

function getTops(stacks: Data['stacks']) {
    let tops = "";
    for (let i = 1; i < stacks.length; i++)
        tops += stacks[i][0] ?? '';

    return tops;
}