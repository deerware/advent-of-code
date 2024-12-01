import log from './log';
import historianmysteria from './2024/01_Historian_Mysteria/historianmysteria';

(async () => {
    try {
        await historianmysteria();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();