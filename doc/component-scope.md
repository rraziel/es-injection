# Component Scope

- [Introduction](#introduction)
- [Singleton Scope](#singleton-scope)
- [Prototype Scope](#prototype-scope)

## Introduction

A component can have one of two scopes, declared using the `@Scope` decorator.

The scope determines when happens when the component needs to be [injected](component-injection.md) or when it gets
retrieved through an [application context](application-context.md).

## Singleton Scope

The singleton scope is the default, implicit scope. When no `@Scope` decorator is present, a component has a singleton
scope. It can, however, be set explicitely:

```typescript
import {ApplicationContext, Component, Scope, ScopeType} from '@es-injection/decorators';

@Component
@Scope(ScopeType.SINGLETON)
class MyComponent {

}

async function sameInstances(applicationContext: ApplicationContext): boolean {
    const instance1: MyComponent = await applicationContext.getComponent(MyComponent);
    const instance2: MyComponent = await applicationContext.getComponent(MyComponent);
    return instance1 === instance2; // always true
}
```

When a component is a singleton, it will be instantiated only once.

Each time the component needs to be [injected](component-injection.md), and each time the component is retrieved
through an [application context](application-context.md), the same single unique instance is used.

This scope is generally used for global objects that are expected to be singletons.

## Prototype Scope

The prototype scope requires a new component instance to be used whenever requesting the component.

It is set explicitely using a `PROTOTYPE` scope type:

```typescript
import {ApplicationContext, Component, Scope, ScopeType} '@es-injection/decorators';

@Component
@Scope(ScopeType.PROTOTYPE)
class MyComponent {

}

async function sameInstances(applicationContext: ApplicationContext): boolean {
    let instance1: MyComponent = await applicationContext.getComponent(MyComponent);
    let instance2: MyComponent = await applicationCOntext.getComponent(MyComponent);
    return instance1 === instance2; // always false
}
```

This scope is generally used for objects that get instantiated many times throughought the lifecycle of an application.

The advantage of using a prototype component versus simply creating a new instance manually is that the prototype
component will get its dependencies injected automatically.
