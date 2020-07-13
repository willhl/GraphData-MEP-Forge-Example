
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react';
import AboutDlg from 'Dialogs/AboutDlg'
import ServiceManager from 'SvcManager'
import './AppNavbar.scss'

import {
  DropdownButton,
  NavDropdown,
  MenuItem,
  NavItem,
  Navbar,
  Button,
  Modal,
  Nav
  } from 'react-bootstrap'

export default class AppNavbar extends React.Component {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor (props) {

    super(props)

    this.state = {
      aboutOpen:    false
    }

    this.forgeSvc = ServiceManager.getService('ForgeSvc')
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  openAboutDlg () {

    this.setState(Object.assign({}, this.state, {
      aboutOpen: true
    }))
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  login () {

    const { appState } = this.props

    if (appState.user) {

      this.props.setUser(null)

      this.forgeSvc.logout()

    } else {

      this.forgeSvc.login()
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render() {

    const { appState } = this.props

    const {user} = appState

    const username = user
      ? `${user.firstName} ${user.lastName}`
      : ''

    return (

      <Navbar className="forge-navbar">
        <Navbar.Header>
          <Navbar.Brand>
          <NavItem className="forge-brand-item"
              href="https://www.hoarelea.com"
              target="_blank">
              <img height="30" src="/resources/img/hl.png"/>
            </NavItem>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>

        <Navbar.Collapse>

          {
            appState.navbar.links.home &&

            <Nav>
              <LinkContainer to={{ pathname: '/', query: { } }}>
                <NavItem eventKey="home">
                  <label className="nav-label">
                    &nbsp; Projects
                  </label>
                </NavItem>
              </LinkContainer>
            </Nav>
          }

          <Nav pullRight>

            {

            appState.navbar.links.login &&

            <NavItem eventKey="login" onClick={() => {this.login()}}>
              {
                !appState.user &&
                <span className="a360-logo"/>
              }
              {
                appState.user &&
                <img className="avatar" src={appState.user.profileImages.sizeX80}/>
              }
              <label className="nav-label">
                &nbsp; { appState.user ? username : "A360 Login"}
              </label>
            </NavItem>
              }

          </Nav>

        </Navbar.Collapse>

  

      </Navbar>
    )
  }
}
