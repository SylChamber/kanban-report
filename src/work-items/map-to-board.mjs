export default function mapToBoard (item) {
  const columnKey = 'System.BoardColumn'
  const column = {
    column: item.fields[columnKey]
  }
  let columnDone

  if (item.fields[`${columnKey}Done`]) {
    columnDone = {
      columnDone: item.fields[`${columnKey}Done`]
    }
  }

  return Object.assign({}, column, columnDone)
}
