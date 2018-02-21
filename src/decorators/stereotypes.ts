import {createStereotypeDecorator, StereotypeDecorator} from './stereotype';
import {Stereotype} from '../metadata';

const Configuration: StereotypeDecorator = createStereotypeDecorator(Stereotype.CONFIGURATION);
const Component: StereotypeDecorator = createStereotypeDecorator(Stereotype.COMPONENT);
const Controller: StereotypeDecorator = createStereotypeDecorator(Stereotype.CONTROLLER);
const Repository: StereotypeDecorator = createStereotypeDecorator(Stereotype.REPOSITORY);
const Service: StereotypeDecorator = createStereotypeDecorator(Stereotype.SERVICE);

export {
    Configuration,
    Component,
    Controller,
    Repository,
    Service
};
