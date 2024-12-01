import historianhysteria from './2024/01_Historian_Hysteria/historianhysteria';
import log from './log';

(async () => {
    try {
        await historianhysteria();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();