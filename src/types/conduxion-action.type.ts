import {ConduxionActionMould} from './conduxion-action-mould.type';

export type ConduxionAction<State extends object, Dependencies extends object, Type extends string = string> = ConduxionActionMould<Type, any, State, Dependencies>
