import { injectReducer } from '../../store/reducers'
import DashboardRoute from '../Dashboard'
import ProjectLayout from '../../layouts/ProjectLayout'
import ProjectHome from './ProjectRoutes/ProjectHome'
import ProjectInfo from './ProjectRoutes/ProjectInfo'
import ViewerRoute from '../Viewer'

// export default (store) => ({

//   path : 'project',
//   childRoutes:[
//     DashboardRoute(store)
//   ],

//   getComponent (nextState, cb) {

//     require.ensure([], (require) => {

//       const container = require('./containers/ProjectContainer').default
//       const reducer = require('./modules/project').default

//       injectReducer(store, { key: 'project', reducer })

//       cb(null, container)

//     }, 'project')
//   }
// })

export default (store) => ({

  path : 'project/:projectName',
  component: ProjectLayout,
  indexRoute: ProjectHome(store),
  childRoutes:[
    DashboardRoute(store),
    ProjectInfo(store),
    ViewerRoute(store)
  ]


})
