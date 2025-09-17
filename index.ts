import caloriecounting from './2022/01_Calorie_Counting/caloriecounting';
import rockpaperscissors from './2022/02_Rock_Paper_Scissors/rockpaperscissors';
import log from './log';

(async () => {
    try {
        // await caloriecounting();
        await rockpaperscissors();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();