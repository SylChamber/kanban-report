# Kanban Report

Kanban Report is meant to be a library for making a report of activity in an Azure DevOps team, for Scrum Masters and managers. It aims to be useful in a team adopting Agile practices, and was primarily built for my needs as a Scrum/Kanban master.

## Tooling and branches

The project started as an ECMAScript module with Mocha tests because I could not get Jest to work with ESM modules. However I could not make test coverage work either. I converted everything and now, the main branch is built as a CommonJS package with tests with Jest and test coverage.

It works rather well in Visual Studio Code with the [Jest extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest). However ― even though the Jest tool reports correctly on all tests ― the Jest extension has problems with parameterized tests with `test.each` and does not run or debug them.

Another option (with a cost) is the [Wallaby.js](https://wallabyjs.com/) extension, which works really, really well. [WebStorm](https://www.jetbrains.com/webstorm/) may be a cheaper alternative but I haven't tried it.

The source and unit tests are under `src`, while functional specifications are described under `specs` in [Gherkin](https://cucumber.io/docs/gherkin/reference/) format (see the [Cucumber introduction](https://cucumber.io/docs/guides/overview/)).

An HTML report is generated with `jest-html-reporters` at the root level as `test-report.html`.

The main branch is... `main`. The following branches were made to test both approaches (ESM/Mocha vs CommonJS/Jest) and are both obsolete:

* cjs-jest
* esm-mocha
