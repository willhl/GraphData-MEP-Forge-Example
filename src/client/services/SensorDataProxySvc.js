import ClientAPI from 'ClientAPI'
import BaseSvc from './BaseSvc'

export default class SensorDataSvc extends BaseSvc {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor (config) {

    super (config)

    this.api = new ClientAPI(config.apiUrl)

  }

    /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  name() {

    return 'SensorDataSvc'
  }


  /////////////////////////////////////////////////////////////////
  // url: part of url with device id
  // start: start datetime of required data range in ISO 8601 end date and time in UTC format
  // end: end of required data range in ISO 8601 end date and time in UTC format
  // interval: The interval parameter can be set to any desired time interval in minutes.
  /////////////////////////////////////////////////////////////////
  getDataForDateRange(url, start, end, interval)
  {
    var locData = { 
        start: start.toISOString(),
        end: end.toISOString(),
        interval: interval
    }

    return this.getData(url, locData)
  }

  /////////////////////////////////////////////////////////////////
  // url: part of url with device id
  // pastHours: Previous number of hours you want
  /////////////////////////////////////////////////////////////////
  getDataForPastHours(url, pastHours)
  {
    var locData = { 'previousHours' : pastHours}
    return this.getData(url, locData)
  }


  getData(fullUrl, data)
  {
    return this.api.ajax({
        dataType: 'json',
        type: 'GET',
        data: data,
        url: fullUrl
      })
  }


}