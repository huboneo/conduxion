import {Action} from './action.type';

export type ConsequenceAPI<State extends object, A extends Action<any, any, State, Dependencies> , Dependencies extends object> = {
    dispatch: (action: Action<string, any, State, Dependencies>) => void
    getState: () => State
    dependencies: Dependencies
    action: A
}

export type Consequence<State extends object, A extends Action<any, any, State, Dependencies>, Dependencies extends object> = ((
    api: ConsequenceAPI<State, A, Dependencies>
) => void) & {
    name: string,
    displayName?: string
}

export type ConsequenceGetter<State extends object, A extends Action<any, any, any, any>, Dependencies extends object> = (
    api: ConsequenceAPI<State, A, Dependencies>
) => Consequence<State, A, Dependencies>[]
