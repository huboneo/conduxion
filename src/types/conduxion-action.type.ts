import {ConduxionActionMould} from './conduxion-action-mould.type';

export type ConduxionAction<S extends object, D extends object> = ConduxionActionMould<string, any, S, D>
