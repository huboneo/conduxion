import {Middleware} from 'redux';

import {ConsequenceAPI, ConsequenceGetter} from './types';

export default function createConsequenceMiddleware<State extends object, Dependencies extends object>(
    consequenceGetter: ConsequenceGetter<State, Dependencies>,
    dependencies: Dependencies
): Middleware {
    return ({dispatch, getState}) => next => action => {
        next(action);

        const api: ConsequenceAPI<State, Dependencies> = {
            action,
            dispatch,
            getState,
            dependencies
        };

        for (const consequence of consequenceGetter(action)) {
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
