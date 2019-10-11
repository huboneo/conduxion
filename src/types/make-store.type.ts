import {Middleware} from 'redux';

import {Consequence, ConsequenceGetter} from '../core';
import {ConduxionAction} from './conduxion-action.type';

export type MakeStoreOptions<State extends object, Dependencies extends object> = {
    additionalMiddleware?: Middleware[]
    dependencies?: Dependencies
    consequenceGetter?: ConsequenceGetter<State, Dependencies>
    initConsequence?: Consequence<State, Dependencies>
}

export type RootReducer<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object> = (state: State | undefined, action: A) => State;
