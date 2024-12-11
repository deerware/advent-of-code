export default function cache<T extends any[], U>(fn: (...args: T) => U, complex = false) {
    const cache: { [key: string]: U } = {};

    return (...args: T): U => {
        const key =
            complex
                ? JSON.stringify(args) :
                args.join('±'); // Chr(177), get it?

        if (cache[key])
            return cache[key];

        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}