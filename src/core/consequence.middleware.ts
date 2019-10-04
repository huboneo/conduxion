import {Middleware} from 'redux';

import {ConsequenceAPI, ConsequenceGetter} from './types';
import {ConduxionAction} from '../types/conduxion-action.type';

export default function createConsequenceMiddleware<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object>(
    consequenceGetter: ConsequenceGetter<State, A, Dependencies>,
    dependencies: Dependencies
): Middleware {
    return ({dispatch, getState}) => next => action => {
        next(action);

        const api: ConsequenceAPI<State, A, Dependencies> = {
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
