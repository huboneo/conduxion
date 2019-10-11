import {Action} from './action.type';

export type ConsequenceAPI<State extends object, Dependencies extends object, Payload extends any = any, Type extends string = string> = {
    dispatch: (action: Action<Type, any, State, Dependencies>) => void
    getState: () => State
    dependencies: Dependencies
    action: Action<any, Payload, State, Dependencies> // @todo: fix typings
}

export type Consequence<State extends object, Dependencies extends object, Payload extends any = any> = ((
    api: ConsequenceAPI<State, Dependencies, Payload>
) => void) & {
    name: string,
    displayName?: string
}

export type ConsequenceGetter<State extends object, Dependencies extends object> = (
    api: ConsequenceAPI<State, Dependencies>
) => Consequence<State, Dependencies>[]
