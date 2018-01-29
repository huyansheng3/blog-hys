// @flow
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Row, Col } from 'antd'
import resume from './resume.js'
import Header from './header'
import Content from './content'
import './index.less'

class Resume extends Component {
  render() {
    const layoutPorps = {
      lg: { span: 18, offset: 3 },
      md: { span: 22, offset: 1 },
      sm: { span: 24 },
      xs: { span: 24 },
    }
    return (
      <Row className="resume">
        <Col {...layoutPorps}>
          <Header />
        </Col>

        <Col {...layoutPorps}>
          <Content />
        </Col>
      </Row>
    )
  }
}

ReactDOM.render(<Resume />, document.getElementById('root'))
