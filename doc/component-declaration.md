# Component Declaration

- [Introduction](#introduction)
- [Basic Declaration](#basic-declaration)
- [Component Stereotypes](#component-stereotypes)
- [Named Components](#named-components)

## Introduction

Not documented yet.

## Basic Declaration

Declaring a component is as simple as adding a `@Component` decorator to a class.

```typescript
import {Component} from 'es-injection';

@Component
class MyDependency {

}
```

Once declared a component, the dependency can be [injected](component-injection.md) into other components.

## Component Stereotypes

The `@Component` decorator is used to declare a generic component.

As an alternative, it is also possible to use one of three more specific stereotypes:

- `@Controller`, dedicated to the presentation layer
- `@Repository`, dedicated to the persistence layer
- `@Service`, dedicated to the service layer

All four decorators exhibit the same behavior, but the annotated code is usually more readable when using the proper stereotype.

It also makes it possible to filter components based on their stereotype.

## Named Components

The aforementioned decorators also make it possible to give a name to a component.

```typescript
import {Component} from 'es-injection';

@Component('my-dependency-name')
class MyDependency {

}
```

Components with a name can be queried by name, either programmatically through the [application context](application-context.md) or using the [@Named](component-injection.md#named-dependencies) decorator.

## Abstract Class vs. Interface

Currently, interfaces are not concrete types and do not get compiled into an actual object.

Due to this, it is not possible to add decorators to an interface and then retrieve components through this interface.

It, however, possible to achieve something quite similar by creating an abstract class with nothing but abstract methods.

The following interface:

```typescript
interface MyComponent {
    myMethod(): void;
}
```

Thus becomes:

```typescript
abstract class MyComponent {
    abstract myMethod(): void;
}
```
