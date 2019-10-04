import {createStore, compose, applyMiddleware} from 'redux';

import {ConsequenceGetter} from './lib/types/consequence.type';
import {MakeProdStoreOpts, MakeStoreOpts, RootReducer} from './types/make-store.type';
import {ConduxionAction} from './types';

import createActionLogMiddleware from './lib/action-log';
import {createConsequenceMiddleware} from './lib/consequence';

export function makeStore<S extends object, A extends ConduxionAction<S, D>, D extends object>(rootReducer: RootReducer<S, A, D>, opts: MakeStoreOpts<S, A, D> = {}) {
    const {
        initialState,
        actionLog,
        dependencies = {} as D, // @todo: fix typing
        initConsequence,
        consequenceGetter: theirGetter
    } = opts;
    const middlewares = [];
    const consequenceGetter: ConsequenceGetter<S, D> = (api) => {
        if (theirGetter) return theirGetter(api);

        const {action} = api;

        if (action.consequence) {
            return Array.isArray(action.consequence) ? action.consequence : [action.consequence];
        }

        return [];
    };

    if (consequenceGetter) {
        middlewares.push(createConsequenceMiddleware<S, D>(consequenceGetter, dependencies));
    }
    if (actionLog) {
        middlewares.push(createActionLogMiddleware<A>(actionLog));
    }

    const enhancers = [applyMiddleware(...middlewares)];
    const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }

    const store = createStore(
        rootReducer,
        initialState,
        compose(...enhancers)
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

export function makeProdStore<S extends object, A extends ConduxionAction<S, D>, D extends object>(rootReducer: RootReducer<S, A, D>, opts: MakeProdStoreOpts<S, D> = {}) {
    const {
        initialState,
        dependencies = {} as D, // @todo: fix typing
        initConsequence,
        consequenceGetter: theirGetter
    } = opts;
    const consequenceGetter: ConsequenceGetter<S, D> = (api) => {
        if (theirGetter) return theirGetter(api);

        const {action} = api;

        if (action.consequence) {
            return Array.isArray(action.consequence) ? action.consequence : [action.consequence];
        }

        return [];
    };
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(createConsequenceMiddleware<S, D>(consequenceGetter, dependencies))
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

