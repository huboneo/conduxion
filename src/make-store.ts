import {createStore, applyMiddleware, Store} from 'redux';

import {ConduxionAction, MakeStoreOptions, RootReducer} from './types';

import {createConsequenceMiddleware, ConsequenceGetter} from './core';

export function makeStore<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object>(rootReducer: RootReducer<State, A, Dependencies>, initialState: State, opts: MakeStoreOptions<State, A, Dependencies> = {}): Store<State, A> {
    const {
        additionalMiddleware = [],
        dependencies = {} as Dependencies, // @todo: fix typing
        initConsequence,
        consequenceGetter: theirGetter
    } = opts;
    const consequenceGetter: ConsequenceGetter<State, A, Dependencies> = (api) => {
        if (theirGetter) {
            return theirGetter(api);
        }

        const {action} = api;

        if (action.consequence) {
            return Array.isArray(action.consequence) ? action.consequence : [action.consequence];
        }

        return [];
    };
    const middleware = [
        ...additionalMiddleware,
        createConsequenceMiddleware<State, A, Dependencies>(consequenceGetter, dependencies)
    ];
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middleware)
    );

    if (initConsequence) {
        // @todo: fix typing
        const initAction: any = {
            type: '__APP_INIT__',
            consequence: initConsequence
        };

        store.dispatch(initAction);
    }

    return store;
}

