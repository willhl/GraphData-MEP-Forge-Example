import { IndexLink, Link } from 'react-router'
import NewBucketDialog from '../../../components/Dialogs/NewBucketDialog'
import './DashboardView.scss'
import ServiceManager from 'SvcManager'
import React from 'react'


function BucketObjectsView(props){
    return(
        <div>
        <label>{props.itemName}</label>
        <button className="button" onClick={(objectId) => props.handleTranslateClick(props.objectKey)}>
            {props.translateStatus}
        </button>
        <button className="button" onClick={(objectId) => props.handleViewClick(props.objectKey)}>
            View
        </button>
        </div>
    )
}

// function BucketView(props){
//     return(
//         <div>
//             <label>{props.bucketName}</label>
//             {props.items.map((bucket) => BucketObjectsView(bucket))}
//         </div>
//     )
// }

class BucketView extends React.Component{
    constructor() {
        super()
        this.bucketSvc = ServiceManager.getService('BucketSvc')
        this.derivativeSvc = ServiceManager.getService('DerivativeSvc')
        this.state ={
            bucketItems:[]
        }
    }

    componentDidMount(){
        this.refreshItems()
    }

    refreshItems(){
        this.getItems(this.props.bucketName).then((value) => 
        {
          let tempItems = [];
            value.items.forEach(element => {
                tempItems.push({
                    objectId: Buffer(element.objectId).toString('base64'),
                    objectKey: element.objectKey
                })
            });
            const items = this.state.bucketItems.slice()

            this.setState({
                bucketItems: items.concat(tempItems)
            })
        })
    }

    async getItems(bucketKey){
        const items = await this.bucketSvc.getBucketObjects(bucketKey)
        return items.body
    }

    async uploadItem(files){
        const items = await this.bucketSvc.uploadFileToBucket(this.props.bucketName, files)
        return items.body
    }

    async translateItem(objectKey){
        const items = await this.derivativeSvc.translateItem(objectKey).then((items) => {
            console.log(items)
            return items.body
        })

    }

    handleTranslateClick(objectId){
       this.translateItem(objectId)
    }

    

    renderBucketObject(item){
        return(
            <BucketObjectsView 
            key={item.objectId} 
            objectKey={item.objectId}
            itemName={item.objectKey}
            translateStatus="Translate"
            handleViewClick={(itemName) => this.props.handleViewClick(itemName)}
            handleTranslateClick={(objectKey) => this.handleTranslateClick(objectKey)}>

            </BucketObjectsView>
        )
    }

    uploadFile(files){
        if(files[0]){
            this.uploadItem(files).then((value) =>{
                this.refreshItems()
            })
        }
        
    }

    render(){
        return(
        <div className='bucket-item'>
            <div className="title">{this.props.bucketName}</div>
            <div className="row">
                <label>Objects</label>
                <button className="button" onClick={(e) => this.myInput.click()}>Upload Object</button>
            </div>
            {this.state.bucketItems.map((item) => this.renderBucketObject(item))}

            <div className="form-group">
            {/* <input className="form-control" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Optional name for the file" /> */}
            <input id="myInput" type="file" onChange={ (e) => this.uploadFile(e.target.files)} ref={(ref) => this.myInput = ref} style={{ display: 'none' }} />
          </div>

        </div>
        )
    }
}

class DashboardView extends React.Component {

    constructor() {
        super()

        this.bucketSvc = ServiceManager.getService('BucketSvc')
        this.state ={
            buckets:[],
            newBucketOpen:false
        }
    }

      componentDidMount(){
          this.refreshBuckets()
      }

      refreshBuckets(){
        this.getBuckets().then((value) => 
        {
          let tempBuckets = [];
            value.forEach(element => {
              tempBuckets.push(element)
            });
            const buckets = this.state.buckets.slice()

            this.setState({
              buckets: buckets.concat(tempBuckets)
            })
        })
      }

      handleViewClick(itemUrn){
        //   alert(itemUrn)
        //       let itemUrn = `urn=${itemUrn}`
        //       if (model.extensions) {
        //           query += '&extIds=' + model.extensions.join(';')
        //         }
                this.props.router.push(`/viewer?urn=${itemUrn}`)
      }

    async getBuckets(){
          const buckets = await this.bucketSvc.getBuckets()
          return buckets.body.items
      }

      renderBucket(bucket) {
        return (
          <BucketView
          key={bucket.bucketKey}
          bucketName={bucket.bucketKey}
          handleViewClick={(itemUrn) => this.handleViewClick(itemUrn)}
          />
        );
      }

      createNewBucket(newBucketKey) {
        this.setState(Object.assign({}, this.state, {
            newBucketOpen: false
        }))
        this.createBucketAsync(newBucketKey)
      }

      async createBucketAsync(newBucketKey){
        const newBucket = await this.bucketSvc.createNewBucket(newBucketKey)
        this.refreshBuckets()
      }

      openNewBucketDlg () {

        this.setState(Object.assign({}, this.state, {
            newBucketOpen: true
        }))
      }

      render(){
          return(
               <div className="dashboard">
               <div className="models">
 
                       <div>
                           <button className='newbucket' onClick={() => this.openNewBucketDlg()}>Create A New Bucket</button>
                           </div>
                           <div className="content responsive-grid">{this.state.buckets.map((bucket) => this.renderBucket(bucket))}</div>
                           
                           <NewBucketDialog
                           close={()=>{ this.setState(Object.assign({}, this.state, {newBucketOpen: false}))}}
                           open={this.state.newBucketOpen}
                            viewItem = {(itemUrn) => this.handleViewClick(itemUrn)}
                           createBucket={(newBucketKey) => this.createNewBucket(newBucketKey)}
                           />

               </div>
               </div>
          )
      }

}

export default DashboardView