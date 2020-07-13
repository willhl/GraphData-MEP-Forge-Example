import ClientAPI from 'ClientAPI'
import BaseSvc from './BaseSvc'

export default class DerivativeSvc extends BaseSvc {

    constructor (config) {

        super (config)
    
        this.api = new ClientAPI(config.apiUrl)
    
        this.api.ajax('/clientId').then((res) => {
    
          this._clientId = res.clientId
        })
      }

      name() {

        return 'DerivativeSvc'
      }

      translateItem(objectKey){

        const options = {}
        const translationData ={
            objectKey: objectKey,
            options: options
        }

          return this.api.ajax({
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(translationData),
            url: '/job'
          })
      }

      getThumbnail(urn, size){

        const url = this.api.apiUrl +`/thumbnails/${urn}?width=${size}&height=${size}`
        
        return url
      }

      getManifest(urn){

        const url = this.api.apiUrl +`/manifst/${urn}`

        return this.api.ajax({
          type: 'GET',
          url:`/manifest/${urn}`,
          dataType: 'json'
        })
      }

}