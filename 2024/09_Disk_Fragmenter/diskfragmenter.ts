import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function diskfragmenter() {
    log('Day 9: Disk Fragmenter');

    await global.run('2024/09_Disk_Fragmenter', [
        ['Part 1 test 1', part1, 'sampleData.txt', 1928],
        ['Part 1', part1, 'input.txt', 6382875730645],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', 2858],
        ['Part 2', part2, 'input.txt', null],
    ], data => data[0]);
}

async function part1(data: string): Promise<number> {
    const disk: Gap[] = [];
    for (let i = 0; i < data.length; i++) {
        const digit = parseInt(data[i]);
        if (i % 2 === 0)
            disk.push(new File(i / 2, digit));
        else
            disk.push(new Gap(digit));
    }

    for (let i = 0; i < disk.length; i++) {
        if (disk[i] instanceof File)
            continue;

        if (!(disk[disk.length - 1] instanceof File)) {
            disk.pop();

            if (disk.length === i) // -1 + 1 (because of the pop)
                break;
        }

        const lastFile = disk[disk.length - 1] as File;
        const gapToFill = disk[i];

        if (lastFile.size === gapToFill.size) {
            disk[i] = disk.pop()!;
        } else if (lastFile.size < gapToFill.size) {
            disk[i] = disk.pop()!;
            disk.splice(i + 1, 0, new Gap(gapToFill.size - lastFile.size));
        } else {
            disk[i] = new File(lastFile.id, gapToFill.size);
            lastFile.size -= gapToFill.size;
        }
    }

    let sum = 0;
    let ri = 0;
    for (let i = 0; i < disk.length; i++) {
        const file = disk[i] as File;
        for (let j = 0; j < file.size; j++) {
            sum += file.id * ri++;
        }
    }
    return sum;
}

async function part2(data: string): Promise<number> {
    return -Infinity;
}

function render(disk: Gap[]) {
    let str = ' ';
    for (const gap of disk) {
        if (gap instanceof File) {
            str += colors.fg.green;
            for (let i = 0; i < gap.size; i++)
                str += gap.id.toString(36);
        } else {
            str += colors.fg.gray;
            for (let i = 0; i < gap.size; i++)
                str += '.';
        }
    }
    log(str);
}

class Gap {
    constructor(
        public size: number,
    ) { }
}

class File extends Gap {
    constructor(
        public id: number,
        size: number,
    ) { super(size); }
}