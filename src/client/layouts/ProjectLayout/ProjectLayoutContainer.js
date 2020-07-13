import { connect } from 'react-redux'
import ProjectLayout from './ProjectLayout'
import {
  saveAppState,
  addModel,
  setProject
  } from '../../store/app'

const mapDispatchToProps = {
  saveAppState,
  addModel,
  setProject
}

const mapStateToProps = (state) => ({
  appState: state.app
})

export default connect(
  mapStateToProps,
  mapDispatchToProps)(ProjectLayout)
