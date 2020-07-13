import { IndexLink, Link } from 'react-router'
import React from 'react'
import ServiceManager from 'SvcManager'
import './HomeView.scss'

class HomeView1 extends React.Component {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor() {

    super()

    this.bucketSvc = ServiceManager.getService('BucketSvc')
    this.derivativeSvc = ServiceManager.getService('DerivativeSvc')

    this.state = {
      models: [
        {
          extensions: ['Viewing.Extension.DataTable'],
          urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y29tLmhvYXJlbGVhLmRldi50ZXN0L3Rlc3Quemlw',
          name: 'WTS Model'
        },
        {
          extensions: ['Viewing.Extension.Demo'],
          urn: 'resources/models/seat/seat.svf',
          thumbnailClass: 'seat-thumbnail',
          name: 'Seat + Extension'
        }
      ]
    }
  }

  refreshModels() {

    this.getBuckets().then((value) => {

      value.forEach(bucket => {
        this.getItems(bucket.bucketKey).then((val1) => {
          val1.items.forEach(ob => {

            let urn = Buffer(ob.objectId).toString('base64')

             var newItem ={
                urn: urn,
                thumbnailClass: 'default-thumbnail',
                name: ob.objectKey
              }

              this.getThumbnail(urn).then(t => 
                {
                  newItem.thumbnailClass = 'url-thumbnail',
                  newItem.thumbnail = t
                  this.updateItem(newItem)
                })


              this.addItem(newItem)
          })
        })
      });
    })
  }

  addItem(newItem){
    const nmodels = this.state.models.slice()
    this.setState({
      models: nmodels.concat(newItem)
    })
  }


  updateItem(updatedItem){
    const nmodels = this.state.models.slice()
    const objIndex = nmodels.findIndex((obj => obj.urn === updatedItem.urn))
    nmodels[objIndex] = updatedItem
    this.setState({
      models: nmodels
    })
  }



  bucketItems(bucketKey) {
    this.getItems(bucketKey).then((value) => {
      let tempItems = []
      value.items.forEach((item) => {
        tempItems.push(item)
      })
      return tempItems
    })
  }
  componentDidMount() {
    this.refreshModels()
  }



  async getThumbnail(urn) {
      const thumbnail = await this.derivativeSvc.getThumbnail(urn, 200)
      return thumbnail
  }

  async getBuckets() {
    const buckets = await this.bucketSvc.getBuckets()
    return buckets.body.items
  }

  async getItems(bucketKey) {
    const items = await this.bucketSvc.getBucketObjects(bucketKey)
    return items.body
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  render() {

    return (
      <div className="home">
        <img className='logo-hero' src='resources/img/hl-home-banner.jpg' />
        <div className="models">
          <div className="title">
            Choose Project
          </div>
          <div className="content responsive-grid">
            {
              this.state.models.map((model, idx) => {

                //let query = `urn=${model.urn}`
                let modelname = model.name

                if (model.extensions) {

                  //query += '&extIds=' + model.extensions.join(';')
                }

                return (
                  //<Link key={idx} to={{pathname: `/project`, search: `?name=${query}`}}>
                  <Link key={idx} to={{pathname: `/project/${modelname}`}}>
                    <figure>
                      <figcaption>
                        {model.name}
                      </figcaption>
                      <img className={model.thumbnailClass || 'default-thumbnail'}
                        src={model.thumbnail || ''} />
                    </figure>
                  </Link>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default HomeView
























































