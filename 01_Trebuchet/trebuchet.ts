import fs from 'fs';
import log from '../log'

export default function main() {
    part1(fs.readFileSync('01_Trebuchet/sampleData1.txt').toString());
    part1(fs.readFileSync('01_Trebuchet/input.txt').toString());
}

function part1(data: string) {
    const texts = data.split('\n');
    const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const results = [];
    let sum = 0;
    
    const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    
    texts.forEach((text) => {
        let text2 = text;
        let first: number | null = null;
        while(text2.length > 0){
            words.forEach(word => {
               if(text2.startsWith(word))
                first = first ?? words.indexOf(word) + 1;
            });
                
            nums.forEach(num => {
               if(text2.startsWith(num))
                first = first ?? nums.indexOf(num);
            });
            
            if (first !== null)
                break;
            text2 = text2.substring(1);
        }
        
        text2 = text;
        let last: number | null  = null;
        
        while(text2.length > 0){
            words.forEach(word => {
               if(text2.endsWith(word))
                last = last ?? words.indexOf(word) + 1;
            });
                
            nums.forEach(num => {
               if(text2.endsWith(num))
                last = last ?? nums.indexOf(num);
            });
            
            if (last !== null)
                break;
            text2 = text2.substring(0, text2.length-1);
        }
        
        if (first === null || last === null)
            return log(`Error: ${text}`);

        const result = first*10 + last;
        results.push(result);
        sum += result;
    });
    log(sum);
    
    // texts.forEach((text) => {
    //     let first = null;
    //     text.split('').forEach(letter => {
    //         if(first === null)
    //             if(nums.includes(letter))
    //                 first = parseInt(letter);
    //     });
    //     let last = null;
    //     text.split('').reverse().forEach(letter => {
    //         if(last === null)
    //             if(nums.includes(letter))
    //                 last = parseInt(letter);
    //     });
    //     const result = first*10+last;
    //     results.push(result);
    //     sum += result;
    // });
}


// $("textarea").on("change", () => {
//     const texts = $("textarea").val().split('\n');
//     const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//     const results = [];
//     let sum = 0;
    
//     texts.forEach((text) => {
//         let first = null;
//         text.split('').forEach(letter => {
//             if(first === null)
//                 if(nums.includes(letter))
//                     first = parseInt(letter);
//         });
//         let last = null;
//         text.split('').reverse().forEach(letter => {
//             if(last === null)
//                 if(nums.includes(letter))
//                     last = parseInt(letter);
//         });
//         const result = first*10+last;
//         results.push(result);
//         sum += result;
//     });
//     console.log(sum);
// });