import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import get from 'lodash/get'

import Bio from '../components/Bio'
import { rhythm, scale } from '../utils/typography'
import './blog-post.css'

class BlogPostTemplate extends Component {
  render () {
    const post = this.props.data.markdownRemark

    const title = get(post, 'frontmatter.title')
    const date = get(post, 'frontmatter.date')
    const description = get(post, 'frontmatter.description')
    const path = get(post, 'frontmatter.path')

    const facebookAppId = get(this.props, 'data.site.siteMetadata.facebookAppId')
    const canonicalUrl = get(this.props, 'data.site.siteMetadata.canonicalUrl')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const publisherHandle = get(this.props, 'data.site.siteMetadata.publisherHandle')
    const twitterHandle = get(this.props, 'data.site.siteMetadata.twitterHandle')
    const url = `${canonicalUrl}${path}`
    const image = ''

    return (
      <div>
        <Helmet>
          <html
            itemScope
            itemType='http://schema.org/Article'
            prefix='og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#' />
          <title>{`${title} | ${siteTitle}`}</title>
          <meta name='description' content={description} />
          {url && <link rel='canonical' href={url} /> }
          <meta itemProp='name' content={title} />
          <meta itemProp='description' content={description} />
          {image && <meta itemProp='image' content={image} />}
          <meta name='twitter:card' value='summary' />
          {publisherHandle && <meta name='twitter:site' content={`@${publisherHandle}`} />}
          <meta name='twitter:title' content={title} />
          <meta name='twitter:description' content={description} />
          {twitterHandle && <meta name='twitter:creator' content={`@${twitterHandle}`} />}
          {image && <meta name='twitter:image' content={image} /> }
          {url && <meta property='og:url' content={url} />}
          <meta property='og:type' content='article' />
          <meta property='og:title' content={title} />
          <meta property='og:description' content={description} />
          {image && <meta property='og:image' content={image} />}
          {facebookAppId && <meta property='fb:app_id' content={facebookAppId} />}
        </Helmet>
        <h1 className='BlogPost__headline'>
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
        <h2
          style={{
            fontSize: '1.2rem',
            lineHeight: '1.4em',
            fontWeight: 'normal',
            fontStyle: 'italic',
            marginBottom: rhythm(1.5),
            marginTop: rhythm(1.5),
          }}>{description}</h2>
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
        facebookAppId
        canonicalUrl
        title
        author
        twitterHandle
        publisherHandle
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        description
        date(formatString: "MMMM DD, YYYY")
        path
      }
    }
  }
`
