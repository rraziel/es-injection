# Injectable

A modern, lightweight implementation of dependency injection inspired by [JSR-330](https://jcp.org/en/jsr/detail?id=330) and [Spring](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-spring-beans-and-dependency-injection.html).

The library makes it possible to:

- define components and manage their lifecycle
- inject said components as dependencies

This loose coupling tends to make code more self-contained and easier to test, as injected components can be mocked to exhibit the behavior required for each test.

## Installation

At the moment, the module is not available through npm. This is being sorted out.

## Declaring Components

While not required, it is considered best practice to inject interfaces and to define injected dependencies in the interface's implementation.

```typescript
interface MyDependency {
    myMethod(): void;
}

@Component
class MyDependencyImpl implements MyDependency {
    myMethod(): void {
        console.log('Hello World!');
    }
}

@Component
class MyOtherComponent {
    @Inject
    setMyDependency(myDependency: MyDependency): void {
        myDependency.myMethod();
    }
}
```

In this example, the `MyOtherComponent` class does not need to know anything about `MyDependency`'s implementation details.

### Component Stereotypes

The `@Component` decorator is used to declare a generic component, however it is also possible to use three more specific stereotypes:

- `@Controller`: stereotype dedicated to the presentation layer
- `@Repository`: stereotype dedicated to the persistence layer
- `@Service`: stereotype dedicated to the service layer

All four decorators exhibit the same behavior. However the annotated code is usually more readable when using the proper stereotype. It also makes it possible to retrieve a list of components based on their stereotype.

### Named Components

The decorators also make it possible to specify a name for the component. This enables the ability to refer to a component by name rather than by type when injecting it, using the `@Named` decorator.

```typescript
@Component('myDependencyImpl')
class MyDependencyImpl implements MyDependency { /* ... */ }

@Component
class MyOtherComponent {
    @Inject
    setMyDependency(@Named('myDependencyImpl') myDependency: MyDependency): void { /* ... */ }
}
```

Although not frequently happening, a possible scenario for this would be the case of having multiple implementations for a single interface and wanting to inject a specific implementation.

When no name is specified, the library generates one based on the component class name.

### Injecting Components

Dependency injection can occur at three different points:

- On a constructor
- On a method
- On a property

Injecting via a method is usually the most flexible method, as it can also work around cyclic dependency issues.

## Development

The module can be built using the following command:

```
npm run build
```

It is also possible to keep unit tests executing as a background task:

```
npm run test
```
