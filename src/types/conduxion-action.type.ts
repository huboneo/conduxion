import {ConduxionActionMould} from './conduxion-action-mould.type';

export type ConduxionAction<State extends object, Dependencies extends object> = ConduxionActionMould<any, any, State, Dependencies>
