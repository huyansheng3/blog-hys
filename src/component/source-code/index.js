/**
 * Created by axetroy on 17-5-24.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Spin } from 'antd'
import axios from 'axios'
import ContentLoader from 'react-content-loader'

import CONFIG from '../../config.json'
import github from '../../lib/github'

const { owner, repo } = CONFIG
class SourceCode extends Component {
  state = {
    source: null,
    invalidFile: false,
  }
  componentDidMount() {
    const { file } = this.props
    this.getPageSourceCode(file)
  }

  async getPageSourceCode(file) {
    const owner: string = CONFIG.owner
    const repo: string = CONFIG.repo
    try {
      const { data } = await github.get(
        `/repos/${owner}/${repo}/contents/src/${file}`
      )
      const downloadRes = await axios.get(data.download_url, {
        responseType: 'text',
      })

      let raw = downloadRes.data

      this.setState({ source: data })

      const res = await github.post(
        '/markdown',
        {
          text: `
\`\`\`javascript
${raw}
\`\`\`
`,
          mode: 'markdown',
        },
        { responseType: 'text' }
      )

      this.setState({ html: res.data })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    return (
      <div>
        {this.state.html ? (
          <div style={{ minHeight: '200px' }}>
            <h2>
              <a
                href={
                  `https://github.com/${owner}/${repo}/blob/master/` +
                  this.state.source.path
                }
                target="_blank">
                {this.state.source.path}
              </a>
            </h2>
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{
                __html: this.state.html,
              }}
            />
            <pre>{this.state.source.raw}</pre>
          </div>
        ) : (
          <ContentLoader type="List" />
        )}
      </div>
    )
  }
}
export default connect(
  function mapStateToProps(state) {
    return {}
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch)
  }
)(SourceCode)
