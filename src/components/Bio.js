import React, { Component } from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'
import config from '../config'

class Bio extends Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={config.author}
          style={{
            float: 'left',
            marginRight: rhythm(1 / 4),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%'
          }}
        />
        Written by <strong>{config.author}</strong>.
        {' '}
        <a href={`https://twitter.com/${config.twitterHandle}`}>@{config.twitterHandle}</a>
        {' | '}
        <a href={`https://github.com/${config.twitterHandle}`}>Github</a>
      </p>
    )
  }
}

export default Bio
