const fetch = require('node-fetch')
const org = 'cspq'
const proj = 'SQIN'
const urlApis = `https://dev.azure.com/${org}/${proj}/_apis`
let headers = {
  Accept: 'application/json; api-version=6.0',
  'Content-Type': 'application/json',
  Authorization: 'Basic Omd0aG9qN3IyNXR2eWdiZ3RqNjUzbW1wN3U2M3FsbHR0cGZxd2xodXNhanY2aWd3NTdlZHE='
}

// obtenir les cartes fermées
const urlClosed = `${urlApis}/wit/wiql`
let query = String.raw`Select Id from WorkItems where [Work Item Type] in ('Bug', 'User Story') and State = 'Closed' and [Area Path] under 'SQIN\Projet 1\Gestion du produit\Équipe Système' order by [Closed Date]`
let reqClosed = { query }
let responseClosed = await fetch(urlClosed, {
  method: 'POST',
  body: JSON.stringify(reqClosed),
  headers
})
let resultClosed = await responseClosed.json()
let ids = resultClosed.workItems.map(item => item.id)

// obtenir les révisions
// const urlRevisions = `${urlApis}/wit/reporting/workitemrevisions`
// let reqRevisions = {
//   includeDeleted: false,
//   includeLatestOnly: false,
//   types: ['Bug', 'User Story']
// }
// let responseRevisions = await fetch(urlRevisions, {
//   method: 'POST',
//   body: JSON.stringify(reqRevisions),
//   headers
// })
// let resultRevisions = await responseRevisions.json()

let mapToRevision = v => {
  return {
    id: v.id,
    title: v.fields['System.Title'],
    areaPath: v.fields['System.AreaPath'],
    activatedDate: v.fields['Microsoft.VSTS.Common.ActivatedDate'],
    changedDate: v.fields['System.ChangedDate'],
    closedDate: v.fields['Microsoft.VSTS.Common.ClosedDate'],
    createdDate: v.fields['System.CreatedDate'],
    resolvedDate: v.fields['Microsoft.VSTS.Common.ResolvedDate'],
    column: v.fields['System.BoardColumn'],
    columnDone: v.fields['System.BoardColumnDone'],
    state: v.fields['System.State'],
    stateChangeDate: v.fields['Microsoft.VSTS.Common.StateChangeDate']
  }
}
let filterIds = ids => v => ids.includes(v.id)
let filterRemoved = v => v.fields['System.AreaPath'] !== '$Removed'
let groupById = (acc, revision) => {
  if (acc.has(revision.id)) {
    acc.get(revision.id).push(revision)
  } else {
    acc.set(revision.id, [revision])
  }

  return acc
}
// let mapRevisions = new Map()

// resultRevisions.values.filter(filterIds(ids)).
//   filter(filterRemoved).
//   map(mapToRevision).
//   reduce(groupById, mapRevisions)
let filterWorkDone = r => r.state === 'Active' && r.columnDone
let mapToTransition = r => {
  console.log('mapping', r[0])
  const lastRevIndex = r[1].length - 1
  return {
    id: r[0],
    title: r[1][lastRevIndex].title,
    createdDate: r[1][lastRevIndex].createdDate,
    activatedDate: r[1][lastRevIndex].activatedDate,
    workDoneDate: r[1].some(filterWorkDone) ? r[1].filter(filterWorkDone)[0].changedDate : undefined,
    resolvedDate: r[1][lastRevIndex].resolvedDate,
    closedDate: r[1][lastRevIndex].closedDate
  }
}
let sortByClosedDate = (a, b) => a.closedDate < b.closedDate ?
  -1 :
  a.closedDate > b.closedDate ?
    1 :
    0

// let batchesRemain = true
// let counter = 1
// let continuationToken
// let mapRevisions = new Map()
// do {
//   console.log('Récupération du lot', counter)
//   let urlLot = `${urlRevisions}${continuationToken ? '?continuationToken=' + continuationToken : ''}`
//   let responseRevisions = await fetch(urlLot, {
//     method: 'POST',
//     body: JSON.stringify(reqRevisions),
//     headers
//   })
//   /**
//    * @type {RevisionsResponse}
//    */
//   let resultRevisions = await responseRevisions.json()
//   batchesRemain = !resultRevisions.isLastBatch
//   continuationToken = resultRevisions.continuationToken
//   if (resultRevisions.isLastBatch) {
//     console.log("C'était le dernier lot!")
//   }
//   counter++
//   resultRevisions.values.
//     filter(filterIds(ids)).
//     filter(filterRemoved).
//     map(mapToRevision).
//     reduce(groupById, mapRevisions)
// } while (batchesRemain)

let getRevisions = async function getRevisions(continuationToken) {
  let batchesRemain = true
  let counter = 1
  let mapRevisions = new Map()

  do {
    console.log('Récupération du lot', counter)
    let urlLot = `${urlRevisions}${continuationToken ? '?continuationToken=' + continuationToken : ''}`
    let responseRevisions = await fetch(urlLot, {
      method: 'POST',
      body: JSON.stringify(reqRevisions),
      headers
    })
    /**
     * @type {RevisionsResponse}
     */
    let resultRevisions = await responseRevisions.json()
    batchesRemain = !resultRevisions.isLastBatch
    continuationToken = resultRevisions.continuationToken
    if (resultRevisions.isLastBatch) {
      console.log("C'était le dernier lot!")
    }
    counter++
    resultRevisions.values.
      filter(filterIds(ids)).
      filter(filterRemoved).
      map(mapToRevision).
      reduce(groupById, mapRevisions)
  } while (batchesRemain)

  return {
    revisions: mapRevisions,
    continuationToken
  }
}

let getTransitions = async function getTransitions(continuationToken) {
  const revisions = await getRevisions(continuationToken)
  return {
    transitions: Array.from(revisions.revisions.entries()).
      map(mapToTransition).
      sort(sortByClosedDate),
    continuationToken: revisions.continuationToken
  }
}

let mapToDates = t => {
  return {
  id: t.id,
  title: t.title,
  createdDate: new Date(t.createdDate),
  activatedDate: new Date(t.activatedDate),
  workDoneDate: t.workDoneDate ? new Date(t.workDoneDate) : undefined,
  resolvedDate: t.resolvedDate ? new Date(t.resolvedDate) : undefined,
  closedDate: new Date(t.closedDate)
  }
}

let mapToCycleTimes = t => {
  const toDay = ms => Math.floor(ms / 1000 / 60 / 60 / 24) + 1
  return Object.assign({}, t, {
    working: t.workDoneDate ?
      toDay(t.workDoneDate - t.activatedDate) :
      t.resolvedDate ?
        toDay(t.resolvedDate - t.activatedDate) :
        toDay(t.closedDate - t.activatedDate),
    workDone: t.resolvedDate && t.workDoneDate ?
      toDay(t.resolvedDate - t.workDoneDate) :
      1,
    approval: t.resolvedDate ?
      toDay(t.closedDate - t.resolvedDate) :
      1,
    cycleTime: toDay(t.closedDate - t.activatedDate)
  })
}

let sortByCycleTime = (a, b) => a.cycleTime < b.cycleTime ?
  -1 :
  a.cycleTime > b.cycleTime ?
    1 :
    0

/**
 * @typedef {object} Revision
 * @property {number} id
 * @property {number} rev
 * @property {object} fields
 */

/**
 * @typedef {object} RevisionsResponse
 * @property {string} nextLink
 * @property {bool} isLastBatch
 * @property {string} continuationToken
 * @property {Revision[]} values
 */
