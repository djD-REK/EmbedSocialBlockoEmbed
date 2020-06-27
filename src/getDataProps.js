/*import { fetchPonyfill } from "fetch-ponyfill"
const { Response } = fetchPonyfill({ Promise: Promise })*/
// The npm package fetch-ponyfill must be installed using
// npm install --save fetch-ponyfill
// in order to get access to the Response object for the JSONP code below.
import { Response } from "node-fetch"

export const getDataProps = (utils, props) => {
  // Helper function to use JSONP (JSON with Padding) to bypass cross-origin
  // request sharing restrictions (CORS restrictions) when querying APIs:
  const fetchJSONP = ((unique) => (url) =>
    new Promise((rs) => {
      const script = document.createElement("script")
      const name = `_jsonp_${unique++}`

      if (url.match(/\?/)) {
        url += `&callback=${name}`
      } else {
        url += `?callback=${name}`
      }

      script.src = url
      window[name] = (json) => {
        rs(new Response(JSON.stringify(json)))
        script.remove()
        delete window[name]
      }

      document.body.appendChild(script)
    }))(0)
  // Source: https://gist.github.com/gf3/132080/110d1b68d7328d7bfe7e36617f7df85679a08968#gistcomment-2090652

  // Use JSONP for Twitter, because Twitter's API does not allow CORS requests:
  const twitterPromise = fetchJSONP(
    `https://publish.twitter.com/oembed?url=${props.embedTweetURL}`
  )
    .then((res) => res.json())
    .catch((e) => console.log(`Problem with fetching Twitter result: ${e}`))

  /*
  // Use JSON for Instagram; there are no CORS problems with Instagram's API:
  const twitterPromise = utils.client
    .request(
      // Using the request helper function from the Element SDK (available as
      // utils.client.request) fixes "ReferenceError: fetch is not defined",
      // which would occur if you are trying to use fetch on the server side.
      // The Fetch API (window.fetch) is not defined on the server, since there
      // is no window object outside of the browser. Request acts like fetch.
      `https://cors-anywhere.herokuapp.com/` +
        `https://publish.twitter.com/oembed?url=${props.embedTweetURL}`
    )
    .then((res) => res.jsonp())
    .catch((e) => console.log(`Error when fetching Instagram Post: ${e}`))
*/

  // Use JSON for Instagram; there are no CORS problems with Instagram's API:
  const instagramPromise = utils.client
    .request(
      // Using the request helper function from the Element SDK (available as
      // utils.client.request) fixes "ReferenceError: fetch is not defined",
      // which would occur if you are trying to use fetch on the server side.
      // The Fetch API (window.fetch) is not defined on the server, since there
      // is no window object outside of the browser. Request acts like fetch.
      `https://api.instagram.com/oembed?url=${props.embedInstagramURL}`
    )
    .then((res) => res.json())
    .catch((e) => console.log(`Error when fetching Instagram Post: ${e}`))

  return Promise.all([twitterPromise, instagramPromise]).then((values) => [
    values[0] ? values[0].html : null,
    values[1] ? values[1].html : null,
  ])
}
