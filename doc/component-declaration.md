# Declaring Components

Declaring a component is as simple as adding a `@Component` decorator to a class.

```typescript
@Component
class MyDependency {
}
```

Once declared a component, the dependency can be [injected](component-injection.md) into other components.

## Stereotypes

The `@Component` decorator is used to declare a generic component.

As an alternative, it is also possible to use one of three more specific stereotypes:

- `@Controller`, dedicated to the presentation layer
- `@Repository`, dedicated to the persistence layer
- `@Service`, dedicated to the service layer

All four decorators exhibit the same behavior, but the annotated code is usually more readable when using the proper stereotype.

It also makes it possible to filter components based on their stereotype.

## Names

The aforementioned decorators also make it possible to give a name to a component.

```typescript
@Component('my-dependency-name')
class MyDependency {
}
```

Components with a name can be queried by name, either programmatically through the [application context](application-context.md) or using the [@Named](component-injection.md#named-injection) decorator.
