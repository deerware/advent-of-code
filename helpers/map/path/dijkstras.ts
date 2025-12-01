import { Pos, posKey } from "../map2D";

export type PathNode<T> = {
    tile: T,
    key: string,
    parent: PathNode<T> | null,
    score: number,
}

export type NextNode<T> = [tile: T, key: string, distance?: number];

export enum DijkstrasMethod {
    LOWEST,
    HIGHEST,
}

export type DijkstrasParams<T> = {
    startTile: T,
    startKey: string,
    getNext: (current: PathNode<T>) => (NextNode<T> | undefined | false | null)[],
    method?: DijkstrasMethod,
}

/** Pathfinds from starting node to every node */
function dijkstras<T>({ startTile, startKey, getNext, method }: DijkstrasParams<T>) {
    method = method ?? DijkstrasMethod.LOWEST;

    const nodeMap: { [key: string]: PathNode<T> } = {};
    nodeMap[startKey] = { tile: startTile, key: startKey, parent: null, score: 0 };

    const queue = [startKey];

    let nextPos;
    while (nextPos = queue.shift()) {
        const node = nodeMap[nextPos];

        const next = getNext(node).filter(v => !!v);
        for (const [nextTile, nextKey, nextDistance] of next) {
            const score = node.score + (nextDistance ?? 1);

            const existing = nodeMap[nextKey];
            if (!existing) {
                nodeMap[nextKey] = {
                    tile: nextTile,
                    key: nextKey,
                    parent: node,
                    score,
                }
                queue.push(nextKey);
            }
            if (existing) {
                if (method == DijkstrasMethod.LOWEST && existing.score > score) {
                    existing.score = score;
                    existing.parent = node;
                    queue.push(nextKey);
                } else if (method == DijkstrasMethod.HIGHEST && existing.score < score) {
                    existing.score = score;
                    existing.parent = node;
                    queue.push(nextKey);
                }
            }
        }
    }

    return nodeMap;
}

export type NextNodeXY = [pos: Pos, distance?: number] | Pos;
dijkstras.xy = ({ startTile, getNext }: { startTile: Pos, getNext: (current: PathNode<Pos>) => (NextNodeXY | undefined | false | null)[] }) =>
    dijkstras({
        startTile,
        startKey: posKey(startTile),
        getNext: current => getNext(current).map((_n) => {
            if (!_n)
                return _n;

            if (Array.isArray(_n[0])) {
                const n = _n as [pos: Pos, distance?: number];
                return [n[0], posKey(n[0]), n[1]];
            }

            const n = _n as Pos;
            return [n, posKey(n)];
        })
    });

export default dijkstras;