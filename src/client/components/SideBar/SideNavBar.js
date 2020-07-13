import { LinkContainer } from 'react-router-bootstrap'

import React from 'react'
import AboutDlg from 'Dialogs/AboutDlg'
import ServiceManager from 'SvcManager'
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import './SideNavBar.scss'
import {
    DropdownButton,
    NavDropdown,
    MenuItem,
    Button,
    Modal,
    Panel,
    } from 'react-bootstrap'
import { Link } from 'react-router';


    const BaseContainer = props =>
    <div className='sidenav-container'
        style={{
            display: 'inline-block',
            paddingBottom: 16,
            width: 200,
            ...props.style
        }}
    >
        {props.children}
    </div>;


export default class SideNavbar extends React.Component {

    constructor(props){
        super(props)

      var state = {
           selectedPath: ''
        }
    }

      navto (id, parent) {

        const basePath = `/project/${this.props.appState.project.Name}`
        const currentRouteName = this.props.router.getCurrentLocation().pathname
        if(id === 'prjName'){
            this.props.router.push(basePath)

        }else if(id === 'design'){

            const viewer = 'viewer'         
            if(basePath +"/"+ viewer != currentRouteName){
                
                let query = `?urn=${this.props.appState.project.models[0].urn}`
                this.props.router.push(basePath + `/${viewer}`+ query)
            }
        }
        else
        {

            if(basePath +"/"+ id != currentRouteName){
                this.props.router.push(basePath + `/${id}`)
            }
        }

      }


    render() {

        const projectName = this.props.params.projectName     

        const headStyle = {
            fontWeight: 'bold',
            fontSize:'15px'
        }



        return(
       <BaseContainer>
            <SideNav className="side-nav" 
            highlightBgColor='#333333' highlightColor='#ffffff' 
            defaultSelected="prjName"
            onItemSelection={(id, parent) => {this.navto(id, parent)}}>

            <Nav id='prjName'>
                <NavText style={headStyle}>{projectName}</NavText>
            </Nav>


            <Nav id='dashboard'>
                <NavIcon>
                    <img height="16" width="16" src="\resources\img\glyphicons-269-keyboard-wireless.png" />
                </NavIcon>
                <NavText>Dashboards</NavText>

            </Nav>
            <Nav id='projectinfo'>
                <NavText>Project Info</NavText>
            </Nav>
            <Nav id='design'>
                <NavText>Design</NavText>
                <Nav id='desingModels'>
                    <NavText>Models</NavText>
                </Nav>
               
                <Nav id='desingSpaces'>
                    <NavText>Spaces</NavText>
                </Nav>
                    
                <Nav id='desingSerivceZones'>
                    <NavText>Service Zones</NavText>
                </Nav>
                <Nav id='desingScheculdes'>
                    <NavText>Schedules</NavText>
                </Nav>
                <Nav id='desingSpecifications'>
                    <NavText>Specifications</NavText>
                </Nav>

            </Nav>

             <Nav id='deliverables'>
                <NavText>Deliverables</NavText>
                <Nav id='deliverablesModels'>
                    <NavText>Models</NavText>
                </Nav>
                <Nav id='deliverablesDrawings'>
                    <NavText>Drawings</NavText>
                </Nav>
                <Nav id='deliverablesDocuments'>
                    <NavText>Documents</NavText>
                </Nav>

             </Nav>

            <Nav id='simulate'>
                    <NavText>Simulate</NavText>
                    <Nav id='simulateAcoustics'>
                        <NavText>Acoustics</NavText>
                    </Nav>
                    <Nav id='simulateHc'>
                        <NavText>Heating & Cooling</NavText>
                    </Nav>
                    <Nav id='simulateVent'> 
                        <NavText>Ventilation</NavText>
                    </Nav>
                    <Nav id='simulateLoads'>
                        <NavText>Electical Loads</NavText>
                    </Nav>
                    <Nav id='simulateRainwater'>
                        <NavText>Rainwater</NavText>
                    </Nav>
                    <Nav id='simulateDrainage'>
                        <NavText>Drainage</NavText>
                    </Nav>
            </Nav>

            <Nav id='performance'>
                <NavText>Performance</NavText>
                <Nav id='performanceAccreditations'>
                    <NavText>Accreditations</NavText>
                </Nav> 
                <Nav id='performanceEnergy'>
                    <NavText>Energy</NavText>
                </Nav>                 
            </Nav>  


           
            
        </SideNav>
       </BaseContainer>

        )
    }
}
