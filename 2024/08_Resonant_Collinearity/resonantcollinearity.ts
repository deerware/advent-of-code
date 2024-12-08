import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function resonantcollinearity() {
    log('Day 8: Resonant Collinearity');

    await global.run('2024/08_Resonant_Collinearity', [
        ['Part 1 test 1', part1, 'sampleData.txt', 14],
        ['Part 1', part1, 'input.txt', 291],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', 34],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
type Pos = [r: number, c: number];
function parseData(data: string[]) {
    let antennas: { [key: string]: Pos[] } = {};
    for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
            if (data[r][c] !== '.') {
                const antenna = data[r][c];
                if (antennas[antenna])
                    antennas[antenna].push([r, c]);
                else
                    antennas[antenna] = [[r, c]];
            }
        }
    }
    return {
        antennas,
        map: {
            width: data[0].length,
            height: data.length
        }
    }
}

async function part1(data: Data): Promise<number> {
    let antinodes: Pos[] = [];
    for (const antenna in data.antennas) {
        const antennas = data.antennas[antenna];
        if (antennas.length == 1)
            continue;

        for (let i = 0; i < antennas.length; i++) {
            for (let j = i + 1; j < antennas.length; j++) {
                const [r1, c1] = antennas[i];
                const [r2, c2] = antennas[j];
                const dr = r2 - r1;
                const dc = c2 - c1;

                const an1 = [r1 - dr, c1 - dc] as Pos;
                const an2 = [r2 + dr, c2 + dc] as Pos;

                for (const an of [an1, an2]) {
                    if (an[0] < 0 || an[0] >= data.map.width || an[1] < 0 || an[1] >= data.map.height)
                        continue;

                    if (antinodes.find(a => a[0] == an[0] && a[1] == an[1]))
                        continue;

                    antinodes.push(an);
                }
            }
        }
    }
    // render(data, antinodes);
    return antinodes.length;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function render(data: Data, antinodes: Pos[] = []) {
    for (let r = 0; r < data.map.height; r++) {
        let row = '';
        for (let c = 0; c < data.map.width; c++) {
            if (antinodes.find(a => a[0] == r && a[1] == c))
                row += colors.bg.red;

            if (Object.values(data.antennas).find(a => a.find(b => b[0] == r && b[1] == c)))
                row += 'II' + colors.reset;
            else
                row += '  ' + colors.reset;

        }
        console.log(r.toString(16) + ' ' + row);
    }
}