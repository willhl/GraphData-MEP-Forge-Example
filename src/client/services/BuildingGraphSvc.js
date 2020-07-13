import ClientAPI from 'ClientAPI'
import BaseSvc from './BaseSvc'
import { format } from 'util';

export default class BuildingGraphSvc extends BaseSvc {

  /////////////////////////////////////////////////////////
  constructor (config) {

    super (config)

    this.api = new ClientAPI(config.apiUrl)//"http://localhost:3000")
  }

    /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  name() {
    return 'BuildingGraphSvc'
  }


  
  Query(query, variables)
  {

    const qry = {query:query, variables:variables}
      return this.api.ajax({
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(qry),
        url: '/graphql'
      })

  }



}