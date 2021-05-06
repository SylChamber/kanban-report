# Kanban Report

Kanban Report is meant to be a library for making a report of activity in an Azure DevOps team, for Scrum Masters and managers. It aims to be useful in a team adopting Agile practices, and was primarily built for my needs as a Scrum/Kanban master.

And frankly, it is mostly a laboratory. You will surely be puzzled by the way the code was written. The truth is that I am using this project to explore and experiment concepts and technologies.

## Documentation

There is little documentation for the moment, although there are JSDoc comments everywhere. And, of course, there are unit tests.

* [`dependencies.drawio`](./dependencies.drawio) in the root folder is a draw.io/Diagrams.net diagram that represents dependencies between the different functions that make up the code. You might want to install the [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) extension to view it in Visual Studio Code.
* [`Notes - Azure DevOps API.md`](./Notes%20-%20Azure%20DevOps%20API.md) describes some of the Azure DevOps REST APIs that are used in the code.

## Tooling and branches

The project started as an ECMAScript module with Mocha tests because I could not get Jest to work with ESM modules. However I could not make test coverage work either. So now, the main branch is built as a CommonJS package with tests with Jest and test coverage.

It works rather well in Visual Studio Code with the [Jest extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest). However ― even though the Jest tool reports correctly on all tests ― the Jest extension has problems with parameterized tests with `test.each` and does not run or debug them. I had to install the [v4.0.0 preview version of the VS Code Jest extension](https://github.com/jest-community/vscode-jest/releases/tag/v4.0.0-alpha.5) that fixes this problem.

Another option (with a cost) is the [Wallaby.js](https://wallabyjs.com/) extension, which works really, really well. [WebStorm](https://www.jetbrains.com/webstorm/) may be a cheaper alternative but I haven't tried it.

The source and unit tests are under `src`, while functional specifications are described under `specs` in [Gherkin](https://cucumber.io/docs/gherkin/reference/) format (see the [Cucumber introduction](https://cucumber.io/docs/guides/overview/)).

A `watch` npm task generates an HTML report with `jest-html-reporters` at the root level as `test-report.html`, and a code coverage report under `coverage/lcov-report/index.html`. I like to use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension to watch both files in a browser window.

The main branch is... `main`. The following branches were made to test both approaches (ESM/Mocha vs CommonJS/Jest) and are both obsolete:

* cjs-jest
* esm-mocha

## Data Aggregation

Some notes on data aggregation. (Todo as of time of commit)

We want to know:

* how much time stories spend on each stage (*state*, *column* and the *doing/done* subcolumn)
* how many rollbacks stories do (for example, *active* → *new* → *active*)

These metrics should be available for categories of stories (e.g. *area paths*) and percentiles (for example, *x* days on *y* stage at 85% probability). So it's best to store these metrics for individual stories and have their closed dates.
