import React, { Component } from 'react'
import { Tooltip, Icon } from 'antd'
import ViewSourceCode from 'src/component/view-source-code'
import CONFIG from '../../config.json'
import './index'

const defaultEditPage = `https://github.com/${CONFIG.owner}/${
  CONFIG.repo
}/edit/master/ABOUTME.md`

class EditThisPage extends Component {
  static defaultProps = {
    editPage: defaultEditPage,
    sourcePage: '',
    showEdit: false,
    showSource: true,
  }

  render() {
    const { showEdit, editPage, showSource, sourcePage } = this.props
    return (
      <div className="edit-this-page">
        {showEdit && (
          <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
            <a href={editPage} target="_blank">
              <Icon
                type="edit"
                style={{
                  fontSize: '3rem',
                }}
              />
            </a>
          </Tooltip>
        )}
        {showSource && (
          <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
            <a href="javascript: void 0" target="_blank">
              <ViewSourceCode file={sourcePage}>
                <Icon
                  type="code"
                  style={{
                    fontSize: '3rem',
                  }}
                />
              </ViewSourceCode>
            </a>
          </Tooltip>
        )}
      </div>
    )
  }
}

export default EditThisPage
