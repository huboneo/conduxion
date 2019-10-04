# Conduxion
A small API extracting the goodness of https://github.com/edumentab/talks-redux-patterns by [@krawaller](https://github.com/krawaller).

## Table of Contents


## Philosophy
An alternative approach to redux where we put actions first, and view state as a consequence of them.

Instead of creating singleton reduces responsible for a vertical, we create reducers for each individual action.

Should an action have consequences, they should be declared on the action itself (as an event-emitter).

### Installation
```
$ npm i -S conduxion
```
Please note that [`redux`](https://www.npmjs.com/package/redux) is a peer-dependency.

### Basic usage
```typescript
import {Store} from 'redux';
import {makeStore} from 'conduxion';

const store: Store = makeStore<AppState, AppAction, AppDependencies>(
 rootReducer,
 initialAppState,
 opts
)
```

### Advanced usage
```typescript
import {createStore, applyMiddleware, Store} from 'redux';
import {
    createConsequenceMiddleware,
    RootReducer,
    MakeStoreOpts,
    ConsequenceGetter
} from 'conduxion';

const store: Store = makeStore<AppState, AppAction, AppDependencies>(
 rootReducer,
 initialAppState,
 opts
)

function makeStore(rootReducer: RootReducer<AppStore, AppAction, AppDependencies>, initialState: AppStore, opts: MakeStoreOpts<AppStore, AppDependencies> = {}) {
    const {
        additionalMiddleware = [],
        dependencies = {},
        initConsequence,
        consequenceGetter: theirGetter
    } = opts;
    const consequenceGetter: ConsequenceGetter<AppStore, AppDependencies> = (api) => {
        if (theirGetter) return theirGetter(api);

        const {action} = api;

        if (action.consequence) {
            return Array.isArray(action.consequence) ? action.consequence : [action.consequence];
        }

        return [];
    };
    const middleware = [
        ...additionalMiddleware,
        createConsequenceMiddleware<AppStore, AppDependencies>(consequenceGetter, dependencies)
    ];
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middleware)
    );

    if (initConsequence) {
        const initAction: AppAction = {
            type: '__APP_INIT__',
            consequence: initConsequence
        };

        store.dispatch(initAction);
    }

    return store;
}
```

### API
Below are the main methods and types exposed
- [Actions](#actions)
- [Action Reducers](#action-reducers)
- [Consequences](#consequences)

#### Actions:
A redux action with a little extra.

```Typescript
import {Consequence, ActionReducer} from 'conduxion';

export interface Action<
    Type extends string,
    Payload,
    State extends object,
    Dependencies extends object> {
    type: Type
    error?: boolean
    sender?: string
    reducer?: ActionReducer<State, Payload>
    payload: Payload
    consequence?: Consequence<State, Dependencies>
}
```

However for convenience we expose simpler typings `ConduxionAction` and `ConduxionActionMould`:
```Typescript
import {Action} from 'conduxion';

export type ConduxionActionMould<Type extends string, Payload, State extends object, Dependencies extends object> = Action<Type, Payload, State, Dependencies>

export type ConduxionAction<State extends object, Dependencies extends object> = ConduxionActionMould<string, any, State, Dependencies>
```

#### Action Reducers:
A redux reducer.

```Typescript
export type ActionReducer<State, Action> = (state: State, action: Action) => State
```

#### Consequences:
A redux thunk.

```Typescript
import {Action} from 'conduxion';

export type ConsequenceAPI<State extends object, Dependencies extends object> = {
    dispatch: (action: Action<string, any, State, Dependencies>) => void
    getState: () => State
    dependencies: Dependencies
    action: Action<string, any, State, Dependencies>
}

export type Consequence<State extends object, Dependencies extends object> = ((
    api: ConsequenceAPI<State, Dependencies>
) => void) & {
    name: string,
    displayName?: string
}

export type ConsequenceGetter<State extends object, Dependencies extends object> = (
    api: ConsequenceAPI<State, Dependencies>
) => Consequence<State, Dependencies>[]
```

#### Make Store
A pre-fab redux store creator for simple use-cases.
```TypeScript
import {Store} from 'redux';
import {ConduxionAction, RootReducer, MakeStoreOpts} from 'conduxion';

function makeStore<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object>(
    rootReducer: RootReducer<State, A, Dependencies>,
    initialState: State,
    opts: MakeStoreOpts<State, Dependencies> = {}
): Store<State, A>;
```


