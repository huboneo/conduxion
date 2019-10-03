import {Middleware} from 'redux';

export default function createActionLogMiddleware<A = any>(
    actionLog: A[]
): Middleware {
    return () => next => action => {
        actionLog.push(action);
        return next(action);
    };
}
