import { connect } from 'react-redux'

import HomeView from '../components/HomeView'
import {setProject} from '../../../store/app'

const mapDispatchToProps = {
  setProject
}

const mapStateToProps = (state) => ({
  appState: state.app
})

export default connect(
  mapStateToProps,
  mapDispatchToProps)(HomeView)
