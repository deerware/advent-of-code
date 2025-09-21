import caloriecounting from './2022/01_Calorie_Counting/caloriecounting';
import rockpaperscissors from './2022/02_Rock_Paper_Scissors/rockpaperscissors';
import rucksackreorganization from './2022/03_Rucksack_Reorganization/rucksackreorganization';
import campcleanup from './2022/04_Camp_Cleanup/campcleanup';
import supplystacks from './2022/05_Supply_Stacks/supplystacks';
import tuningtrouble from './2022/06_Tuning_Trouble/tuningtrouble';
import nospaceleftondevice from './2022/07_No_Space_Left_On_Device/nospaceleftondevice';
import treetoptreehouse from './2022/08_Treetop_Tree_House/treetoptreehouse';
import ropebridge from './2022/09_Rope_Bridge/ropebridge';
import cathoderaytube from './2022/10_Cathode_Ray_Tube/cathoderaytube';
import monkeyinthemiddle from './2022/11_Monkey_in_the_Middle/monkeyinthemiddle';
import hillclimbingalgorithm from './2022/12_Hill_Climbing_Algorithm/hillclimbingalgorithm';
import log from './log';

(async () => {
    try {
        // await caloriecounting();
        // await rockpaperscissors();
        // await rucksackreorganization();
        // await campcleanup();
        // await supplystacks();
        // await tuningtrouble();
        // await nospaceleftondevice();
        // await treetoptreehouse();
        // await ropebridge();
        // await cathoderaytube();
        // await monkeyinthemiddle();
        await hillclimbingalgorithm();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();