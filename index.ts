import caloriecounting from './2022/01_Calorie_Counting/caloriecounting';
import log from './log';

(async () => {
    try {
        await caloriecounting();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();