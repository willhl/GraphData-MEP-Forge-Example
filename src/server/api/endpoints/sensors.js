import ServiceManager from '../services/SvcManager'
import express from 'express'
import config from 'c0nfig'
import path from 'path'
import fs from 'fs'

module.exports = function() {

  const SensorDataProxySvc = ServiceManager.getService('SensorDataProxySvc')

  const router = express.Router()

  router.get('/:sdata', async (req, res) => {

    try {

      const sdata = req.params.sdata
      const suri = Base64.decode(sdata)
      const SensorDataProxySvc = ServiceManager.getService('SensorDataProxySvc')
      const spaces = await SensorDataProxySvc.getSensorData(suri)

      res.json(spaces)

    } catch (error) {

      res.status(error.statusCode || 500)
      res.json(error)
    }
  })

  return router
}