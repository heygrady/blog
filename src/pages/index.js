import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import PageLinks from '../components/PageLinks'

import '../css/pages.css'
import '../css/Pagelink.css'

class BlogIndex extends Component {
  render () {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <div>
        <Helmet>
          <title>{siteTitle}</title>
          <link rel='icon' type='image/png' href='favicon-32x32.png' sizes='32x32' />
          <link rel='icon' type='image/png' href='favicon-16x16.png' sizes='16x16' />
        </Helmet>
        <Bio />
        <PageLinks posts={posts} />
        <p>Looking for <a href='https://2012.heygrady.com'>older posts</a>?</p>
      </div>
    )
  }
}

BlogIndex.propTypes = {
  route: PropTypes.object
}

export default BlogIndex

/* global graphql:false */
export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            path
          }
          frontmatter {
            title
          }
          frontmatter {
            description
          }
          frontmatter {
            date
          }
        }
      }
    }
  }
`
