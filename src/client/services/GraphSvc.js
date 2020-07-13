
import ClientAPI from 'ClientAPI'
import BaseSvc from './BaseSvc'
import { format } from 'util';

export default class GraphSvc extends BaseSvc {

  /////////////////////////////////////////////////////////
  //
  //
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
    return 'GraphSvc'
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  getSpaces () {
    const url = `/spaces`
    return this.api.ajax(url)
  }

    /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  getSpacesR () {

    const url = `/spacesR`

    return this.api.ajax(url)

  }


  getUserProjects(username){

    const userData ={
      username: username
    }

    const url = '/projects'
    return this.api.ajax({
      type: 'GET',
      url: url,
      data: userData,
      dataType: 'json'
    })
  }

  getProjectByName(projectname){

    const projectData ={
      projectname: projectname
    }

    const url = '/projects'
    return this.api.ajax({
      type: 'GET',
      url: url,
      data: projectData,
      dataType: 'json'
    })
  }

  getTeamMembers(projectid){


    const url = `/project/${projectid}/team`
    return this.api.ajax({
      type: 'GET',
      url: url,
      dataType: 'json'
    })
  }

  getModels(projectid){


    const url = `/project/${projectid}/models`
    return this.api.ajax({
      type: 'GET',
      url: url,
      dataType: 'json'
    })
  }

  /////////////////////////////////////////////////////////
  //
  ///related/:rtype/:nid
  /////////////////////////////////////////////////////////
  getRelated (nodeId, reltaionshipType) {

    const url = "/related/{0}/{1}".replace("{0}", reltaionshipType).replace("{1}", nodeId)

    return this.api.ajax(url)

  }


  getExternalId (nodeId) {

    const url = "/externalid/{0}".replace("{0}", nodeId)

    return this.api.ajax(url)

  }

  getShortestPath () {

    const url = "/shortestPath"

    return this.api.ajax(url)

  }


  getDirectQuery(query, prameters){

    const qry = {query:query, param:prameters}

      return this.api.ajax({
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(qry),
        url: '/dquery'
      })
  }

}
