import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Row, Col, Card, notification } from 'antd'

import Footer from './component/footer'
import Header from './component/header'
import ClickMaterial from './component/click-material'
import DynamicLoad from './component/dynamic-load'

import store from './redux/index'
import Statistics from './lib/statistics'
import RouterListener from './lib/router-listener'

import './App.css'

import CONFIG from './config.json'

const ClickMaterialWithStatRouterListener = RouterListener(ClickMaterial)

const GithubSvg = props => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 250 250"
    style={{
      fill: '#64CEAA',
      color: '#fff',
      position: 'absolute',
      top: '0',
      border: 0,
      right: 0,
    }}>
    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
    <path
      d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
      fill="currentColor"
      style={{ transformOrigin: '130px 106px' }}
      className="octo-arm"
    />
    <path
      d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
      fill="currentColor"
      className="octo-body"
    />
  </svg>
)

const { ga } = window
class App extends Component {
  handleRouterChange = (location, action) => {
    // location is an object like window.location
    ga &&
      ga('set', {
        page: location.pathname,
        title: document.title,
      })
  }

  render() {
    // 适应不同大小屏幕
    const layoutPorps = {
      lg: { span: 16, offset: 4 },
      md: { span: 18, offset: 3 },
      sm: { span: 20, offset: 2 },
      xs: { span: 24 },
    }
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ClickMaterialWithStatRouterListener
            onRouterChange={this.handleRouterChange}>
            <Row>
              <Col {...layoutPorps}>
                <Header />
                <a
                  target="_blank"
                  href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}`}>
                  <GithubSvg />
                </a>
              </Col>
              <Col {...layoutPorps}>
                <Card
                  style={{
                    marginTop: '2rem',
                  }}>
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={() => (
                        <DynamicLoad promise={import('./pages/home')} />
                      )}
                    />
                    <Route
                      path="/github"
                      render={() => (
                        <DynamicLoad promise={import('./pages/github')} />
                      )}
                    />
                    <Route
                      path="/about"
                      render={() => (
                        <DynamicLoad promise={import('./pages/about')} />
                      )}
                    />
                    <Route
                      path="/posts"
                      render={() => (
                        <DynamicLoad promise={import('./pages/posts')} />
                      )}
                    />
                    <Route
                      path="/post/:number"
                      render={() => (
                        <DynamicLoad promise={import('./pages/post')} />
                      )}
                    />
                    <Route
                      path="/repo/:repo"
                      render={() => (
                        <DynamicLoad promise={import('./pages/repo')} />
                      )}
                    />
                    <Route
                      path="/repo"
                      render={() => (
                        <DynamicLoad promise={import('./pages/repos')} />
                      )}
                    />
                    <Route
                      path="/todo/:number"
                      render={() => (
                        <DynamicLoad promise={import('./pages/todo')} />
                      )}
                    />
                    <Route
                      path="/todo"
                      render={() => (
                        <DynamicLoad promise={import('./pages/todos')} />
                      )}
                    />
                    <Route
                      path="/gist/:id"
                      render={() => (
                        <DynamicLoad promise={import('./pages/gist')} />
                      )}
                    />
                    <Route
                      path="/gist"
                      render={() => (
                        <DynamicLoad promise={import('./pages/gists')} />
                      )}
                    />
                    <Route
                      path="/search"
                      render={() => (
                        <DynamicLoad promise={import('./pages/search')} />
                      )}
                    />
                    <Route
                      path="/case"
                      render={() => (
                        <DynamicLoad promise={import('./pages/case')} />
                      )}
                    />
                  </Switch>
                </Card>
              </Col>
              <Col {...layoutPorps}>
                <Footer />
              </Col>
            </Row>
          </ClickMaterialWithStatRouterListener>
        </BrowserRouter>
      </Provider>
    )
  }
}
export default Statistics(App)
