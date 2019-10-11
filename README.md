# Conduxion
A small API extracting the goodness of https://github.com/edumentab/talks-redux-patterns by [@krawaller](https://github.com/krawaller).

```typescript
import {actionCreatorFactory} from 'conduxion'
import produce from 'immer'

import {AppActionMould} from '../../../state.types';

import {STATE_KEY} from '../authentication.state';
import {setAppError} from '../../ui';

type SetIsAuthenticatedPayload = {
    isAuthenticated: boolean
}

export type SetIsAuthenticatedAction = AppActionMould<'SET_IS_AUTHENTICATED', SetIsAuthenticatedPayload>

export const [setIsAuthenticated, isSetIsAuthenticated] = actionCreatorFactory<SetIsAuthenticatedAction>({
     type: 'SET_IS_AUTHENTICATED',
     reducer (state, payload) {
         const {isAuthenticated} = payload;
    
         return produce(state, draft => {
             draft[STATE_KEY].isAuthenticated = isAuthenticated;
         })
     },
     consequence({action, dispatch}) {
         const {isAuthenticated} = action.payload;
         
         if (!isAuthenticated) {
             dispatch(setAppError('Not authenticated'));
             return;
         }
     }
});
```

## Table of Contents
- [Philosophy](#philosophy)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Types](#types)

## Philosophy
An alternative approach to redux where we put actions first, and view state as a consequence of them.

Instead of creating singleton reducers responsible for a single state slice, we create reducers for each individual action that can act on the entire state.

Should an action have consequences, they are declared on the action itself (as an event-emitter).

## Installation
```
$ npm i -S conduxion
```
Please note that [`redux`](https://www.npmjs.com/package/redux) is a peer-dependency.

## Usage

### Creating a store
Using pre-fab factories.

```typescript
import {Store} from 'redux';
import {makeStore, RootReducer, ConduxionAction} from 'conduxion';

type AppState = {
    // whatever you want
    [key: string]: any
}
type AppDependencies = {}
type AppAction = ConduxionAction<AppState, AppDependencies>
const INITIAL_APP_STATE: AppState = {}

const rootReducer: RootReducer<AppState, AppAction, AppDependencies> = (state = INITIAL_APP_STATE, action) => action.reducer
    ? action.reducer(state, action.payload)
    : state;

const store: Store<AppState, AppAction> = makeStore<AppState, AppAction, AppDependencies>(
    rootReducer,
    INITIAL_APP_STATE
);

export default store;
```

For your convenience, we also expose a dev version that automatically connects to [Redux DevTools](https://github.com/reduxjs/redux-devtools) 

```typescript
import {Store} from 'redux';
import {createActionLogMiddleware, makeDevStore, RootReducer, ConduxionAction} from 'conduxion';

type AppState = {
    // whatever you want
    [key: string]: any
}
type AppDependencies = {}
type AppAction = ConduxionAction<AppState, AppDependencies>

const INITIAL_APP_STATE: AppState = {}

const rootReducer: RootReducer<AppState, AppAction, AppDependencies> = (state = INITIAL_APP_STATE, action) => action.reducer
    ? action.reducer(state, action.payload)
    : state;

const actionLog: any[] = [];

const store: Store<AppState, AppAction> = makeDevStore<AppState, AppAction, AppDependencies>(
    rootReducer,
    INITIAL_APP_STATE,
    {
        // createActionLogMiddleware mutates actionLog with each action fired
        additionalMiddleware: [createActionLogMiddleware(actionLog)]
    }
);

export default store;
```

### Creating an action
Using the [actionCreatorFactory()](#actioncreatorfactory) factory function.

```typescript
import {actionCreatorFactory, ConduxionActionMould} from 'conduxion'

import {AppState, AppDependencies} from '../somewhere'
import {setAppError} from '../somewhere-else'

type AppActionMould<T extends string, P> = ConduxionActionMould<
    T,
    P,
    AppState,
    AppDependencies
>

type SetIsAuthenticatedPayload = {
    isAuthenticated: boolean
}

export type SetIsAuthenticatedAction = AppActionMould<'SET_IS_AUTHENTICATED', SetIsAuthenticatedPayload>

export const [setIsAuthenticated, isSetIsAuthenticated] = actionCreatorFactory<SetIsAuthenticatedAction>({
    type: 'SET_IS_AUTHENTICATED',
    // optional
    reducer: (state, payload) => {
        const {isAuthenticated} = payload;

        return {
            ...state,
            isAuthenticated
        }
    },
    // optional
    consequence({action, dispatch}) {
         const {isAuthenticated} = action.payload;
         
         if (!isAuthenticated) {
             dispatch(setAppError('Not authenticated'));
             return;
         }
    }
});
```

## API
- [makeStore](#makestore)
- [makeDevStore](#makedevstore)
- [actionCreatorFactory](#actionCreatorFactory)

### makeStore
Creates a conduxion redux store with consequence middleware applied.

```typescript
import {Store} from 'redux'
import {ConduxionAction, RootReducer, MakeStoreOptions} from 'conduxion';

export function makeStore<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object>(
    rootReducer: RootReducer<State, A, Dependencies>,
    initialState: State,
    opts: MakeStoreOptions<State, Dependencies> = {}
): Store<State, A>;
```

### makeDevStore
Creates a conduxion redux store with consequence middleware as well as [Redux DevTools](https://github.com/reduxjs/redux-devtools) middleware applied.

```typescript
import {Store} from 'redux'
import {ConduxionAction, RootReducer, MakeStoreOptions} from 'conduxion';

export function makeStore<State extends object, A extends ConduxionAction<State, Dependencies>, Dependencies extends object>(
    rootReducer: RootReducer<State, A, Dependencies>,
    initialState: State,
    opts: MakeStoreOptions<State, Dependencies> = {}
): Store<State, A>;
```

### actionCreatorFactory
Factory function returning an [ActionCreator](#actioncreator) and [ActionGuard](#actionguard) for a gived redux action.
```typescript
import {
    Action,
    ActionType,
    ActionReducer,
    ActionState,
    ActionPayload,
    Consequence,
    ActionDeps,
    ConduxionAction,
    ActionCreator,
    ActionGuard
} from 'conduxion'

type CreatorBlueprint<A extends Action<string, any, any, any>> = {
    type: ActionType<A>
    reducer: ActionReducer<ActionState<A>, ActionPayload<A>>
    isError?: boolean
    consequence?: Consequence<ActionState<A>, ActionDeps<A>, ActionPayload<A>>
}

export default function actionCreatorFactory<A extends ConduxionAction<any, any>>(
    blueprint: CreatorBlueprint<A>
): [ActionCreator<A>, ActionGuard<A>]
``` 

## Types
There are a lot of types exposed by conduxion, here are a few of them. Please see [the root types](./src/types) as well as [the core types](./src/core/types) for a comprehensive list.
- [RootReducer](#rootreducer)
- [Action](#action)
- [Consequence](#consequence)
- [ConduxionActionMould](#conduxionactionmould)
- [MakeStoreOptions](#makestoreoptions)

### RootReducer
Redux root reducer for conduxion.

```typescript
import {ConduxionAction} from 'conduxion'

export type RootReducer<
    State extends object,
    A extends ConduxionAction<State, Dependencies>,
    Dependencies extends object
> = (state: State | undefined, action: A) => State;
```

### Action
The base interface for all conduxion actions. Enables use of [consequence methods](#consequence).
```typescript
import {ActionReducer, Consequence} from 'conduxion';

export interface Action<
    Type extends string,
    Payload extends any,
    State extends object,
    Dependencies extends object> {
    type: Type
    error?: boolean
    sender?: string
    reducer?: ActionReducer<State, Payload>
    payload: Payload
    consequence?: Consequence<State, Dependencies, Payload> | Consequence<State, Dependencies, Payload>[]
}
```

### Consequence
An [action](#action) consequence method.

```typescript
import {ConsequenceAPI} from 'conduxion'

export type Consequence<State extends object, Dependencies extends object, Payload extends any = any> = ((
    api: ConsequenceAPI<State, Dependencies, Payload>
) => void) & {
    name: string,
    displayName?: string
}
```

### ConduxionActionMould
Generic representation of a conduxion action.

```typescript
import {Action} from 'conduxion';

export type ConduxionActionMould<
    Type extends string,
    Payload,
    State extends object,
    Dependencies extends object
> = Action<Type, Payload, State, Dependencies>
```

### MakeStoreOptions
Additional configuration for [makeStore](#makestore) and [makeDevStore](#makedevstore).

```typescript
import {Middleware} from 'redux';
import {ConsequenceGetter, Consequence} from 'conduxion';

export type MakeStoreOptions<State extends object, Dependencies extends object> = {
    additionalMiddleware?: Middleware[]
    dependencies?: Dependencies
    consequenceGetter?: ConsequenceGetter<State, Dependencies>
    initConsequence?: Consequence<State, Dependencies>
}
```
