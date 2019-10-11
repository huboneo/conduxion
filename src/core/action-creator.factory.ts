import {
    ActionCreator,
    Action,
    ActionType,
    ActionState,
    ActionPayload,
    ActionDeps,
    ActionReducer,
    Consequence,
    ActionGuard
} from './types';
import {ConduxionAction} from '../types/conduxion-action.type';

type CreatorBlueprint<A extends Action<string, any, any, any>> = {
    type: ActionType<A>
    reducer: ActionReducer<ActionState<A>, ActionPayload<A>>
    isError?: boolean
    consequence?: Consequence<ActionState<A>, ActionDeps<A>, ActionPayload<A>>
}

export default function actionCreatorFactory<A extends ConduxionAction<any, any>>(
    blueprint: CreatorBlueprint<A>
): [ActionCreator<A>, ActionGuard<A>] {
    const {type, reducer, isError, consequence} = blueprint;

    if (consequence) {
        consequence.displayName = type;
    }

    const actionCreator = (payload => ({
        type,
        payload,
        ...(reducer && {
            reducer
        }),
        ...(isError && {
            error: true
        }),
        ...(consequence && {
            consequence
        })
    })) as ActionCreator<A>;

    actionCreator.actionType = blueprint.type;

    const actionGuard: ActionGuard<A> = (action): action is A =>
        action.type === type;

    return [actionCreator, actionGuard];
};
