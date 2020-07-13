
import React from 'react';
import Modal from 'react-modal'
import './AboutDlg.scss'

export default class AboutDlg extends React.Component {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor() {

    super()

  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  close () {

    this.props.close()
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  render() {

    const style = {
      overlay: {
        backgroundColor: 'rgba(201, 201, 201, 0.50)'
      }
    }

    return (
      <div>
        <Modal className="dialog about"
          contentLabel=""
          style={style}
          isOpen={this.props.open}
          onRequestClose={() => {this.close()}}>

          <div className="title">
            <img/>
            <b>About</b>
          </div>

          <div className="content">
             <div>
               Written by Hoare Lea Digital Innovation Team
             </div>
          </div>
        </Modal>
      </div>
    )
  }
}
