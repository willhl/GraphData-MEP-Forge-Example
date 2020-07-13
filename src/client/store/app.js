import ServiceManager from 'SvcManager'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_NAVBAR_STATE = 'SET_NAVBAR_STATE'
export const SET_SIDEBAR_STATE = 'SET_NAVBAR_STATE'
export const SAVE_APP_STATE = 'SAVE_APP_STATE'
export const SET_VIEWER_ENV = 'SET_VIEWER_ENV'
export const SET_DASHBOARD_ENV = 'SET_DASHBOARD_ENV'
export const SET_PROJECT = 'SET_PROJECT'
export const ADD_MODEL ='ADD_MODEL'
export const SET_USER = 'SET_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function saveAppState () {
  return {
    type    : SAVE_APP_STATE
  }
}

export function setNavbarState (state) {
  return {
    type    : SET_NAVBAR_STATE,
    payload : state
  }
}

export function setSidebarState (state) {
  return {
    type    : SET_SIDEBAR_STATE,
    payload : state
  }
}

export function setViewerEnv (env) {
  return {
    type    : SET_VIEWER_ENV,
    payload : env
  }
}

export function setDashboardEnv (env) {
  return {
    type    : SET_DASHBOARD_ENV,
    payload : env
  }
}

export function addModel (modelName, modelUrn){
  return{
    type: ADD_MODEL,
    payload:{
      name: modelName,
      urn: modelUrn
    }
  }
}

export function setProject (project) {
  return {
    type    : SET_PROJECT,
    payload : project
  }
}

export function setUser (user) {
  return {
    type    : SET_USER,
    payload : user
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {

  [SAVE_APP_STATE] : (state, action) => {

    const storageSvc = ServiceManager.getService(
      'StorageSvc')

    storageSvc.save('AppState', state)

    return state
  },

  [SET_NAVBAR_STATE] : (state, action) => {

    const navbar = Object.assign({},
      state.navbar, action.payload)

    return Object.assign({}, state, {
      navbar
    })
  },

  [SET_SIDEBAR_STATE] : (state, action) => {

    const sidebar = Object.assign({},
      state.sidebar, action.payload)

    return Object.assign({}, state, {
      sidebar
    })
  },

  [SET_VIEWER_ENV] : (state, action) => {

    return Object.assign({}, state, {
      viewerEnv: action.payload
    })
  },

  [SET_PROJECT] : (state, action) => {

    return Object.assign({}, state, {
      project: action.payload
    })
  },

  [ADD_MODEL] : (state, action) => {

    console.log(state)
    console.log(action)

    return Object.assign({}, state, {
      project: {
        name: state.project.name,
        models:[
          ...state.project.models,
          action.payload
        ]
      }
    })
  },

  [SET_DASHBOARD_ENV] : (state, action) => {

    return Object.assign({}, state, {
      dashboardEnv: action.payload
    })
  },

  [SET_USER] : (state, action) => {

    return Object.assign({}, state, {
      user: action.payload
    })
  }
}

// ------------------------------------
// Initial App State
// ------------------------------------

const createInitialState = () => {

  const defaultState = {
    navbar: {
      links:{
        about: true,
        login: true,
        home: true
      }
    },
    project: null,
    sidebar: null,
    dashboardEnv: null,
    viewerEnv: null,
    user: null
  }

  const storageSvc = ServiceManager.getService(
    'StorageSvc')

  const storageState = storageSvc.load(
    'AppState')

  const initialState = Object.assign({},
    defaultState,
    storageState)

  return initialState
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function reducer (
  state = createInitialState(), action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
