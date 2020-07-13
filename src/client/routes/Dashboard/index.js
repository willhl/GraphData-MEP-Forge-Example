import { injectReducer } from '../../store/reducers'

export default (store) => ({

  path : 'dashboard',

  getComponent (nextState, cb) {

    require.ensure([], (require) => {

      const container = require('./containers/DashboardContainer').default
      const reducer = require('./modules/dashboard').default

      injectReducer(store, { key: 'dashboard', reducer })

      cb(null, container)

    }, 'dashboard')
  }
})
