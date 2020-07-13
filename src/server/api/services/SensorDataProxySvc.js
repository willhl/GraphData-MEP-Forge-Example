import BaseSvc from './BaseSvc'
import rp from 'request-promise';


export default class SensorDataProxySvc extends BaseSvc {

 /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor(config) {

    super (config)
  }

    /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  get config() {

    return this._config
  }



  name() {
    return 'SensorDataProxySvc'
  }


  getSensorData(uri)
  {

    var options = {
        uri: uri,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Encoding' : 'gzip, deflate'
        },
        json: true // Automatically parses the JSON string in the response
    };

    
    return rp(options)

  }
  
}