import BaseSvc from './BaseSvc'
import util from 'util'
import Neode from 'neode';

//https://www.adamcowley.co.uk/javascript/using-the-neo4j-driver-with-nodejs/

export default class Neo4jSvc extends BaseSvc {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor(config) {

    super (config)
    this.instance = null
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  get config() {

    return this._config
  }


  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  name() {

    return this._config.dbName || 'Neo4jSvc'
  }

  /////////////////////////////////////////////////////////
  // Connect to Neo4j database
  /////////////////////////////////////////////////////////
  connect() {
      const url = util.format('bolt://%s:%d', this._config.neo4j_host, this._config.neo4j_port)
      console.log(url);
      this.instance = new Neode(url, this._config.neo4j_un,  this._config.neo4j_pw);
      //this.instance.withDirectory(__dirname +"../../../../models")  
  }

  /////////////////////////////////////////////////////////
  // Excute a query directly.
  /////////////////////////////////////////////////////////
  getDirectQuery(query, params)
  {
    return this.instance.cypher(query, params)
  }

  /////////////////////////////////////////////////////////
  // get all spaces
  /////////////////////////////////////////////////////////
  getSpaces(){
   return this.instance.cypher(`MATCH (r:RevitModel)<-[:DERIVATIVE_OF]-(d:DerivativeModel {URN:'${modelURN}'})\
   MATCH (r)<-[:IS_IN]-(elm)<-[:REALIZED_BY]-(p:Space) RETURN p.Name as Name, p.Number as Number, id(p) as NodeID, elm.UniqueId as ExternalId`)
  }

  getTest()
  {
 
    return this.instance.cypher('match p=((a:Space {Number:"G.66"})<-[:IS_IN]-(e:Lighting)<-[:FLOWS_TO*]-(s:DBPanel)-[:IS_IN]->(dp)) return p')

  }

  //
  getDoorToSpacePaths(){
    return this.instance.cypher('match (s:Space)-[r:BOUNDED_BY]->(k)-[:BOUNDED_BY]->(ns:Space) WITH s,k,ns MATCH (k)-[:IS_ON]-(d:Door) return s,k,ns')
   }

  getRelated(nodeId, relationshipType)
  {
  
   //MATCH (p)<-[:IS_IN]-(n) WHERE id(p) = 1083 WITH p,n MATCH (p)-[:REALIZED_BY]->(elm) RETURN n.Name as Name, n.Category as Category, elm.UniqueId as ExternalID, id(n) as NodeId

   return this.instance.cypher("MATCH (p)<-[:{0}]-(n) WHERE id(p) = {1} WITH p,n MATCH (n)-[:REALIZED_BY]->(elm) RETURN n.Name as Name, n.Category as Category, elm.UniqueId as ExternalID, id(n) as NodeId".replace("{0}", relationshipType).replace("{1}", nodeId))


  }


  //MATCH (n) where id(n)=184090 match (n)-[:REALIZED_BY]->(e) return e.UniqueId

  getExternalId(nodeId)
  {
  
   //MATCH (p)<-[:IS_IN]-(n) WHERE id(p) = 1083 WITH p,n MATCH (p)-[:REALIZED_BY]->(elm) RETURN n.Name as Name, n.Category as Category, elm.UniqueId as ExternalID, id(n) as NodeId

   return this.instance.cypher("MATCH (n) where id(n)={0} match (n)-[:REALIZED_BY]->(e) return e.UniqueId".replace("{0}", nodeId))

  }


  getProjects(username){
    if(username){
      return this.instance.cypher(`MATCH (u:User {FullName:"${username}"})-[:MEMBER_OF*]->(p:Project) RETURN p`)
    }
  }

  getProjects(query){

    if(query.username){
      return this.instance.cypher(`MATCH (u:User {FullName:"${query.username}"})-[:MEMBER_OF*]->(p:Project) RETURN p`)
    }
    else if(query.projectname){
      return this.instance.cypher(`MATCH (p:Project {Name:"${query.projectname}"}) RETURN p`)
    }
  }

getModels(projectId){
  if(projectId){
    return this.instance.cypher(`MATCH (p:Project {id:"${projectId}"})<-[:MODEL_OF*]-(m:DerivativeModel) RETURN m`)
  }
}

  getTeammembers(projectId){
    if(projectId){
      return this.instance.cypher(`MATCH (p:Project {id:"${projectId}"})<-[:MEMBER_OF*]-(t:Team)<-[:MEMBER_OF]-(u:User) RETURN u, t`)
    }
  }

  getShortestRoute()
  {
      var st = "MATCH (sp:Space {Number:'01-12'})<-[:IS_IN_SPACE]-(s1:CableTray) \
      MATCH (sc:Space {Number:'01-27'})<-[:IS_IN_SPACE]-(s2:CableTray {Category:'Cable Trays'})\
      CALL apoc.algo.dijkstra(s1, s2, 'CABLETRAY_FLOW_TO>', 'Length') YIELD path, weight\
      RETURN path, sp, sc, sum(weight) as TotalLength"

      return this.instance.cypher(st)
  }
  
  
  getBounding(nodeId)
  {
    return this.instance.cypher("MATCH (n:Space)-[:BOUNDED_BY]->(s:Section)-[:BOUNDED_BY]->(p:Space) WHERE id(n) = {0} WITH n,p,s MATCH (s)-[:IS_ON]-(m) RETURN n as RootSpace,p as Spaces,s as Bounds,m as Types".replace("{0}", nodeId))
  }

  getAsArray(res) {

    var nodes=[];
    var idx = 0;
      res.forEach(function (row) 
      {
        var colData = {}
        colData["id"] = idx++
        row.keys.forEach(function(key) 
        {
          colData[key] = row._fields[row._fieldLookup[key]]
        });
  
        nodes.push(colData)
      });
  
  return nodes;
  
  }

}