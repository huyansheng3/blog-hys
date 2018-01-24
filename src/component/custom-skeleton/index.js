import React, { Component } from 'react'
import ContentLoader from 'react-content-loader'

class CodeLoading extends Component {
  render() {
    return (
      <ContentLoader {...this.props}>
        <rect width="300" height="50" x="20" y="20" rx="4" ry="4" />
        <rect width="250" height="15" x="20" y="85" rx="4" ry="4" />
        <rect width="280" height="15" x="20" y="110" rx="4" ry="4" />
      </ContentLoader>
    )
  }
}

export default CodeLoading
