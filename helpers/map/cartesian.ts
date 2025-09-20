import * as map2D from './map2D'

/** Cartesian = x → right, y ↑ up */
export { Pos, DIR_ANY, DIR, DIR_DIAG, DIR8, dirFrom, dirFromURDL, dirFromArrows, manhattan, same } from './map2D';

export function move(pos: map2D.Pos, dir: map2D.DIR_ANY, count?: number) {
    return map2D.move(pos, dir, count, map2D.Axis.Cartesian)
}

export function dir(pos1: map2D.Pos, pos2: map2D.Pos) {
    return map2D.dir(pos1, pos2, map2D.Axis.Cartesian)
}
