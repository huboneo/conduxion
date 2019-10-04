import {Action} from './action.type';

export type ConsequenceAPI<State extends object, Dependencies extends object> = {
    dispatch: (action: Action<string, any, State, Dependencies>) => void
    getState: () => State
    dependencies: Dependencies
    action: Action<string, any, State, Dependencies>
}

export type Consequence<State extends object, Dependencies extends object> = ((
    api: ConsequenceAPI<State, Dependencies>
) => void) & {
    name: string,
    displayName?: string
}

export type ConsequenceGetter<State extends object, Dependencies extends object> = (
    api: ConsequenceAPI<State, Dependencies>
) => Consequence<State, Dependencies>[]
