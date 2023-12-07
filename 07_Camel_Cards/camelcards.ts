import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day 7: Camel Cards");

    if (logResult('Part 1 test', await part1(loadLines('07_Camel_Cards/sampleData1.txt')), 6440))
        logResult('Part 1', await part1(loadLines('07_Camel_Cards/input.txt')), 247815719);

    log();

    if (logResult('Part 2 test', await part2(loadLines('07_Camel_Cards/sampleData2.txt')), 5905))
        logResult('Part 2', await part2(loadLines('07_Camel_Cards/input.txt')))

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    const hands: Hand[] = data.map(x => ({
        cards: x.split(/ +/)[0],
        bet: parseInt(x.split(/ +/)[1])
    }));

    hands.sort(compareHands);

    let sum = 0;
    for (let i = 0; i < hands.length; i++) {
        sum += (i + 1) * hands[i].bet;
    }

    return sum;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}

type Hand = { cards: string, bet: number };

function cardValue(card: Hand) {
    let i = card.cards.length;
    let counts: { [key: string]: number } = {};
    while (i--) {
        if (counts[card.cards[i]] === undefined)
            counts[card.cards[i]] = 1
        else
            counts[card.cards[i]]++;
    }

    const max = Math.max(...Object.values(counts));
    const keys = Object.keys(counts).length;

    if (max === 5)
        return 7;

    if (max === 4)
        return 6;

    if (max === 3 && keys === 2)
        return 5;

    if (max === 3)
        return 4;

    if (max === 2 && keys === 3)
        return 3;

    if (max === 2)
        return 2;

    return 1;
}

function compareHands(a: Hand, b: Hand) {
    if (cardValue(a) > cardValue(b))
        return 1;
    if (cardValue(a) < cardValue(b))
        return -1;

    let compare = 0;
    let i = 0;
    while (compare === 0 && i < a.cards.length) {
        compare = compareCards(a.cards[i], b.cards[i]);
        i++;
    }
    return compare;
}

function compareCards(a: string, b: string) {
    const values = '23456789TJQKA';
    const aIndex = values.indexOf(a);
    const bIndex = values.indexOf(b);

    if (aIndex > bIndex)
        return 1;
    if (aIndex < bIndex)
        return -1;

    return 0;
}