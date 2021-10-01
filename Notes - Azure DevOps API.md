# Notes on Azure DevOps REST API

## Authentication

First [create a personal token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat).

Use `Basic` authentication with your email address as `username` and the personal access token as the password.

Here is an example in PowerShell:

```PowerShell
$cred = Get-Credential # prompts for username (email address) and password (token)
$headers = @{
  Accept = 'application/json; api-version=6.0'
  'Content-Type' = 'application/json'
}
$org = '<organisation name>'
$proj = '<project name>'
# PSCustomObject optional: for user friendlier display
$req = [PSCustomObject]@{
  includeDeleted = $false
  includeLatestOnly = $true
  types = @('User Story', 'Bug')
}
$url = "https://dev.azure.com/$org/$proj/_apis/wit/reporting/workitemrevisions"
$firstRevisions = Invoke-RestMethod -Method Post -Body $req `
  -Authentication Basic -Credential $cred `
  -Uri $url -Headers $headers
```

## Team Configuration

### Mapped States

Mapped states are available in [Backlogconfiguration](https://docs.microsoft.com/en-us/rest/api/azure/devops/work/backlogconfiguration/get?view=azure-devops-rest-6.0). For example, to obtain mapped states for a team:

```http
GET https://dev.azure.com/fabrikam/Fabrikam-Fiber/_apis/work/backlogconfiguration
```

Partial result:

```json
{
  ...
  "workItemTypeMappedStates": [
      {
      "workItemTypeName": "Epic",
      "states": {
        "New": "Proposed",
        "Active": "InProgress",
        "Resolved": "InProgress",
        "Closed": "Completed"
      }
    },
    {
      "workItemTypeName": "User Story",
      "states": {
        "New": "Proposed",
        "Active": "InProgress",
        "Resolved": "InProgress",
        "Closed": "Completed"
      }
    },
    {
      "workItemTypeName": "Feature",
      "states": {
        "New": "Proposed",
        "Prioritized": "Proposed",
        "Analyzing": "Proposed",
        "Program Backlog": "Proposed",
        "Ready": "Proposed",
        "Implementing": "InProgress",
        "Validating on staging": "InProgress",
        "Deploying to production": "Resolved",
        "Realeasing": "Resolved",
        "Closed": "Completed"
      }
    },
    {
      "workItemTypeName": "Task",
      "states": {
        "New": "Proposed",
        "Active": "InProgress",
        "Closed": "Completed"
      }
    },
    {
      "workItemTypeName": "Bug",
      "states": {
        "New": "Proposed",
        "Active": "InProgress",
        "Resolved": "Resolved",
        "Closed": "Completed"
      }
    }
  ]
}
```

### Areas

Areas are available in [TeamFieldValues](https://docs.microsoft.com/en-us/rest/api/azure/devops/work/teamfieldvalues/get?view=azure-devops-rest-6.0). For example, to obtain team areas:

```http
GET https://dev.azure.com/fabrikam/Fabrikam-Fiber/_apis/work/teamsettings/teamfieldvalues
```

Partial result:

```json
{
  "field": {
    "referenceName": "System.AreaPath",
    "url": "https://dev.azure.com/fabrikam/_apis/wit/fields/System.AreaPath"
  },
  "defaultValue": "Fabrikam-Fiber\\Auto",
  "values": [
    {
      "value": "Fabrikam-Fiber\\Auto",
      "includeChildren": false
    },
    {
      "value": "Fabrikam-Fiber\\Fiber",
      "includeChildren": false
    },
    {
      "value": "Fabrikam-Fiber\\Optics",
      "includeChildren": false
    }
  ], ...
}
```

### Iterations

Team iterations are available in [Iterations](https://docs.microsoft.com/en-us/rest/api/azure/devops/work/iterations?view=azure-devops-rest-6.0). For example, to obtain the current iteration for a team:

```http
 GET https://dev.azure.com/fabrikam/Fabrikam-Fiber/_apis/work/teamsettings/iterations?$timeframe=current
```

Result:

```json
{
  "values": [
    {
      "id": "a589a806-bf11-4d4f-a031-c19813331553",
      "name": "Sprint 2",
      "attributes": {
        "startDate": null,
        "finishDate": null
      },
      "url": "https://dev.azure.com/fabrikam/6d823a47-2d51-4f31-acff-74927f88ee1e/748b18b6-4b3c-425a-bcae-ff9b3e703012/_apis/work/teamsettings/iterations/a589a806-bf11-4d4f-a031-c19813331553"
    }
  ]
}
```

### Team Capacity and Days Off

Team capacity is linked to an iteration and is available in [Capacities](https://docs.microsoft.com/en-us/rest/api/azure/devops/work/capacities/list?view=azure-devops-rest-6.0). For example, to obtain the team capacity for an iteration:

```http
GET https://dev.azure.com/{organization}/{project}/_apis/work/teamsettings/iterations/{iterationId}/capacities
```

Partial result:

```json
{
  "count": 1,
  "value": [
    {
      "teamMember": {
        "displayName": "Chuck Reinhart",
        "uniqueName": "fabrikamfiber3@hotmail.com",
        (...)
      },
      "activities": [
        {
          "capacityPerDay": 4,
          "name": "Design"
        },
        {
          "capacityPerDay": 4,
          "name": "Development"
        }
      ],
      "daysOff": [
        {
          "start": "2021-04-02T00:00:00Z",
          "end": "2021-04-05T00:00:00Z"
        }
      ],
      "url": "https://codedev.ms/fabrikam/d9bb59ee-cd01-4569-80d1-dce8c2e712f4/1d8e5f76-54bd-4d11-889b-fee63c864ea6/_apis/work/teamsettings/iterations/def498ab-a9cf-41eb-a7c7-9eb67d1852ef/capacities/73a2309e-d0b3-6bf5-9500-9af8bcc805ec"
    }
  ]
}
```

If only the team days off are required, then the [Teamdaysoff API](https://docs.microsoft.com/en-us/rest/api/azure/devops/work/teamdaysoff/get?view=azure-devops-rest-6.0) can be used. For example:

```http
GET https://dev.azure.com/fabrikam/Fabrikam-Fiber/_apis/work/teamsettings/iterations/2ec76bfe-ba74-4060-970d-4567a3e997ee/teamdaysoff
```

Partial result:

```json
{
  "daysOff": [
    {
      "start": "2021-04-02T00:00:00Z",
      "end": "2021-04-05T00:00:00Z"
    }
  ],
  (...)
}
```

## Data Aggregation for Kanban Metrics

In order to build Kanban metrics, we need data for closed items. First we get work item IDs to help us filter the data, using the [WIQL API](https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/wiql/query-by-wiql?view=azure-devops-rest-6.0):

```text
POST https://dev.azure.com/{organization}/{project}/{team}/_apis/wit/wiql?api-version=6.0

{
  "query": "Select Id from WorkItems where [Work Item Type] in ('Bug', 'User Story') and State = 'Closed' and [Area Path] under '<Area Path>' order by [Closed Date]"
}
```

Then we need to get dates for each column change. The [Work Item Reporting Revisions API](https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/reporting-work-item-revisions?view=azure-devops-rest-6.0) will return every change to all work items in the project. Having already gotten the work item IDs from a WIQL query makes it easier: we only keep revisions for the selected IDs.

```text
POST POST https://dev.azure.com/{organization}/{project}/_apis/wit/reporting/workitemrevisions?api-version=6.0

{
  "includeDeleted": false,
  "types": ['Bug', 'User Story']
}
```

We use the `nextLink` property in the returned data to get the next batch, until the `isLastBatch` property is `true`.

