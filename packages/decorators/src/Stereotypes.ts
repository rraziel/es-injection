import {createStereotypeDecorator, StereotypeDecorator} from './stereotype';

const Configuration: StereotypeDecorator = createStereotypeDecorator('CONFIGURATION', {classOnly: true});
const Component: StereotypeDecorator = createStereotypeDecorator('COMPONENT');
const Controller: StereotypeDecorator = createStereotypeDecorator('CONTROLLER');
const Repository: StereotypeDecorator = createStereotypeDecorator('REPOSITORY');
const Service: StereotypeDecorator = createStereotypeDecorator('SERVICE');

export {
    Configuration,
    Component,
    Controller,
    Repository,
    Service
};
