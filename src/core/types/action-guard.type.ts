import {Action} from './action.type';

export type ActionGuard<A extends Action<any, any, any, any>> = (action: A) => action is A
