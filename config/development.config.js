
/////////////////////////////////////////////////////////////////////
// DEVELOPMENT configuration
//
/////////////////////////////////////////////////////////////////////
const HOST_URL = process.env.HOST_URL ||  'https://localhost'
const PORT = process.env.PORT || 3000

const config = {

  env: 'development',

  client: {
    host: `${HOST_URL}`,
    env: 'development',
    port: PORT
  },

  forge: {

    oauth: {

      redirectUri: process.env.FORGE_CALLBACK_URL,
      authenticationUri: '/authentication/v1/authenticate',
      refreshTokenUri: '/authentication/v1/refreshtoken',
      authorizationUri: '/authentication/v1/authorize',
      accessTokenUri: '/authentication/v1/gettoken',

      baseUri: 'https://developer.api.autodesk.com',
      clientSecret: process.env.FORGE_DEV_CLIENT_SECRET,
      clientId: process.env.FORGE_DEV_CLIENT_ID,

      scope: [
        'data:read',
        'data:write',
        'data:create',
        'bucket:read',
        'bucket:create'
      ]
    },

    viewer: {
      viewer3D: 'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.min.js',
      style:    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/style.min.css'
    }
  },

  database: {
    type: 'Neo4j',
    neo4j_host: process.env.NEO4J_HOST,
    neo4j_un: process.env.NEO4J_UN,
    neo4j_pw: process.env.NEO4J_PW,
    neo4j_port: process.env.NEO4J_PORT,
    neo4j_protocol: process.env.NEO4J_PROTOCOL,
  }
}

module.exports = config


