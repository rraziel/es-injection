# Injecting Components

- [Introduction](#introduction)
- [Dependencies](#dependencies)
  - [Constructor-based Injection](#constructor-based-injection)
  - [Method-based Injection](#method-based-injection)
  - [Property-based Injection](#property-based-injection)
- [Named Dependencies](#named-dependencies)
- [Optional Dependencies](#optional-dependencies)
- [Containers](#container-dependencies)
  - [Arrays](#arrays)
  - [Maps](#maps)

## Introduction

The main advantage of using es-injection is that components may be injected into other components.

This helps properly separating the responsibilities of each components, while making testing more straightforward as
injected dependencies can simply be mocked.

## Dependencies

Injecting a dependency is done using the `@Inject` decorator.

A number of additional decorators also make it possible to further refine what gets injected.

### Constructor-based Injection

Since es-injection manages the instantiation of components, it needs to be able to provide all constructor arguments.

In practice, it means all constructor parameters come from injection without requiring the `@Inject` decorator.

```typescript
@Component
class MyComponent {
    constructor(dependency1: DependencyComponent, dependency2: OtherDependencyComponent) {
    }
}
```

While convenient, constructor-based injection should be limited to dependencies that are necessary to the instance
construction.

When that is not the case, [method-based injection](#method-based) should be favored.

### Method-based Injection

Method-based injection tells es-injection to inject a dependency via a method call.

For such cases, the `@Inject` decorator is required.

```typescript
@Component
class MyComponent {
    @Inject
    setDependencies(dependency1: DependencyComponent, dependency2: OtherDependencyComponent): void {
    }

    @Inject
    setMoreDependencies(dependency3: YetAnotherDependencyComponent): void {
    }
}
```

Multiple methods can be decorated with `@Inject`, but common practice involves injecting a single dependency per method
call though.

### Property-based Injection

Property-based injection tells es-injection to inject a dependency directly into a property.

Doing this required the `@Inject` decorator as well.

```typescript
@Component
class MyComponent {
    @Inject
    dependency1: DependencyComponent;
    @Inject
    dependency2: OtherDependencyComponent;
}
```

While convenient, property-based injection can prove difficult to work with as such injected properties are generally
meant to be private and could therefore not be set from outside the class, e.g. for tests.

## Named Dependencies

TODO.

## Optional Dependencies

An optional dependency is a dependency that may not be available within the
[application context](./application-context.md).

When encountering such an optional dependency, the injected value will be `undefined` if the dependency is unavailable.

```typescript
@Component
class MyComponent {
    @Inject
    setDependency(@Optional dependency: DependencyComponent|undefined): void {
    }
}
```

## Containers

Sometimes multiple classes match an injection request, such as injecting a based class that has multiple derived
components.

In that case, an array or a map can be used to inject all available components.

Due to current limitations with the code emitted from a TypeScript compilation, es-injection cannot know the type
to inject when using arrays or maps.

To work around this issue, the `@ElementClass` decorator must be used.

### Arrays

When injecting an array, the `@ElementClass` decorator hints at the type of the elements in the list.

```typescript
@Component
class MyComponent {
    @Inject
    setDependencies(@ElementClass(BaseClass) dependencies: Array<BaseClass>): void {
    }
}
```

### Maps

When injecting a map, the `@ElementClass` decorator hints at the type of the values in the list.

The keys must always be strings, and will be each component's name.

```typescript
@Component
class MyComponent {
    @Inject
    setDependencies(@ElementClass(BaseClass) dependencies: Map<string, BaseClass>): void {
    }
}
```
