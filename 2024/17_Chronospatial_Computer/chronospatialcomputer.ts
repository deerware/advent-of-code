import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function chronospatialcomputer() {
    log('Day 17: Chronospatial Computer');

    await global.run('2024/17_Chronospatial_Computer', [
        ['Part 1 test 1', part1, 'sampleData1.txt', '4,6,3,5,6,3,5,2,1,0'],
        ['Part 1', part1, 'input.txt', '1,3,7,4,6,4,2,3,5'],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', '117440'],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const registers = {
        A: parseInt(_data[0].split(': ')[1]),
        B: parseInt(_data[1].split(': ')[1]),
        C: parseInt(_data[2].split(': ')[1]),
    }
    const programRaw = _data[4].split(': ')[1]
    const program = programRaw.split(',').map(Number);
    return {
        registers,
        program,
        programRaw,
    };
}

async function part1(data: Data): Promise<string> {
    return runProgram(data);
}

async function part2(data: Data): Promise<string> {
    let i = 0;
    while (true) {
        data.registers.A = i;
        if (runProgram(data) == data.programRaw)
            return i.toString();

        i++;
    }
}

function runProgram(data: Data): string {
    const output: number[] = [];
    let pointer = 0;

    while (true) {
        const opcode = data.program[pointer];
        const literal = data.program[pointer + 1];
        if (opcode === undefined || literal === undefined)
            break;

        const result = instruction(data, opcode, literal, output);
        if (result === true) {
            pointer += 2;
        } else if (result === false) {
            break;
        } else {
            pointer = result;
        }
    }

    return output.map(n => n.toString()).join(',');
}

function combo(data: Data, operand: number): number {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand;
        case 4:
            return data.registers.A;
        case 5:
            return data.registers.B;
        case 6:
            return data.registers.C;
        case 7:
            throw new Error('Combo operand 7 is reserved and will not appear in valid programs.');
    }

    throw new Error('Invalid combo operand.');
}

function instruction(data: Data, opcode: number, literal: number, output: number[]): boolean | number {
    const getCombo = () => combo(data, literal);

    switch (opcode) {
        case 0: // adv
            data.registers.A = Math.floor(data.registers.A / Math.pow(2, getCombo()));
            return true;

        case 1: // bxl
            data.registers.B = data.registers.B ^ literal;
            return true;

        case 2: // bst
            data.registers.B = getCombo() % 8;
            return true;

        case 3: // jnz
            if (data.registers.A == 0)
                return true;

            return literal;

        case 4: // bxc
            data.registers.B = data.registers.B ^ data.registers.C;
            return true;

        case 5: // out
            output.push(getCombo() % 8)
            return true;

        case 6: // bdv           
            data.registers.B = Math.floor(data.registers.A / Math.pow(2, getCombo()));
            return true;

        case 7: // cdv
            data.registers.C = Math.floor(data.registers.A / Math.pow(2, getCombo()));
            return true;
    }

    throw new Error('Invalid opcode.');
}