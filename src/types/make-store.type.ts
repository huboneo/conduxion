import {Consequence, ConsequenceGetter} from '../lib/types/consequence.type';
import {ConduxionAction} from './conduxion-action.type';

export type MakeStoreOpts<S extends object, A extends ConduxionAction<S, D>, D extends object> = {
    initialState?: S
    actionLog?: A[]
    deps?: D
    consGetter?: ConsequenceGetter<S, D>
    initCons?: Consequence<S, D>
}

export type MakeProdStoreOpts<S extends object, D extends object> = {
    initialState?: S
    deps?: D
    initCons?: Consequence<S, D>
}

export type RootReducer<S extends object, A extends ConduxionAction<S, D>, D extends object> = (state: S | undefined, action: A) => S;
