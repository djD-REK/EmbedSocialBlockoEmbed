export const getDataProps = (utils, props) => {
  // Helper function to use JSONP (JSON with Padding) to bypass cross-origin
  // request sharing restrictions (CORS restrictions) when querying APIs
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

  return fetchJSONP(
    `https://publish.twitter.com/oembed?url=${props.embedTweetURL}`
  )
    .then((res) => res.json())
    .catch((e) => console.log(`Problem with fetching Twitter result`))

  /* 

    
  // Destructure the URLs for the Tweet and Instagram Post from the props
  const { embedTweetURL, embedInstagramURL } = props
  const embedTweetHTML = fetchJSONP(
    `https://publish.twitter.com/oembed?url=${embedTweetURL}`
  )
    .then((res) => res.json().html)
    .catch((e) => console.log(`Error when fetching Tweet: ${e}`))
  const embedInstagramHTML = fetchJSONP(
    `https://api.instagram.com/oembed?url=${embedInstagramURL}`
  )
    .then((res) => res.json().html)
    .catch((e) => console.log(`Error when fetching Instagram Post: ${e}`))

  // Return a new object containing the embed HTML code for the Tweet and Post
  return Promise.resolve({ embedTweetHTML, embedInstagramHTML })

  */
}
