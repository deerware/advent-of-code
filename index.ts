import trebuchet from './01_Trebuchet/trebuchet';
import cube_conundrum from './02_Cube_Conundrum/cube_conundrum';
import log from './log';

try {
    cube_conundrum();
} catch (e) {
    log('Error:', (e as any).message);

    log('Waiting 60s to exit...');
    setTimeout(() => { log('Exit') }, 60000);
}