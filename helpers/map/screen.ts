import * as map2D from './map2D'

/** Screen = x → right, y ↓ down */
export { Pos, DIR_ANY, DIR, DIR_DIAG, DIR8, dirFrom, dirFromURDL, dirFromArrows } from './map2D';

export function move(pos: map2D.Pos, dir: map2D.DIR_ANY, count?: number) {
    return map2D.move(pos, dir, count, map2D.Axis.Screen)
}

