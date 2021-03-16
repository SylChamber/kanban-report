export default function mapToPerson (identity) {
  if (!identity) {
    return
  }

  return {
    name: identity.displayName,
    email: identity.uniqueName
  }
}
