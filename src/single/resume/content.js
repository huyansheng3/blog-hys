import React, { Component } from 'react'
import resume from './resume.js'
import { Row, Col, Icon } from 'antd'
import wechatImage from './images/wechat.png'
import { map } from 'lodash'

class Content extends Component {
  render() {
    const layoutPorps = {
      md: { span: 12 },
      sm: { span: 24 },
      xs: { span: 24 },
    }

    return (
      <Row align="middle" className="content">
        <Col {...layoutPorps}>left</Col>
        <Col {...layoutPorps} className="head__info">
          right
        </Col>
      </Row>
    )
  }
}

export default Content
