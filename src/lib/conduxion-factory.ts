import {ActionCreator} from './types/creator.type';
import {
    Action,
    ActionType,
    ActionState,
    ActionPayload,
    ActionDeps
} from './types/action.type';
import {ReducerType} from './types/reducer.type';
import {Consequence} from './types/consequence.type';

type CreatorBlueprint<A extends Action<string, any, any, any>> = {
    type: ActionType<A>
    reducer: ReducerType<ActionState<A>, ActionPayload<A>>
    isError?: boolean
    cons?: Consequence<ActionState<A>, ActionDeps<A>>
}

export const conduxionFactory = <A extends Action<string, any, any, any>>(
    blueprint: CreatorBlueprint<A>
) => {
    const {type, reducer, isError, cons} = blueprint;

    if (cons) {
        cons.displayName = type;
    }

    const creator = (payload => ({
        type,
        payload,
        ...(reducer && {
            reducer
        }),
        ...(isError && {
            error: true
        }),
        ...(cons && {
            cons
        })
    })) as ActionCreator<A>;

    creator.actionType = blueprint.type;

    const guard = (action: Action<string, any, any, any>): action is A =>
        action.type === (type as string);

    return <const>[creator, guard];
};
