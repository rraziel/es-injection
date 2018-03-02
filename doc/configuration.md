# Configuration

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

Sometimes a component cannot be easily instantiated, either because it requires specific settings that are not available to the component and need to be passed in, or simply because the objects are from third-party libraries.

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

## Imported Configuration

As projects grow larger, having multiple configuration classes - one per sub-module - is not uncommon.

In many cases, components defined within a sub-module will have dependencies that come from other sub-modules.

For such a scenario, requiring the user of sub-module A to know they need to add the configuration for sub-module B simply because A requires B is not convenient.

To work around this, the @Import decorator can be used:

```
@Configuration
class ModuleBConfiguration { }

@Configuration
@Import(ModuleBConfiguration)
class ModuleAConfiguration { }
```
