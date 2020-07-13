import ServiceManager from 'SvcManager'
import 'Dialogs/dialogs.scss'
import Header from 'Header'
//import 'forge-white.scss'
import React from 'react'
import 'core.scss'
import SideNavBar from 'SideBar';
import PropTypes  from 'prop-types';

class CoreLayout extends React.Component {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static propTypes = {
    children : PropTypes.element.isRequired
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  componentWillMount () {

    this.forgeSvc =
      ServiceManager.getService(
        'ForgeSvc')

    this.forgeSvc.getUser().then((user) => {

      this.props.setUser(user)

    }, () => {

      this.props.setUser(null)
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render () {

    const { children } = this.props

    return (
      <div className='container text-left'>
        <Header {...this.props}/>
        <div className='core-container'>
            <div className='core-layout'>
              {children}
            </div>
        </div>
      </div>
    )

    // return (
    //   <div className='container text-center'>
    //     <Header {...this.props}/>
    //     <div className='sidebar-core-container'>
    //       <div className='column left'>
    //         <SideNavBar {...this.props}/>
    //       </div>
    //       <div className='column right'>
    //         <div className='core-layout'>
    //           {children}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // )
  }
}

export default CoreLayout
