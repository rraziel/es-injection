# es-injection

A modern, lightweight implementation of dependency injection inspired by [JSR-330](https://jcp.org/en/jsr/detail?id=330) and [Spring](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-spring-beans-and-dependency-injection.html).

[![Version](https://img.shields.io/npm/v/es-injection.svg?label=Version&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/es-injection)
[![Downloads](https://img.shields.io/npm/dt/es-injection.svg?label=Downloads&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/es-injection)
[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/es-injection/master.svg?label=Win32&style=for-the-badge&logo=appveyor)](https://ci.appveyor.com/project/rraziel/es-injection)
[![CircleCI](https://img.shields.io/circleci/project/github/rraziel/es-injection/master.svg?label=MacOS&style=for-the-badge&logo=circleci)](https://circleci.com/gh/rraziel/es-injection)
[![Travis CI](https://img.shields.io/travis/rraziel/es-injection/master.svg?label=Linux&style=for-the-badge&logo=travis)](https://travis-ci.org/rraziel/es-injection)

[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/es-injection/master.svg?label=Tests&style=for-the-badge&logo=appveyor)](https://ci.appveyor.com/project/rraziel/es-injection/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/rraziel/es-injection.svg?label=Coverage&style=for-the-badge&logo=codecov)](https://codecov.io/gh/rraziel/es-injection)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/rraziel/es-injection.svg?label=Maintainability&style=for-the-badge&logo=codeclimate)](https://codeclimate.com/github/rraziel/es-injection)
[![Code Climate](https://img.shields.io/codeclimate/issues/rraziel/es-injection.svg?label=Code%20Issues&style=for-the-badge&logo=codeclimate)](https://codeclimate.com/github/rraziel/es-injection/issues)

## Overview

The library makes it possible to:

- define components and manage their lifecycle
- inject said components as dependencies

This loose coupling tends to make code more self-contained and easier to test, as injected components can be mocked to exhibit the behavior required for each test.

## User Guide

* [Application Context](doc/application-context.md)
* [Component Declaration](doc/component-declaration.md)
* [Component Injection](doc/component-injection.md)
* [Component Lifecycle](doc/component-lifecycle.md)
* [Component Scope](doc/component-scope.md)
* [Constant Injection](doc/constant-injection.md)
* [Annotation-Based Configuration](doc/annotation-configuration.md)

## Installation

The library can be installed using `npm`:

```
npm install es-injection --save
```

Or using `yarn`:

```
yarn add es-injection
```

## Development

The module can be built using the following command:

```
npm run compile
```

It is also possible to keep unit and integration tests executing as a background task:

```
npm run test:watch
```
