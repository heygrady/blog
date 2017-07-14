import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import get from 'lodash/get'

import Bio from '../components/Bio'
import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends Component {
  render () {
    const post = this.props.data.markdownRemark
    const title = get(post, 'frontmatter.title')
    const date = get(post, 'frontmatter.date')
    const description = get(post, 'frontmatter.description')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <div>
        <Helmet>
          <title>{`${title} | ${siteTitle}`}</title>
        </Helmet>
        <h1>
          {title}
        </h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {date}
        </p>
        <p
          style={{
            ...scale(1 / 3),
            fontStyle: 'italic',
            marginBottom: rhythm(1),
          }}>{description}</p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />
      </div>
    )
  }
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object
}

export default BlogPostTemplate

/* global graphql:false */
export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        description
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
