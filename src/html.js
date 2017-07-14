import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TypographyStyle } from 'react-typography'
import Helmet from 'react-helmet'

import typography from './utils/typography'

let stylesStr
if (process.env.NODE_ENV === `production`) {
  try {
    stylesStr = require(`!raw-loader!../public/styles.css`)
  } catch (e) {
    console.log(e)
  }
}

export default class HTML extends Component {
  static propTypes = {
    headComponents: PropTypes.node,
    body: PropTypes.string,
    postBodyComponents: PropTypes.node
  }

  render () {
    const head = Helmet.rewind()
    let css
    if (process.env.NODE_ENV === `production`) {
      css = (
        <style
          id='gatsby-inlined-css'
          dangerouslySetInnerHTML={{ __html: stylesStr }}
        />
      )
    }

    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <link rel='icon' type='image/png' href='favicon-32x32.png' sizes='32x32' />
          <link rel='icon' type='image/png' href='favicon-16x16.png' sizes='16x16' />
          {this.props.headComponents}
          <TypographyStyle typography={typography} />
          {css}
        </head>
        <body>
          <div
            id='___gatsby'
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}
