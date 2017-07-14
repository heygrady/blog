import React from 'react'
import PropTypes from 'prop-types'
import PageLink from './PageLink'
import get from 'lodash/get'

const sortPosts = (a, b) => {
  const datePath = 'node.frontmatter.date'
  const stringA = get(a, datePath)
  const stringB = get(b, datePath)
  if (stringA < stringB) {
    return -1
  }
  if (stringB < stringA) {
    return 1
  }

  return 0
}

const PageLinkContainer = ({ post }) => {
  const newProps = {
    title: get(post, 'node.frontmatter.title', post.node.path),
    description: get(post, 'node.frontmatter.description'),
    date: get(post, 'node.frontmatter.date'),
    path: get(post, 'node.frontmatter.path'),
  }
  return (
    <PageLink {...newProps} />
  )
}
PageLinkContainer.propTypes = {
  post: PropTypes.object
}

const PageLinks = ({ posts }) => {
  return (
    <ul
      style={{
        listStyleType: 'none'
      }}
    >
      {posts && posts.sort(sortPosts).reverse().map((post, key) => {
        if (post.node.path !== '/404/') {
          return (<PageLinkContainer post={post} key={key} />)
        }
      })}
    </ul>
  )
}
PageLinks.propTypes = {
  posts: PropTypes.array
}
export default PageLinks
