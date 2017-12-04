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

The module can be installed through npm:

```
npm install ts-injection --save
```

## User Guide

* [Declaring Components](blob/master/component-declaration.md)
* [Injecting Components](blob/master/component-injection.md)
* [Injecting Constants](blob/master/constant-injection.md)
* [Application Context](blob/master/context.md)

## Development

The module can be built using the following command:

```
npm run build
```

It is also possible to keep unit tests executing as a background task:

```
npm run test
```
