import log from './log';
import secretentrance from './2025/01_Secret_Entrance/secretentrance';

(async () => {
    try {
        await secretentrance();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();