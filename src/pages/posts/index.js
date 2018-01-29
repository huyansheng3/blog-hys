/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Spin, Pagination, Row, Col, Card, Tag, Icon, Tooltip } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import EditThisPage from 'src/shared/edit-this-page'
import DocumentTitle from '../../component/document-title'
import ViewSourceCode from '../../component/view-source-code'
import github from '../../lib/github'
import { firstUpperCase } from '../../lib/utils'

import * as postAction from '../../redux/posts'

import CONFIG from '../../config.json'

import './index.css'

class Posts extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 10,
      total: 0,
    },
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search)
    let { page, per_page } = query
    page = +page || this.state.meta.page
    per_page = +per_page || this.state.meta.per_page
    this.setState({
      meta: {
        ...this.state.meta,
        page: +page,
        per_page: +per_page,
      },
    })
    this.getPosts(page, per_page)
  }

  async getPosts(page, per_page) {
    let posts = this.props.POSTS || []
    try {
      const res = await github.get(
        `/repos/${CONFIG.owner}/${CONFIG.repo}/issues`,
        {
          params: { creator: CONFIG.owner, page, per_page, state: 'open' },
        }
      )

      const link = res.headers.link

      /**
       * Pagination
       * # see detail https://developer.github.com/guides/traversing-with-pagination/
       */
      if (link) {
        const last = link.match(/<([^>]+)>(?=\;\s+rel="last")/)
        const lastPage = last ? last[1].match(/page=(\d+)/)[1] : page
        this.setState({
          meta: {
            ...this.state.meta,
            ...{ page, per_page, total: lastPage * per_page },
          },
        })
      }

      posts = res.data
    } catch (err) {
      console.error(err)
    }

    posts.forEach(post => {
      // 获取第一张图片作为缩略图
      let match = /!\[[^\]]+\]\(([^\)]+)\)/im.exec(post.body)
      if (match && match[1]) {
        post.thumbnails = match[1]
      }
    })

    this.props.setPosts(posts)

    return posts
  }

  changePage(page, per_page) {
    const oldQuery = queryString.parse(this.props.location.search)
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(
        Object.assign(oldQuery, { page, per_page })
      ),
    })
    this.getPosts(page, per_page)
  }

  render() {
    return (
      <DocumentTitle title={['博客文章']}>
        <Spin spinning={false}>
          <div className={'toolbar-container'}>
            <EditThisPage sourcePage="pages/posts/index.js" />
            {this.props.POSTS.map((post, i) => {
              return (
                <Card
                  style={{ margin: '2rem 0' }}
                  className="post-list"
                  key={post.number + '/' + i}>
                  <div>
                    <h3 className="post-title">
                      <Link
                        to={`/post/${post.number}`}
                        style={{
                          wordBreak: 'break-word',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                  <div style={{ margin: '0.5rem 0' }}>
                    <span>
                      {(post.labels || []).map(label => {
                        return (
                          <Tag key={label.id} color={'#' + label.color}>
                            {label.name}
                          </Tag>
                        )
                      })}
                    </span>
                  </div>
                  <div style={{ color: '#9E9E9E', wordBreak: 'break-all' }}>
                    {post.body.slice(0, 500)}...
                  </div>
                  <div
                    style={{
                      marginTop: '2rem',
                      paddingTop: '2rem',
                      borderTop: '1px solid #e6e6e6',
                    }}>
                    {post.user.avatar_url && (
                      <LazyLoad height={44}>
                        <img
                          src={post.user.avatar_url}
                          alt=""
                          style={{
                            width: '4.4rem',
                            height: '4.4rem',
                            borderRadius: '50%',
                            marginRight: '0.5rem',
                            verticalAlign: 'middle',
                          }}
                        />
                      </LazyLoad>
                    )}
                    <div
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}>
                      <strong>
                        <Icon
                          type="user"
                          style={{
                            marginRight: '0.5rem',
                          }}
                        />
                        {firstUpperCase(post.user.login)}
                      </strong>
                      <br />
                      <span>
                        <Icon
                          type="calendar"
                          style={{ marginRight: '0.5rem' }}
                        />
                        {moment(new Date(post.created_at)).fromNow()}
                      </span>
                      <br />
                      <span>
                        <Icon
                          type="message"
                          style={{ marginRight: '0.5rem' }}
                        />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}

            {Boolean(this.state.meta.total) && (
              <Row className="text-center">
                <Col span={24} style={{ transition: 'all 1s' }}>
                  <Pagination
                    onChange={page =>
                      this.changePage(page, this.state.meta.per_page)
                    }
                    hideOnSinglePage
                    defaultCurrent={this.state.meta.page}
                    defaultPageSize={this.state.meta.per_page}
                    total={this.state.meta.total}
                  />
                </Col>
              </Row>
            )}
          </div>
        </Spin>
      </DocumentTitle>
    )
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      POSTS: state.POSTS,
    }
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setPosts: postAction.set,
      },
      dispatch
    )
  }
)(withRouter(Posts))
