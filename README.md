# Kanban Report

## working with the Azure DevOps Node API

```javascript
// import the azdev API
import * as azdev from 'azure-devops-node-api'

// set up a connection to an org
const orgUrl = 'https://dev.azure.com/{org}'
const token = process.env.AZURE_DEVOPS_EXT_PAT
const authHandler = azdev.getPersonalAccessTokenHandler(token)
const connection = new azdev.WebApi(orgUrl, authHandler)

// getting a Work Items Tracking API
const witApi = await connection.getWorkItemTrackingApi()

// querying work items batch
const req = {
  ids = [ 1224, 1339 ],
  $expand = 'All'
}
const workItems = await witApi.getWorkItemsBatch(req, '<project>')
```

## Mapping user stories

```javascript
const mapToUserStory = item => {
  const closedBy = 'Microsoft.VSTS.Common.ClosedBy'
  const closedDate = 'Microsoft.VSTS.Common.ClosedDate'

  let story = {
    id: item.id,
    workItemType: item.fields['System.WorkItemType'],
    areaPath: item.fields['System.AreaPath'],
    title: item.fields['System.Title'],
    description: item.fields['System.Description'],
    board: mapToBoard(item),
    state: item.fields['System.State'],
    assignedTo: mapToPerson(item.fields['System.AssignedTo']),
    acceptanceCriteria: item.fields['Microsoft.VSTS.Common.AcceptanceCriteria'],
    changedDate: new Date(item.fields['System.ChangedDate']),
    closedDate: item.fields[closedDate]) ?
      new Date(item.fields[closedDate]) :
      undefined,
    closedBy: mapToPerson(item.fields[closedBy]),
    tags: item.fields['System.Tags'].split(' '),
    url: item.url
  }

  return story
}

const mapToPerson = identity => {

  if (!identity) {
    return undefined
  }

  let person = {
    name: identity.displayName,
    email: identity.uniqueName
  }

  return person
}

const mapToBoard = item => {
  let board = {
    column: item.fields['System.BoardColumn'],
    done: item.fields['System.BoardColumnDone'],
    lane: item.fields['System.BoardLane'],
    rank: item.fields['Microsoft.VSTS.Common.StackRank']
  }

  return board
}

```
