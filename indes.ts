import trebuchet from './01_Trebuchet/trebuchet';
import log from './log';

trebuchet();

log('Waiting 60s to exit...');
setTimeout(() => { log('Exit') }, 60000);