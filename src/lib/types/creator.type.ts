import {Action, ActionPayload, ActionType, ActionState} from './action.type';
import {ReducerType} from './reducer.type';

export type ActionCreator<A extends Action<string, any, any, any>> = ActionPayload<A> extends undefined
    ? NakedActionCreator<A>
    : PayloadActionCreator<A>

interface WithActionType<T = string> {
    actionType: T
}

export interface PayloadActionCreator<A extends Action<string, any, any, any>>
    extends WithActionType<ActionType<A>> {
    (payload: ActionPayload<A>): {
        type: ActionType<A>
        payload: ActionPayload<A>
        reducer: ReducerType<ActionState<A>, ActionPayload<A>>
    }
}

export interface NakedActionCreator<A extends Action<string, undefined, any, any>> extends WithActionType<ActionType<A>> {
    (): {
        type: ActionType<A>
        payload: undefined
        reducer: ReducerType<ActionState<A>, ActionPayload<A>>
    }
}
