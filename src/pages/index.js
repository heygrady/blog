import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import { rhythm } from '../utils/typography'
import '../css/pages.css'

const sortPosts = (a, b) => {
  const path = 'node.frontmatter.date'
  return get(a, path) > get(b, path)
}

class BlogIndex extends Component {
  render () {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    const pageLinks = posts.sort(sortPosts).map((post, key) => {
      if (post.node.path !== '/404/') {
        const title = get(post, 'node.frontmatter.title') || post.node.path
        return (
          <li
            key={post.node.path || key}
            style={{
              marginBottom: rhythm(1 / 4),
            }}
          >
            <Link style={{ boxShadow: 'none' }} to={post.node.frontmatter.path}>
              {title}
            </Link>
          </li>
        )
      }
    })

    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        <ul>
          {pageLinks}
        </ul>
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
            date
          }
        }
      }
    }
  }
`
