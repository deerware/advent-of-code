import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import memoize from '../../helpers/memoize';

export default async function keypadconundrum() {
    log('Day 21: Keypad Conundrum');

    await g.run('2024/21_Keypad_Conundrum', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 126384],
        ['Part 1', part1, 'input.txt', null],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

enum KEYPAD { NUMERIC, DIRECTIONAL };
const keypads = {
    [KEYPAD.NUMERIC]: [
        ['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
        [null, '0', 'A']
    ],
    [KEYPAD.DIRECTIONAL]: [
        [null, '^', 'A'],
        ['<', 'v', '>']
    ]
};
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data;
}

async function part1(codes: Data): Promise<number> {
    codes = ['379A']
    log(codes);
    let complexity = 0;
    for (const code of codes) {
        const part1 = punchInCode(KEYPAD.NUMERIC, code);
        const part2 = punchInCode(KEYPAD.DIRECTIONAL, part1);
        const part3 = punchInCode(KEYPAD.DIRECTIONAL, part2);
        log(part1);
        log(part2);
        log(part3);

        const numeric = parseInt(code.replace(/\D/g, ""));

        let current = part3.length * numeric;
        log(part3.length, ' x ', numeric);
        complexity += current;
    }
    return complexity;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function punchInCode(keypad: KEYPAD, code: string) {
    let current = 'A';
    let instructions = '';

    for (let c = 0; c < code.length; c++) {
        const key = code[c];
        instructions += pressButton(keypad, current, key);
        current = key;
    }

    return instructions;
}

const pressButton = _pressButton;
// const pressButton = cache(_pressButton);
function _pressButton(keypad: KEYPAD, from: string, to: string): string {
    const fromPos = findButton(keypad, from);
    const toPos = findButton(keypad, to);
    const diff = [fromPos[0] - toPos[0], fromPos[1] - toPos[1]];

    let instructions = '';

    function alignVertically() {
        if (diff[0] > 0)  // Go up
            instructions += '^'.repeat(diff[0]);

        if (diff[0] < 0) // Go down
            instructions += 'v'.repeat(-diff[0]);
    }

    function alignHorizontally() {
        if (diff[1] > 0) // Go left
            instructions += '<'.repeat(diff[1]);

        if (diff[1] < 0) // Go left
            instructions += '>'.repeat(-diff[1]);
    }

    if ((keypad === KEYPAD.DIRECTIONAL && diff[0] > 0) || (keypad === KEYPAD.NUMERIC && diff[0] < 0)) {
        alignHorizontally();
        alignVertically();
    } else {
        alignVertically();
        alignHorizontally();
    }

    return instructions + 'A';
}

const findButton = _findButton;
// const findButton = cache(_findButton);
function _findButton(keypad: KEYPAD, key: string): [r: number, c: number] {
    const pad = keypads[keypad];
    for (let r = 0; r < pad.length; r++)
        for (let c = 0; c < pad[r].length; c++)
            if (pad[r][c] === key)
                return [r, c];

    throw new Error('Key not found');
}