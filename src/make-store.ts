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
        deps = {} as D, // @todo: fix typing
        initCons
    } = opts;
    const middlewares = [];
    const consGetter: ConsequenceGetter<S, D> = ({action}) => {
        if (action.cons) {
            return Array.isArray(action.cons) ? action.cons : [action.cons];
        }

        return [];
    };

    if (consGetter) {
        middlewares.push(createConsequenceMiddleware<S, D>(consGetter, deps));
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

    if (initCons) {
        // @todo: fix typing
        const initAction: any = {
            type: '__APP_INIT__',
            cons: initCons
        };

        store.dispatch(initAction);
    }

    return store;
}

export function makeProdStore<S extends object, A extends ConduxionAction<S, D>, D extends object>(rootReducer: RootReducer<S, A, D>, opts: MakeProdStoreOpts<S, D> = {}) {
    const {
        initialState,
        deps = {} as D, // @todo: fix typing
        initCons
    } = opts;
    const consGetter: ConsequenceGetter<S, D> = ({action}) => {
        if (action.cons) {
            return Array.isArray(action.cons) ? action.cons : [action.cons];
        }

        return [];
    };

    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(createConsequenceMiddleware<S, D>(consGetter, deps))
    );

    if (initCons) {
        // @todo: fix typing
        const initAction: any = {
            type: '__APP_INIT__',
            cons: initCons
        };

        store.dispatch(initAction);
    }

    return store;
}

