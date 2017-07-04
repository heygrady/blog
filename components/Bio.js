import React from 'react'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import profilePic from './profile-pic.jpg'

class Bio extends React.Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`author ${config.authorName}`}
          style={{
            float: 'left',
            marginRight: rhythm(1 / 4),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%'
          }}
        />
        Written by <strong>{config.authorName}</strong>.
        <a href={`https://twitter.com/${config.twitterHandle}`}>@{config.twitterHandle}</a>
      </p>
    )
  }
}

export default Bio
