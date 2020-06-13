import React, { useEffect } from "react"
import { css, StyleSheet } from "aphrodite/no-important"
import { getStyles } from "./getStyles"
import { defaultConfig } from "./configs"

const Block = (props) => {
  // Get the custom Aphrodite styles to be used in this Block:
  const classes = StyleSheet.create(getStyles(props))
  // Load the helper function that will join Atomic CSS classes with Aphrodite:
  const joinClasses = props.joinClasses
  // Destructure the HTML embed code from the data props:
  const [embedTweetHTML, embedInstagramHTML] = props.data

  // React's Effect Hook (useEffect) will run code when the Block is rendered:
  useEffect(() => {
    // Add a link to the external Twitter script file:
    const twitterScript = document.createElement("script")
    twitterScript.setAttribute("src", "https://platform.twitter.com/widgets.js")
    twitterScript.setAttribute("async", true)
    const tweetElement = document.getElementsByClassName("twitter-tweet")[0]
    // Only add the Twitter script if there is a Tweet to embed:
    tweetElement ? tweetElement.appendChild(twitterScript) : null

    // Add a link to the external Instagram script file:
    const instagramScript = document.createElement("script")
    instagramScript.setAttribute("src", "https://www.instagram.com/embed.js")
    instagramScript.setAttribute("async", true)
    const instaElement = document.getElementsByClassName("instagram-media")[0]
    // Only add the Instagram  script if there is an Instagram Post to embed:
    instaElement ? instaElement.appendChild(instagramScript) : null
  }, [])
  // Passing [] as useEffect's second parameter will run the code just once.

  // Combine the Tweet and the Instagram Post into a single HTML string:
  const embedHTML = embedTweetHTML + embedInstagramHTML
  // For HTML markup, React requires an object with the __html property:
  const outputAsMarkup = { __html: embedHTML }

  // Make a <div> element based on the banner text using the custom styles:
  const outputDiv = (
    <div
      // Combine Atomic CSS classes with custom styles using joinClasses:
      className={joinClasses(
        "ma0 pa3 flex justify-around",
        css(classes.banner)
      )}
      // The class ma0 sets all margins to 0, and pa3 sets padding to 1rem.
      // flex & justify-around enable CSS flexbox with space around the items.

      // dangerouslySetInnerHTML will render HTML markup, except <script> tags:
      dangerouslySetInnerHTML={outputAsMarkup}
    ></div>
  )

  // Google AMP pages can't load external JavaScript, so the social media embed
  // won't be able to load on the AMP version of the Block. For the AMP page,
  // props.utils.isAmpRequest is true, so return null to render an empty Block:
  return props.utils.isAmpRequest ? null : outputDiv
}

Block.defaultProps = defaultConfig

export default Block
