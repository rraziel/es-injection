# Application Context

- [Introduction](#introduction)
- [Context Lifecycle](#context-lifecycle)
- [Context Configuration](#context-configuration)
  - [Annotation-Based Configuration](#annotation-based-configuration)
- [Context Start](#context-start)

## Introduction

The application context is the central interface for [component injection](component-injection.md).

## Context Lifecycle

The application context has a lifecycle that determines what type of operation can be performed with the application
context.

The lifecycle can be describe as the following steps:

1. the [context configuration](#context-configuration) phase
2. the [context start](#context-start)
3. the execution phase
4. the [context stop](#context-stop)

The context gets configured and, once started, becomes read-only.

## Context Configuration

Not documented yet.

### Annotation-Based Configuration

While an application context can be configured programmatically, the same result can be obtained declaratively.

This is achieved through the `AnnotationConfigApplicationContext` class.

Annotation-based configuration makes it possible to:
- declare components that need to be registered, via the `@ComponentScan` decorator
- declare other configurations that are dependencies, via the `@Import` decorator
- provide component instances via methods annotated with a `@Component` decorator

More information regarding annotation-based configuration can be found in the
[Annotation-based Configuration chapter](annotation-configuration.md).

## Context Start

Not documented yet.

## Context Stop

Not documented yet.
