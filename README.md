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
