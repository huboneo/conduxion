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
Vanilla JS
```typescript
import {makeStore, actionCreatorFactory} from 'conduxion';

const initialAppState = {
    time: null
}

export const [initApp, isInitApp] = actionCreatorFactory({
  type: 'INIT_APP',
  reducer: (state, payload) => {
    const { time } = payload
    
    return {
        ...state,
        time
    }
  }
})
const rootReducer = (state, action) => action.reducer
    ? action.reducer(state, action.payload)
    : state;

const store = makeStore(
 rootReducer,
 initialAppState,
 {
     initConsequence: ({dispatch}) => dispatch(initApp())
 }
)
```

Typescript
```typescript
import {Store} from 'redux';
import {makeStore, actionCreatorFactory, ConduxionAction, ConduxionActionMould} from 'conduxion';

type AppState = { time: number | null }
type AppDependencies = {}
type AppAction = ConduxionAction<AppState, AppDependencies>
type AppActionMould<Type extends string, Payload> = ConduxionActionMould<
  Type,
  Payload,
  AppState,
  AppDependencies
>

type InitAppPayload = {
  time: number
}

type InitAppAction = AppActionMould<'INIT_APP', InitAppPayload>

const initialAppState: AppState = {
    time: null
}

export const [initApp, isInitApp] = actionCreatorFactory<InitAppAction>({
  type: 'INIT_APP',
  reducer: (state, payload) => {
    const { time } = payload
    
    return {
        ...state,
        time
    }
  }
})
const rootReducer = (state, action) => action.reducer
    ? action.reducer(state, action.payload)
    : state;

const store: Store<AppState, AppAction> = makeStore<AppState, AppAction, AppDependencies>(
 rootReducer,
 initialAppState,
 {
     initConsequence: ({dispatch}) => dispatch(initApp())
 }
)
```

### API
#### makeStore
A pre-fab redux store creator for simpler use-cases.
See [MakeStoreOptions](#makestoreoptions) for configuration.
```TypeScript
import {Store} from 'redux';
import {ConduxionAction, RootReducer, MakeStoreOptions} from 'conduxion';

function makeStore<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object>(
    rootReducer: RootReducer<State, A, Dependencies>,
    initialState: State,
    options: MakeStoreOptions<State, Dependencies> = {}
): Store<State, A>;
```
Returns a redux store instance with middleware added.

#### actionCreatorFactory
A pre-fab redux store creator for simpler use-cases.
See [MakeStoreOptions](#makestoreoptions) for configuration.
```TypeScript
import {Store} from 'redux';
import {ConduxionAction, RootReducer, MakeStoreOptions} from 'conduxion';

function makeStore<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object>(
    rootReducer: RootReducer<State, A, Dependencies>,
    initialState: State,
    options: MakeStoreOptions<State, Dependencies> = {}
): Store<State, A>;
```
Returns a redux store instance with middleware added.

### Types
Below are the main types exposed
- [MakeStoreOptions](#makestoreoptions)
- [Action](#action)
- [ActionReducer](#actionreducer)
- [Consequences](#consequence)

#### MakeStoreOptions:
Configuration options for [makeStore](#makestore).

```TypeScript
import {Middleware} from 'redux';
import { Consequence, ConsequenceGetter} from 'conduxion';

type MakeStoreOptions<State extends object, Dependencies extends object> = {
    additionalMiddleware?: Middleware[]
    dependencies?: Dependencies
    consequenceGetter?: ConsequenceGetter<State, Dependencies>
    initConsequence?: Consequence<State, Dependencies>
}
```

#### RootReducer:
A redux root reducer with support for conduxion [Actions](#actions)

```Typescript
import {ConduxionAction} from 'conduxion';

export type RootReducer<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object> = (state: State | undefined, action: A) => State;
```

#### Action:
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
    consequence?: Consequence<State, Dependencies> | Consequence<State, Dependencies>[]
}
```

However for convenience we expose simpler typings `ConduxionAction` and `ConduxionActionMould`:
```Typescript
import {Action} from 'conduxion';

export type ConduxionActionMould<Type extends string, Payload, State extends object, Dependencies extends object> = Action<Type, Payload, State, Dependencies>

export type ConduxionAction<State extends object, Dependencies extends object> = ConduxionActionMould<string, any, State, Dependencies>
```

#### ActionReducer:
A redux reducer.

```Typescript
export type ActionReducer<State, Action> = (state: State, action: Action) => State
```

#### Consequence:
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




### Advanced usage
```typescript
import {createStore, applyMiddleware, Store} from 'redux';
import {
    createConsequenceMiddleware,
    actionCreatorFactory,
    RootReducer,
    MakeStoreOpts,
    ConduxionAction,
    ConduxionActionMould,
    ConsequenceGetter
} from 'conduxion';

type AppState = { time: number | null}
type AppDependencies = {}
type AppAction = ConduxionAction<AppState, AppDependencies>
type AppActionMould<Type extends string, Payload> = ConduxionActionMould<
  Type,
  Payload,
  AppState,
  AppDependencies
>

type InitAppPayload = {
  time: number
}

type InitAppAction = AppActionMould<'INIT_APP', InitAppPayload>

const initialAppState: AppState = {
    time: null
}

export const [initApp, isInitApp] = actionCreatorFactory<InitAppAction>({
  type: 'INIT_APP',
  reducer: (state, payload) => {
    const { time } = payload
    
    return {
        ...state,
        time
    }
  }
})
const rootReducer = (state, action) => action.reducer
    ? action.reducer(state, action.payload)
    : state;

const store: Store<AppState, AppAction> = makeStore<AppState, AppAction, AppDependencies>(
     rootReducer,
     initialAppState
)

function makeStore(rootReducer: RootReducer<AppStore, AppAction, AppDependencies>, initialState: AppStore, opts: MakeStoreOpts<AppStore, AppDependencies> = {}) {
    const {
        additionalMiddleware = [],
        dependencies = {},
        initConsequence
    } = opts;
    const consequenceGetter: ConsequenceGetter<AppStore, AppDependencies> = (api) => {
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
