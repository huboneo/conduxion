import {ActionReducer} from './action-reducer.type';
import {Consequence} from './consequence.type';

export interface Action<
    Type extends any,
    Payload,
    State extends object,
    Dependencies extends object> {
    type: Type
    error?: boolean
    sender?: string
    reducer?: ActionReducer<State, Payload>
    payload: Payload
    consequence?: Consequence<State, this, Dependencies> | Consequence<State, this, Dependencies>[]
}

export type ActionType<A> = A extends Action<infer T, any, any, any> ? T : never
export type ActionPayload<A> = A extends Action<any, infer P, any, any>
    ? P
    : never
export type ActionState<A> = A extends Action<any, any, infer S, any>
    ? S
    : never
export type ActionDeps<A> = A extends Action<any, any, any, infer D>
    ? D
    : never
