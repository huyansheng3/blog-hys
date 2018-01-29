import React, { Component } from 'react'
import resume from './resume.js'
import { Row, Col, Icon } from 'antd'
import wechatImage from './images/wechat.png'
import { map } from 'lodash'
class Header extends Component {
  render() {
    const layoutPorps = {
      md: { span: 12 },
      sm: { span: 24 },
      xs: { span: 24 },
    }

    return (
      <Row align="middle" justify="space-between" className="header">
        <Col {...layoutPorps}>
          <Row align="middle">
            <Col md={{ span: 8 }} sm={{ span: 24 }}>
              <img className="header__wechat" src={wechatImage} alt="wechat" />
            </Col>
            <Col md={{ span: 16 }} sm={{ span: 24 }}>
              <div className="header__contract">
                {map(resume.contract, (value, key) => {
                  return (
                    <div key={key}>
                      <Icon type={key} /> {value}
                    </div>
                  )
                })}
              </div>
            </Col>
          </Row>
        </Col>
        <Col {...layoutPorps} className="head__info">
          <h1>{resume.name}</h1>
          <h2>{resume.job}</h2>
        </Col>
      </Row>
    )
  }
}

export default Header
