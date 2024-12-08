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
        ['Part 2', part2, 'input.txt', 1015],
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
    return process(data);
}

async function part2(data: Data): Promise<number> {
    return process(data, true);
}

async function process(data: Data, part2 = false) {
    let antinodes: Pos[] = [];
    for (const antenna in data.antennas) {
        const antennas = data.antennas[antenna];
        if (antennas.length == 1)
            continue;

        for (let i = 0; i < antennas.length; i++) {
            for (let j = i + 1; j < antennas.length; j++) {
                const candidates: Pos[] = part2 ? [antennas[i], antennas[j]] : [];
                const [r1, c1] = antennas[i];
                const [r2, c2] = antennas[j];
                const dr = r2 - r1;
                const dc = c2 - c1;

                for (let i = 1; part2 || i === 1; i++) {
                    const an1 = [r1 - i * dr, c1 - i * dc] as Pos;
                    const an2 = [r2 + i * dr, c2 + i * dc] as Pos;
                    const an = [an1, an2].filter(a => a[0] >= 0 && a[0] < data.map.width && a[1] >= 0 && a[1] < data.map.height);

                    if (an.length == 0)
                        break;

                    candidates.push(...an);
                }

                for (const an of candidates)
                    if (!antinodes.find(a => a[0] == an[0] && a[1] == an[1]))
                        antinodes.push(an);
            }
        }
    }
    return antinodes.length;
}