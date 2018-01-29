// @flow
/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Spin, Tooltip, Icon, message } from 'antd'
import ReactClipboard from '@axetroy/react-clipboard'
import Download from '@axetroy/react-download'
import prettyBytes from '../../lib/pretty-bytes'
import DocumentTitle from '../../component/document-title'
import Comments from '../../component/comments'
import github from '../../lib/github'
import * as gistAction from '../../redux/gist'
import EditThisPage from '../../shared/edit-this-page'

function values(obj) {
  let result = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]])
    }
  }
  return result
}

class Gist extends Component {
  componentWillMount() {
    this.init(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProp) {
    const { id } = nextProp.match.params
    if (id && id !== this.props.match.params.id) {
      this.init(id)
    }
  }

  async init(id) {
    if (id) {
      await [this.getGist(id)]
    }
  }

  async getGist(id) {
    let gist = {}
    try {
      const { data } = await github.get(`/gists/${id}`, {
        headers: {
          Accept: 'application/vnd.github.v3.html',
        },
        responseType: 'text',
      })
      gist = data

      for (let filename in gist.files) {
        if (gist.files.hasOwnProperty(filename)) {
          const file = gist.files[filename]
          const res = await github.post(
            '/markdown',
            {
              text: '```' + file.language + '\n' + file.content + '\n```',
              mode: 'markdown',
            },
            { responseType: 'text' }
          )
          file.html = res.data
        }
      }

      this.props.setGist({ [id]: gist })
    } catch (err) {
      console.error(err)
    }
    return gist
  }

  render() {
    const { id } = this.props.match.params
    const gist = (this.props.GIST || {})[id] || {}
    return (
      <DocumentTitle title={[gist.description, 'Gist']}>
        <Spin spinning={!Object.keys(gist).length}>
          <div className="toolbar-container">
            <EditThisPage sourcePage="pages/gist/index.js" />
            <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>
              {gist.description}
              <Tooltip placement="topLeft" title="编辑此页">
                <a
                  href={`https://gist.github.com/${
                    gist.owner ? gist.owner.login : ''
                  }/${gist.id}/edit`}
                  target="_blank">
                  <Icon type="edit" />
                </a>
              </Tooltip>
            </h2>
            {(values(gist.files) || []).map(file => {
              return (
                <div
                  key={file.filename}
                  style={{ border: '0.1rem solid #ececec', margin: '2rem 0' }}>
                  <h3 style={{ backgroundColor: '#eaeaea', padding: '0.5rem' }}>
                    <span>
                      <Icon type="file" />
                      {file.filename}
                    </span>
                    <span
                      style={{
                        margin: '0 0.5rem',
                      }}>
                      <Download
                        file={file.filename}
                        content={file.content}
                        style={{ display: 'inline' }}>
                        <a href="javascript:">
                          <Icon type="download" />
                          {prettyBytes(file.size || 0)}
                        </a>
                      </Download>
                    </span>
                    <span>
                      <ReactClipboard
                        style={{ cursor: 'pointer' }}
                        value={file.content}
                        onSuccess={() => message.success('Copy Success!')}
                        onError={() => message.error('Copy Fail!')}>
                        <Icon type="copy" />Copy
                      </ReactClipboard>
                    </span>
                  </h3>
                  <div
                    className="markdown-body"
                    style={{
                      fontSize: '1.6rem',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: file.html,
                    }}
                  />
                </div>
              )
            })}

            <hr className="hr" />

            <Comments type="gist" gistId={this.props.match.params.id} />
          </div>
        </Spin>
      </DocumentTitle>
    )
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      GIST: state.GIST,
    }
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setGist: gistAction.set,
      },
      dispatch
    )
  }
)(withRouter(Gist))
