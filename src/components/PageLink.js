import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { rhythm } from '../utils/typography'
import moment from 'moment'

import './Pagelink.css'

const format = (date, format = 'MMM Do YYYY') => moment(date).format(format)

const PageLink = ({ title, description, date, path }) => {
  return (
    <li
      className='PageLink'
      style={{
        marginBottom: rhythm(1 + (1 / 2)),
      }}
    >
      <p className='PageLink__date'>{format(date)}</p>
      <h3
        className='PageLink__headline'
        style={{
          marginBottom: rhythm(1 / 6),
        }}>
        <Link className='PageLink__link' style={{ boxShadow: 'none' }} to={path}>
          <span className='PageLink__title'>{title}</span>
        </Link>
      </h3>
      {description && (
        <p className='PageLink__description'>{description}</p>
      )}
    </li>
  )
}
PageLink.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.date,
  path: PropTypes.string
}

export default PageLink
