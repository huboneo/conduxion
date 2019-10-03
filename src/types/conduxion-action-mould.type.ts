import {Action} from '../lib/types/action.type';

export type ConduxionActionMould<T extends string, P, S extends object, D extends object> = Action<T, P, S, D>
