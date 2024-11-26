export default {
    allMatches(search: string, exp: RegExp) {
        console.log(search.matchAll(exp));
    }
}