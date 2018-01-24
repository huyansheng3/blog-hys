/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, Icon, Tooltip } from 'antd'
import GithubUserInfo from '../../component/github-user-info'
import GithubFollowers from '../../component/github-followers'
import GithubFollowing from '../../component/github-following'
import GithubRepositories from '../../component/github-repo'
import GithubOrgs from '../../component/github-orgs'
import GithubLang from '../../component/github-lang'
import EditThisPage from 'src/shared/edit-this-page'
import DocumentTitle from '../../component/document-title'
import './index.css'
import CONFIG from '../../config.json'

class Github extends Component {
  state = {}

  async componentDidMount() {
    const module = await import('@axetroy/react-github-calendar')
    this.setState({ GithubCalendar: module.default })
  }
  render() {
    const GithubCalendar = this.state ? this.state.GithubCalendar : null
    return (
      <DocumentTitle title={['Github']}>
        <div className="toolbar-container">
          <EditThisPage sourcePage="pages/github/index.js" />
          <h2 className="github-title">活跃度</h2>
          <div
            style={{
              overflow: 'auto',
            }}>
            {GithubCalendar && (
              <GithubCalendar
                style={{
                  width: '100%',
                }}
                name={CONFIG.owner}
              />
            )}
          </div>

          <h2 className="github-title">基本信息</h2>

          <Card>
            <GithubUserInfo />
          </Card>

          <h2 className="github-title">仓库信息</h2>
          <Card>
            <GithubRepositories />
          </Card>

          <h2 className="github-title">隶属组织</h2>
          <Card>
            <GithubOrgs />
          </Card>

          <h2 className="github-title">编程语言</h2>
          <Card>
            <GithubLang />
          </Card>

          <h2 className="github-title">追寻的大牛</h2>
          <Card>
            <GithubFollowing />
          </Card>

          <h2 className="github-title">感谢支持我的人</h2>
          <Card>
            <GithubFollowers />
          </Card>
        </div>
      </DocumentTitle>
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
)(Github)
