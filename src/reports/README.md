# Notes

Notes on algorithms for generating reports

```JavaScript
let wasCreatedSincepreviousDay = wasCreatedOrModifiedOnOrSince(stories.referenceDate)
let wasCreatedByTeam = wasCreatedBy(team)
let groupByCreator = (group, comment) => {
  if (!Object.prototype.hasOwnProperty.call(group, comment.createdBy.name)) {
    group[comment.createdBy.name] = []
  }
  group[comment.createdBy.name].push(comment)
  return group
}


stories.stories.flatMap(s => s.comments)
  .filter(wasCreatedSincePreviousDay)
  .filter(wasCreatedByTeam)
  .reduce(groupByCreator, {})
```
