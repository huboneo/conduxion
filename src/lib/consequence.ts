import {ConsequenceAPI, ConsequenceGetter} from './types/consequence.type';
import {Middleware} from 'redux';

export const createConsequenceMiddleware = <S extends object, D extends object>(
    consequenceGetter: ConsequenceGetter<S, D>,
    dependencies: D
): Middleware => {
    return ({dispatch, getState}) => next => action => {
        next(action);

        const api: ConsequenceAPI<S, D> = {
            action,
            dispatch,
            getState,
            dependencies
        };

        for (const consequence of consequenceGetter(api)) {
            consequence({
                ...api,
                dispatch: a =>
                    dispatch({
                        ...a,
                        sender: `CONSEQUENCE(${consequence.displayName || consequence.name})`
                    })
            });
        }
    };
};
