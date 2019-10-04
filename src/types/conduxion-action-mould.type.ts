import {Action} from '../core';

export type ConduxionActionMould<Type extends any, Payload, State extends object, Dependencies extends object> = Action<Type, Payload, State, Dependencies>
