export default function mapToPerson (identity) {
  return {
    name: identity.displayName,
    email: identity.uniqueName
  }
}
