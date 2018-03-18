/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { lazyload } from 'react-lazyload'
import moment from 'moment'

import github from '../../lib/github'

import './style/default.css'
import Gitment from './src/gitment'

@lazyload({
  height: 200,
  offset: 100,
  once: true,
})
class Comments extends Component {
  comments = null

  render() {
    return <div ref={comments => (this.comments = comments)} id="comments" />
  }

  componentDidMount() {
    const { number, type, owner, repo, gistId } = this.props
    const gitment = new Gitment({
      owner: owner,
      repo: repo,
      id: number,
      type: type,
      gistId: gistId,
      oauth: {
        client_id: 'cc6547f49811309e3471',
        client_secret: 'ed237189ab173a7ffd9d6448536c82ee69bb1293',
      },
    })

    gitment.render('comments')
  }
}
export default Comments
