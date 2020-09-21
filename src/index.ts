export function cacheKey<TKey, TResult>(producer: (key: TKey) => TResult): (key:TKey) => TResult
export function cacheKey<TKey, TResult, TState>(producer: (key: TKey, state: TState) => TResult, state: TState): (key:TKey) => TResult
export function cacheKey<TKey, TResult, TState>(producer: (key: TKey, state: TState|undefined) => TResult, state?: TState) : (key: TKey) => TResult {
    const cache = new Map<TKey, TResult>()
    return (key: TKey): TResult => cache.get(key) || create(cache, key, producer(key, state))
}

function create<TKey, TValue>(cache: Map<TKey, TValue>, key: TKey, value: TValue): TValue {
    cache.set(key, value)
    return value
}

export function callTransform<TInput, TKey, TResult>(fn:(input:TInput) => TKey,producer: (key: TKey) => TResult): (key:TInput) => TResult {
    return (input: TInput): TResult => producer(fn(input))
}

export function cacheChange<T, TResult>(evaluate: () => T, build: (o:T) => TResult) : () => TResult {
    let evalResult : T
    let buildResult: TResult
    return () => {
        const e = evaluate()
        return e === evalResult ? buildResult : (buildResult = build(e))
    }
}

export function cacheTimed<TResult,TState>(ttl: number, fn: (state?:TState) => TResult, state?:TState) : () => TResult {
    let result : TResult
    let expire : number = 0
    return () => {
        if(Date.now() >= expire) {
            result = fn(state)
            expire = Date.now() + ttl
        }
        return result
    }
}

export function cacheLazy<TResult>(fn: () => TResult) : () => TResult {
    let result: TResult
    return () => result || (result = fn())
}