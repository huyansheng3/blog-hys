/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react'
import { Spin, Tabs, Tag, Icon, Tooltip } from 'antd'
import { withRouter } from 'react-router-dom'
import Octicon from 'react-octicon'
import moment from 'moment'
import DocumentTitle from '../../component/document-title'
import github from '../../lib/github'
import RepoReadme from '../../component/repo-readme'
import RepoEvents from '../../component/repo-events'
import GithubLangIngredient from '../../component/github-lang-ingredient'
import EditThisPage from 'src/shared/edit-this-page'
import CONFIG from '../../config.json'
import './index.css'

const TabPane = Tabs.TabPane

class Repo extends Component {
  state = {
    repo: {},
    readme: '',
    events: [],
    repoLoading: false,
  }

  componentWillMount() {
    this.getData(this.props)
  }

  async componentWillReceiveProps(nextProp) {
    const { repo } = nextProp.match.params
    if (repo && repo !== this.props.match.params.repo) {
      await this.getData(nextProp)
    }
  }

  async getData(props) {
    if (this.state.loading) return
    const { repo } = props.match.params
    const data = await this.getRepo(CONFIG.owner, repo)
    await this.getLang(data.owner.login, data.name)
  }

  async getRepo(owner, repo) {
    this.setState({ repoLoading: true })
    const { data = {} } = await github.get(`/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json;charset=utf-8',
      },
    })
    this.setState({ repo: data, repoLoading: false })
    return data
  }

  async getLang(owner, repo) {
    try {
      const { data } = await github.get(`/repos/${owner}/${repo}/languages`)
      this.setState({ languages: data })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const metas = [
      {
        icon: 'eye',
        field: 'subscribers_count',
      },
      {
        icon: 'star',
        field: 'watchers_count',
      },
      {
        icon: 'repo-forked',
        field: 'forks_count',
      },
      {
        icon: 'issue-opened',
        field: 'open_issues_count',
      },
    ]

    return (
      <DocumentTitle title={[this.state.repo.name, '开源项目']}>
        <div className="toolbar-container">
          <EditThisPage sourcePage="pages/repo/index.js" />
          <Spin spinning={this.state.repoLoading} delay={0} tip="Loading...">
            <div>
              <h1>
                <a target="_blank" href={this.state.repo.html_url}>
                  {this.state.repo.name}
                </a>
                &nbsp;
                {metas.map(meta => {
                  return (
                    <span
                      key={meta.field}
                      className="mr5"
                      style={{
                        fontSize: '1.4rem',
                      }}>
                      <Octicon
                        className="mr5"
                        name={meta.icon}
                        mega
                        style={{
                          fontSize: '1.4rem',
                        }}
                      />
                      {meta.icon === 'home' ? (
                        <a href={this.state.repo.homepage} target="_blank">
                          {this.state.repo.homepage}
                        </a>
                      ) : (
                        this.state.repo[meta.field]
                      )}
                    </span>
                  )
                })}
              </h1>

              <GithubLangIngredient languages={this.state.languages} />

              <div className="github-meta">
                <span>{this.state.repo.description}</span>
                &nbsp; &nbsp;
                {this.state.repo.homepage && (
                  <a href={this.state.repo.homepage} target="_blank">
                    {this.state.repo.homepage}
                  </a>
                )}
              </div>

              <div className="github-meta">
                <div>
                  {(this.state.repo.topics || []).map(topic => {
                    return (
                      <Tag style={{ marginTop: '0.5rem' }} key={topic}>
                        {topic}
                      </Tag>
                    )
                  })}
                </div>
              </div>

              <div className="github-meta">
                Create at{' '}
                {this.state.repo.created_at &&
                  moment(this.state.repo.created_at).fromNow()}
              </div>
              <div className="github-meta">
                Update at{' '}
                {this.state.repo.updated_at &&
                  moment(this.state.repo.updated_at).fromNow()}
              </div>
            </div>
          </Spin>
          <div>
            <Tabs defaultActiveKey="readme">
              <TabPane tab="项目介绍" key="readme">
                <RepoReadme
                  owner={CONFIG.owner}
                  repo={this.state.repo}
                  {...this.props.match.params}
                />
              </TabPane>
              <TabPane tab="最近活动" key="events">
                <RepoEvents
                  owner={CONFIG.owner}
                  repo={this.state.repo}
                  {...this.props.match.params}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
export default withRouter(Repo)
