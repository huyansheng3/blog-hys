import React, { Component } from 'react'

class NetEasePlayer extends Component {
  render() {
    return (
      <div
        className="netease-player"
        style={{ position: 'absolute', top: '0' }}>
        <iframe
          title="163-music"
          frameBorder="no"
          border="0"
          marginWidth="0"
          marginHeight="0"
          width={330}
          height={110}
          src="//music.163.com/outchain/player?type=0&id=2070965513&auto=1&height=90"
        />
      </div>
    )
  }
}

export default NetEasePlayer
