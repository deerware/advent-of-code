type GetKeyFn<T extends any[]> = (...args: T) => string

export default function memoize<T extends any[], U>(fn: (...args: T) => U, keyFn: 'simple' | 'json' | GetKeyFn<T> = 'simple') {
    let cache: { [key: string]: U } = {};
    const getKey: GetKeyFn<T> = (() => {
        if (typeof keyFn === 'function')
            return keyFn;

        if (keyFn === 'json')
            return (...args) => JSON.stringify(args);

        return (...args: T) => args.join('±'); // Chr(177), get it?
    })();

    const resultFn = (...args: T): U => {
        const key = getKey(...args);

        if (cache[key])
            return cache[key];

        const result = fn(...args);
        cache[key] = result;
        return result;
    };

    resultFn.clear = () => { cache = {}; };
    resultFn.count = () => Object.keys(cache).length;
    resultFn.get = (key: string) => cache[key];
    resultFn.set = (key: string, value: U) => cache[key] = value;
    resultFn.direct = fn;

    return resultFn;
}