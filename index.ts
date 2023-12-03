import trebuchet from './01_Trebuchet/trebuchet';
import cube_conundrum from './02_Cube_Conundrum/cube_conundrum';
import gear_ratios from './03_Gear_Ratios/gear_ratios'
import log from './log';

try {
    // trebuchet();
    // cube_conundrum();
    gear_ratios();
} catch (e) {
    log('Error:', (e as any).message);
}
setTimeout(() => { log('Exit') }, 60 * 60 * 1000);