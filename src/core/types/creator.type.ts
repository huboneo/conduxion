import {Action, ActionPayload, ActionType, ActionState} from './action.type';
import {ActionReducer} from './action-reducer.type';

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
        reducer: ActionReducer<ActionState<A>, ActionPayload<A>>
    }
}

export interface NakedActionCreator<A extends Action<string, undefined, any, any>> extends WithActionType<ActionType<A>> {
    (): {
        type: ActionType<A>
        payload: undefined
        reducer: ActionReducer<ActionState<A>, ActionPayload<A>>
    }
}
