import { injectReducer } from '../../../../store/reducers'


export default (store) => ({

  path: 'projectinfo',

  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const container = require('./containers/ProjectInfoContainer').default

      const reducer = require('./modules/projectinfo').default

      /*  Add the reducer to the store on key 'home' */
      injectReducer(store, { key: 'projectinfo', reducer })

      /*  Return getComponent   */
      cb(null, container)

      /* Webpack named bundle   */
    }, 'projectinfo')
  }
})