# Component Lifecycle

- [Introduction](#introduction)
- [Construction Phase](#construction-phase)
  - [Post-Construction Methods](#post-construction-methods)
    - [Asynchronous Post-Construction Methods](#asynchronous-post-construction-methods)
  - [Post-Construction Order](#post-construction-order)
- [Destruction Phase](#destruction-phase)
  - [Pre-Destruction Methods](#pre-destruction-methods)
    - [Asynchronous Pre-Destruction Methods](#asynchronous-pre-destruction-methods)
  - [Pre-Destruction Order](#pre-destruction-order)

## Introduction

A component possesses a lifecycle, with two phases that occurs during the component's construction and destruction.

It is possible to execute logic during those phases, which are generally used to initialize a component or shut it down, respectively.

## Construction Phase

The construction phase starts when a component needs to be instantiated. This phase is split into multiple steps

1. the class constructor gets called with injected parameters
2. the class properties marked for injection get injected, including for base classes
3. the class methods marked for injection get injected, including for base classes
4. the class methods marked for post-constuction get called, including for base classes

### Post-Construction Methods

A post-destruction method is a method decorated with the `@PostConstruct` decorator:

```typescript
import {Component, PostConstruct} from 'es-injection';

@Component
class MyComponent {

    @PostConstruct
    initialize(): void {
        // Perform component initialization
    }

}
```

#### Asynchronous Post-Construction Methods

It is also possible to perform an asynchronous cleanup, simply by having the method return a promise:

```typescript
import {Component, PreDestroy} from 'es-injection';

@Component
class MyComponent {

    @PreDestroy
    async initialization(): Promise<void> {
        // Perform component initialization asynchronously
    }

}
```

### Pre-Construction Order

The pre-construction method call order can be explicitely set using `@Order` decorators:

```typescript
import {Component, Order, PostConstruct} from 'es-injection';

@Component
class MyComponent {

    @PostConstruct
    @Order(11)
    initialize1(): void {
        // Method call #3
    }

    @PostConstruct
    @Order(3)
    initialize2(): void {
        // Method call #1
    }

    @PostConstruct
    @Order(5)
    initialize3(): void {
        // Method call #2
    }

}
```

Without `@Order` decorators, there is no order guarantee regarding how pre-destruction methods are called.

## Destruction Phase

The destruction phase is simpler, but still made of multiple steps:

1. the class methods marked for pre-destruction get called, including for base classes
2. the class properties marked for injection get set to `undefined`

### Pre-Destruction Methods

A pre-destruction method is a method decorated with the `@PreDestroy` decorator:

```typescript
import {Component, PreDestroy} from 'es-injection';

@Component
class MyComponent {

    @PreDestroy
    cleanup(): void {
        // Perform component cleanup
    }

}
```

#### Asynchronouis Pre-Destruction Methods

It is also possible to perform an asynchronous cleanup, simply by having the method return a promise:

```typescript
import {Component, PreDestroy} from 'es-injection';

@Component
class MyComponent {

    @PreDestroy
    async cleanup(): Promise<void> {
        // Perform component cleanup asynchronously
    }

}
```

### Pre-Destruction Order

The pre-destruction method call order can be explicitely set using `@Order` decorators:

```typescript
import {Component, Order, PreDestroy} from 'es-injection';

@Component
class MyComponent {

    @PreDestroy
    @Order(8)
    cleanup1(): void {
        // Method call #3
    }

    @PreDestroy
    @Order(0)
    cleanup2(): void {
        // Method call #1
    }

    @PreDestroy
    @Order(6)
    cleanup3(): void {
        // Method call #2
    }

}
```

Without `@Order` decorators, there is no order guarantee regarding how pre-destruction methods are called.
