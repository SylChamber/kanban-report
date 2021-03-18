export default async function getWebClient ({ organization, personalAccessToken }) {
  if (organization === undefined || organization === '') {
    throw new Error('The organization property of the parameter is required.')
  }

  if (personalAccessToken === undefined || personalAccessToken === '') {
    throw new Error('The personalAccessToken property of the parameter is required.')
  }
}
