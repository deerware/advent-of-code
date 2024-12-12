type GetKeyFn<T extends any[]> = (...args: T) => string

export default function cache<T extends any[], U>(fn: (...args: T) => U, keyFn: 'simple' | 'json' | GetKeyFn<T> = 'simple') {
    const cache: { [key: string]: U } = {};
    const getKey: GetKeyFn<T> = (() => {
        if (typeof keyFn === 'function')
            return keyFn;

        if (keyFn === 'json')
            return (...args) => JSON.stringify(args);

        return (...args: T) => args.join('±'); // Chr(177), get it?
    })();

    return (...args: T): U => {
        const key = getKey(...args);

        if (cache[key])
            return cache[key];

        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}