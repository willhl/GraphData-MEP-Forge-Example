import ServiceManager from '../services/SvcManager'
import express from 'express'
import config from 'c0nfig'
//import space from '../../../models/Space'
import Graph from '../../graphOrm/Graph'
import Node from '../../graphOrm/Node'
import Relationship from '../../graphOrm/Relationship'

module.exports = function () {

  /////////////////////////////////////////////////////////
  //router
  //
  /////////////////////////////////////////////////////////
  const router = express.Router()

  /////////////////////////////////////////////////////////
  // Get user subscribed projects
  //
  /////////////////////////////////////////////////////////
  router.get('/spaces', async (req, res) => {

    try {

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')


      const spaces = await neo4jSvc.getSpaces()

      //const nodes = spaces.records.map(record => record.get("p.Name", "p.Number"))

      res.json(spaces.records)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })

  /////////////////////////////////////////////////////////
  // Get user subscribed projects
  //
  /////////////////////////////////////////////////////////
  router.get('/spacesR', async (req, res) => {

    try {

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')


      const spaces = await neo4jSvc.getSpaces()


      //const nodes = spaces.records.map(record => record.get("p.Name", "p.Number"))


      res.json(spaces)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })


  /////////////////////////////////////////////////////////
  // relationshoip endpoint
  //
  /////////////////////////////////////////////////////////
  router.get('/related/:rtype/:nid', async (req, res) => {

    const rtype = req.params.rtype
    const nid = parseInt(req.params.nid, 10)

    try {

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')
      const related = await neo4jSvc.getRelated(nid, rtype)

      res.json(related.records)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })

  /////////////////////////////////////////////////////////
  // bounds endpoint
  //
  /////////////////////////////////////////////////////////
  router.get('/bounding/:nid', async (req, res) => {

    const nid = parseInt(req.params.nid, 10)

    try {

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')
      const related = await neo4jSvc.getBounding(nid)

      res.json(related.records)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })


  router.get('/test', async (req, res) => {

    try {

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')

      const spaces = await neo4jSvc.getTest()

      const nodes = spaces.records.map(record => record.get("p"))

      res.json(nodes)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })

  router.get('/projects', async (req, res) => {

    try {

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')

      const query = req.query

      const projects = await neo4jSvc.getProjects(query)

      const nodes = projects.records.map(record => record.get("p"))

      res.json(nodes)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })


  router.get('/externalid/:nid', async(req, res) => {

    const nid = parseInt(req.params.nid, 10)
    
    try {

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')
      const related = await neo4jSvc.getExternalId(nid)

      res.json(related.records)

    } catch (error) {
      res.status(error.statusCode || 500)
      res.json(error)
    }
  })


  router.get('/project/:projectId', async (req, res) => {
    try {

      const projid = req.params.projectId

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')

      const members = await neo4jSvc.getTeammembers(projid)

      const nodes = members.records.map(record => record.get("p"))

      res.json(nodes)

    } catch (error) {
      res.status(error.statusCode || 500)
      res.json(error)
    }
  })

  //////////////////////////////////////////////////////////////////////////////////
  // DANGEROUS! this is a quick hack...
  // tecknically any query can be ran with full read/write access to DB
  //////////////////////////////////////////////////////////////////////////////////
  router.post('/dquery', async (req, res) => {
    try {

        const query = req.body.query
        const parameters = req.body.params
        const neo4jSvc = ServiceManager.getService('Neo4jSvc')
        const queryResult = await neo4jSvc.getDirectQuery(query, parameters)

        res.json(queryResult)

    } catch (error) {
      res.status(error.statusCode || 500)
      res.json(error)
    }
  })



  router.get('/shortestPath', async(req, res) => {

    try {

      let lgraph = new Graph()

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')

      const response = await neo4jSvc.getShortestRoute()
      
      let responses = response.records.map(record => record.get("path"))

      responses.forEach(record => {
        
          const segments = record.segments
          const start = record.start
          const end = record.end

        if (segments){
           segments.forEach(segment => {
              const rstart = segment.start
              const rend = segment.end
              const rel = segment.relationship

              let sn = new Node(rstart.identity.low, rstart.labels, rstart.properties)
              lgraph.addNode(sn)
              let en = new Node(rend.identity.low, rend.labels, rend.properties)
              lgraph.addNode(en)

              lgraph.addRelationship(new Relationship(rel.identity.low, sn, en, rel.properties))
             

            });
          }

          if (record.identity){
            let sn = lgraph.addNode(new Node(record.identity.low, record.labels, record.properties))
          }
      
      });

    let nlist = []
    lgraph._nodes.forEach(node => {
        nlist.push({id:node.id})
    });

    let rlist = []
    lgraph._relationships.forEach(rel => {
      rlist.push({source:rel.source.id, target:rel.target.id})
    });

    res.json({nodes:nlist, links:rlist})

    } catch (error) {
      res.status(error.statusCode || 500)
      res.json(error)
    }
  
  })

  router.get('/project/:projectId/models', async (req, res) => {
    try {

      const projid = req.params.projectId

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')

      const models = await neo4jSvc.getModels(projid)

      const nodes = models.records.map(record => record.get("m"))
     
      res.json(nodes)

    } catch (error) {
      res.status(error.statusCode || 500)
      res.json(error)
    }
  })

  router.get('/project/:projectId/team', async (req, res) => {
    try {

      const projid = req.params.projectId

      const neo4jSvc = ServiceManager.getService('Neo4jSvc')

      const members = await neo4jSvc.getTeammembers(projid)

      const nodes = members.records.map(record =>({
        user: record.get("u"),
        team: record.get("t")

      }) )
     
      res.json(nodes)

    } catch (error) {
      res.status(error.statusCode || 500)
      res.json(error)
    }
  })

  router.get('/doorToSpace', async (req, res) => {

    try {


      const neo4jSvc = ServiceManager.getService('Neo4jSvc')

      const spaces = await neo4jSvc.getDoorToSpacePaths()

      //const nodes = spaces.records.map(record => record.get("p"))

      res.json(spaces.records)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })


  return router
}

