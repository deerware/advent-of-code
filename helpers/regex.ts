export default {
    allMatches(search: string, exp: RegExp) {
        const matches = [];
        let match;
        while ((match = exp.exec(search)) !== null) {
            matches.push(match[0]);
        }
        return matches;
    },
    allMatchesG(search: string, exp: RegExp) {
        const matches = [];
        let match: RegExpExecArray | null;
        while ((match = exp.exec(search)) !== null) {
            matches.push({
                full: match.shift(),
                groups: [...match],
            });
        }
        return matches;
    },
    firstMatch(search: string, exp: RegExp) {
        let match: RegExpExecArray | null;
        while ((match = exp.exec(search)) !== null) {
            return match[0];
        }
        return null;
    },
    firstMatchG(search: string, exp: RegExp) {
        let match: RegExpExecArray | null;
        while ((match = exp.exec(search)) !== null) {
            return {
                full: match.shift(),
                groups: [...match],
            }
        }
        return null;
    }
}