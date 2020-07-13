import React from 'react'
import Modal from 'react-modal'
import './NewBucketDialog.scss'

export default class NewBucketDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          inputValue: 'com.bucketkey.dev.test'
        };
    }
  
  close () {

    this.props.close()
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  render() {

    const style = {
      overlay: {
        backgroundColor: 'rgba(201, 201, 201, 0.50)'
      }
    }

    

    return (
      <div>
        <Modal className="dialog newBucket"
          contentLabel=""
          style={style}
          isOpen={this.props.open}
          onRequestClose={() => {this.close()}}>

          <div className="title">
            <img/>
            <b>Create a new bucket</b>
          </div>

          <div className="content">
             <div>
               Name:
             </div>
             <div className="modal-body">
          <input type="text" id="newBucketKey" className="form-control" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}></input>
        </div>
        <div className="modal-footer">
            <div>
            <button onClick={() => this.close()}>Cancel</button>
          <button id="createNewBucket" onClick={() => this.props.createBucket(this.state.inputValue)}>Create Bucket</button>
            </div>
        </div>
          </div>
        </Modal>
      </div>
    )
  }
}