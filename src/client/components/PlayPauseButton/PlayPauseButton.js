import React from 'react'
import { Button, PlayerIcon } from 'react-player-controls'
import './PlayPauseButton.scss' // in conjunction with webpack's style-loader

class PlayPauseButton extends React.Component {

    state = {isPlaying: false}

    constructor () {
        super()
        console.log("PlayPauseButton Contructed")
        
    }


    shouldComponentUpdate (props, state) {
      return true
     }
   

    handleClick (event) {
      if (this.props.isEnabled) {
        
        this.setState(() => {
          console.log('setting state');
          return { isPlaying: !this.state.isPlaying 
        }

        this.props.onPlayPause(this.state.isPlaying)
      });

      }
    }


    render () {
        const isPlaying = this.state.isPlaying  
        return (
        <button type="button" className="btn btn-default btn-circle" onClick={this.handleClick.bind(this)}>
        {isPlaying ? <PlayerIcon.Pause /> : <PlayerIcon.Play />}
        </button>

        )
    }
}

export default PlayPauseButton