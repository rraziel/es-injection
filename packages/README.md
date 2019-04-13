# es-injection Source

[![Dependencies](https://img.shields.io/david/rraziel/es-injection.svg?label=Dependencies&style=for-the-badge)](https://david-dm.org/rraziel/es-injection)
[![Development dependencies](https://img.shields.io/david/dev/rraziel/es-injection.svg?label=Dev%20Dependencies&style=for-the-badge)](https://david-dm.org/rraziel/es-injection?type=dev)

## Structure

Most classes are split into two files:

- `*.ts`: the actual class
- `*.spec.ts`: the class specification as a set of [Jest](https://facebook.github.io/jest/) unit tests

The root-level `index.ts` file exports the public module API.
