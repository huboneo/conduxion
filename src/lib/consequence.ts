import {ConsequenceAPI, ConsequenceGetter} from './types/consequence.type';
import {Middleware} from 'redux';

export const createConsequenceMiddleware = <S extends object, D extends object>(
    consGetter: ConsequenceGetter<S, D>,
    deps: D
): Middleware => {
    return ({dispatch, getState}) => next => action => {
        next(action);

        const api: ConsequenceAPI<S, D> = {
            action,
            dispatch,
            getState,
            deps
        };

        for (const cons of consGetter(api)) {
            cons({
                ...api,
                dispatch: a =>
                    dispatch({
                        ...a,
                        sender: `CONSEQUENCE(${cons.displayName || cons.name})`
                    })
            });
        }
    };
};
