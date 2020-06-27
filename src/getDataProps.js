export const getDataProps = (utils, props) => {
  // Use JSON for Twitter; you won't be able to view the Tweet in the local
  // development environment without a CORS browser plugin, like Moesif CORS.
  const twitterPromise = utils.client
    .request(`https://publish.twitter.com/oembed?url=${props.embedTweetURL}`)
    .then((res) => res.json())
    .catch((e) => console.log(`Error when fetching Tweet: ${e}`))

  // Use JSON for Instagram; there are no CORS problems with Instagram's API:
  const instagramPromise = utils.client
    .request(`https://api.instagram.com/oembed?url=${props.embedInstagramURL}`)
    .then((res) => res.json())
    .catch((e) => console.log(`Error when fetching Instagram Post: ${e}`))

  // Using the request helper function from the Element SDK (available as
  // utils.client.request) fixes "ReferenceError: fetch is not defined",
  // which would occur if you are trying to use fetch on the server side.
  // The Fetch API (window.fetch) is not defined on the server, since there
  // is no window object outside of the browser. Request acts like fetch.

  // Because Tweets and Instagram posts include <script> tags for their embed
  // scripts, which you will load separately, you need to remove them.
  const jsonEscape = (string) => string.replace(/<script.*<\/script>/, "")
  // Specifically, leaving the </script> tag will cause "SyntaxError:
  // unterminated string literal" error in some browsers, including Firefox.

  // If returning multiple Promises, it can be helpful to use Promise.all with
  // an array of Promises, such as when fetching multiple social media posts.
  return Promise.all([twitterPromise, instagramPromise]).then((values) => [
    values[0] ? jsonEscape(values[0].html) : null,
    values[1] ? jsonEscape(values[1].html) : null,
  ])
  // If a Promise doesn't exist, null is returned instead of a TypeError.
}
