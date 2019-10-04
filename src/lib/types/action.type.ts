import {ReducerType} from './reducer.type';
import {Consequence} from './consequence.type';

export interface Action<T extends string,
    P,
    S extends object,
    D extends object> {
    type: T
    error?: boolean
    sender?: string
    reducer?: ReducerType<S, P>
    payload: P
    consequence?: Consequence<S, D>
}

export type ActionType<A> = A extends Action<infer T, any, any, any> ? T : never
export type ActionPayload<A> = A extends Action<string, infer P, any, any>
    ? P
    : never
export type ActionState<A> = A extends Action<string, any, infer S, any>
    ? S
    : never
export type ActionDeps<A> = A extends Action<string, any, any, infer D>
    ? D
    : never
