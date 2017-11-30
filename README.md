# es-injection

[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/es-injection/master.svg?label=Win32&style=flat)](https://ci.appveyor.com/project/rraziel/es-injection)
[![CircleCI](https://img.shields.io/circleci/project/github/rraziel/es-injection/master.svg?label=MacOS&style=flat)](https://circleci.com/gh/rraziel/es-injection)
[![Travis CI](https://img.shields.io/travis/rraziel/es-injection/master.svg?label=Linux&style=flat)](https://travis-ci.org/rraziel/es-injection)
[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/es-injection/master.svg?label=Tests&style=flat)](https://ci.appveyor.com/project/rraziel/es-injection/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/rraziel/es-injection.svg?label=Coverage&style=flat)](https://codecov.io/gh/rraziel/es-injection)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/rraziel/es-injection.svg?label=Maintainability&style=flat)](https://codeclimate.com/github/rraziel/es-injection)
[![Code Climate](https://img.shields.io/codeclimate/issues/github/rraziel/es-injection.svg?label=Code%20Issues&style=flat)](https://codeclimate.com/github/rraziel/es-injection/issues)

[![Dependencies](https://img.shields.io/david/rraziel/es-injection.svg?label=Dependencies&style=flat)](https://david-dm.org/rraziel/es-injection)
[![Development dependencies](https://img.shields.io/david/dev/rraziel/es-injection.svg?label=Dev%20Dependencies&style=flat)](https://david-dm.org/rraziel/es-injection?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/rraziel/es-injection/badge.svg)](https://snyk.io/test/github/rraziel/es-injection)
[![Greenkeeper](https://badges.greenkeeper.io/rraziel/es-injection.svg)](https://greenkeeper.io/)

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

The `@Component` decorator is used to declare a generic component.

As an alternative, it is also possible to use one of the three more specific stereotypes:

- `@Controller`, which is dedicated to the presentation layer
- `@Repository`, which is dedicated to the persistence layer
- `@Service`, which is dedicated to the service layer

All four decorators exhibit the same behavior, but the annotated code is usually more readable when using the proper stereotype.

It also makes it possible to filter components based on their stereotype.

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
