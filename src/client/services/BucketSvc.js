import ClientAPI from 'ClientAPI'
import BaseSvc from './BaseSvc'
import superAgent from 'superagent'
import { resolve } from 'path';

export default class BucketSvc extends BaseSvc {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor (config) {

    super (config)

    this.api = new ClientAPI(config.apiUrl)

    this.api.ajax('/clientId').then((res) => {

      this._clientId = res.clientId
    })
  }

  name() {

    return 'BucketSvc'
  }


  getBuckets(){

    return this.api.ajax({
      dataType: 'json',
      type: 'GET',
      url: '/buckets'
    })
  }

  getBucketObjects(bucketKey){
    return this.api.ajax({
      dataType: 'json',
      type: 'GET',
      url: '/buckets/' + bucketKey + '/objects'
    })
  }

  createNewBucket(bucketKey){

    const bucketCreationData =
    {
      bucketCreationData:
      {
        bucketKey: bucketKey,
        policyKey:'transient'
      }
    }

    return this.api.ajax({
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(bucketCreationData),
      url: '/buckets'
    })
  }

  uploadFileToBucket(bucketKey, file){

    const url = '/buckets/' + bucketKey

    const options = Object.assign({}, {
      tag: 'model'
    })

    return this.api.upload (url, file[0], options)

  }



}