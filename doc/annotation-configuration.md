# Annotation-Based Configuration

A context needs to be configured in order to know what type of components or constants can be injected.

This is done through a set of configuration classes.

## Configuration Class

The first thing needed in order to configure a context is a configuration class.

A configuration class is nothing more than a component with a configuration stereotype.

In practice, this means configuration classes can receive injected dependencies.

```typescript
@Configuration
class MyConfiguration { }
```

Configuration classes are registered within a `AnnotationConfigApplicationContext`:

```typescript
let applicationContext: ApplicationContext = new AnnotationConfigApplicationContext();
applicationContext.register(myConfiguration);
```

## Defining Components

Defining components can be done through multiple mechanisms, each of them with its own advantages and disadvantages.

### Component Scan

A component scan is likely the easiest way to register components within a configuration class.

The @ComponentScan is used to list all components available through the configuration:

```typescript
@Component
class MyComponent { }

@Configuration
@ComponentScan(MyComponent)
class MyConfiguration { }
```

This effectively lets the application context create `MyComponent` instances.

### Component Instance

Sometimes a component cannot be easily instantiated, either because it requires specific settings that are not
available to the component and need to be passed in, or simply because the objects are from third-party libraries.

In this scenario, components can be created directly within the configuration class:

```typescript
@Configuration
class MyConfiguration {
    @Component
    instantiateThirdPartyComponent(): ThirdPartyComponent {
        return new ThirdPartyComponent();
    }
}
```

The method may also return a promise that will eventually resolve to the component:

```typescript
@Configuration
class MyConfiguration {
    @Component
    async instantiateThirdPartyComponentAsynchronously(): Promise<ThirdPartyComponent> {
        return new ThirdPartyComponent();
    }
}
```

### Constant Value

Similarly, configuration classes can define constant values:

```typescript
@Configuration
class MyConfiguration {
    @Value('my-value')
    getMyValue(): number {
        return 42;
    }
}
```

And just like component instances, constants may also be resolved asynchronously:

```typescript
@Configuration
class MyConfiguration {
    @Value('my-value')
    async getMyValue(): Promise<number> {
        return 42;
    }
}
```

## Imported Configuration

As projects grow larger, having multiple configuration classes - one per sub-module - is not uncommon.

In many cases, components defined within a sub-module will have dependencies that come from other sub-modules.

For such a scenario, requiring the user of sub-module A to know they need to add the configuration for sub-module B
simply because A requires B is not convenient.

To work around this, the @Import decorator can be used:

```typescript
@Configuration
class ModuleBConfiguration { }

@Configuration
@Import(ModuleBConfiguration)
class ModuleAConfiguration { }
```

It is also possible to use the @Import decorator with promises.

As a rejected promise is simply ignored, this mechanism can be used to automatically import optional modules:

```typescript
@Configuration
@Import(async () => await import('optional-dependency').OptionalDependencyConfiguration)
class ModuleConfiguration { }
```
