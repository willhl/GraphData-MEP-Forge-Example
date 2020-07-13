import { IndexLink, Link } from 'react-router'
import './ProjectHomeView.scss'
import SideNavBar from 'SideBar';
import ServiceManager from 'SvcManager'
import React from 'react'
import { Router } from 'react-router';

import {
    DropdownButton,
    NavDropdown,
    MenuItem,
    NavItem,
    Navbar,
    Button,
    Modal,
    Nav,
    Span
    } from 'react-bootstrap'


class ProjectHomeListComponant extends React.Component {

    render() {
        const teamname = this.props.team.name
        return (
            <div className='home-list'>
                <label>{teamname}</label>
                <div>{
                    this.props.team.members.map((member, idx) => {
                        return (
                            <div key={idx}>
                                <label className="mlabel">{member.FullName}</label>
                            </div>

                        )
                    })
                }

                </div>
            </div>
        )
    }
}

class ProjectHomeModelComponant extends React.Component{
    render(){

    }
}


class ProjectHomeView extends React.Component {

    constructor(props) {
        super(props)

        this.graphSvc = ServiceManager.getService('GraphSvc')
        this.bucketSvc = ServiceManager.getService('BucketSvc')
        this.derivativeSvc = ServiceManager.getService('DerivativeSvc')
        this.state = {
            projectid: props.appState.project.id,
            projectname: props.appState.project.Name,
            teams: [],
            derivativeModels: []
        }


    }

     getMembers(projectId) {
        const members = this.graphSvc.getTeamMembers(projectId)
        return members
    }

    getModels(projectId) {
        const models = this.graphSvc.getModels(projectId)
        return models
    }

    async getThumbnail(urn) {
        const res = await Promise.all([
            this.derivativeSvc.getThumbnail(urn, 100),
            this.derivativeSvc.getManifest(urn)
        ])
        return res
    }

    componentDidMount() {
        this.refreshTeammembers()
        this.fetchModels()
    }

    fetchModels(){
        this.getModels(this.state.projectid).then(val =>{

            val.map(v => Promise.all([
                this.derivativeSvc.getThumbnail(v.properties.URN, 100),
                this.derivativeSvc.getManifest(v.properties.URN),
                v.properties.URN
            ])
            .then(data => this.addModelToState(data[0], data[1], data[2])))
        })
        //console.log(m)
    }

    addModelToState(tnail, manifest, urn){

        const derivs = this.state.derivativeModels.slice()

        const derivative = manifest.body.derivatives.find(deriv => {
            return deriv.outputType === "svf"
        })
       const nd ={
           urn: urn,
           derivativeName: derivative.name,
           thumbnail: tnail,
       }

       if(derivs.find(d => d.urn === urn)===undefined){
        this.setState({
            derivativeModels: derivs.concat(nd)
        })
       }



       
    }

    testClick(){
        this.fetchModels()
    }

    testClick2(){
        this.getMembers(this.state.projectid).then(val =>{
            return(val.map(v => ({user:v.user.properties, team:v.team.properties})))
        }).then(val2 =>{
            console.log(val2)
        })
    }


    refreshTeammembers() {
        const projId = this.props.appState.project.id
        if (projId) {
            var newteams = []
            this.graphSvc.getTeamMembers(projId).then(response => {
                response.forEach(pers => {
                    const teamname = pers.team.properties.Name

                    var team = newteams.find(e => { if (e.name === teamname) { return e } })

                    if (!team) {
                        var newTeam = {
                            name: teamname,
                            members: []
                        }
                        team = newTeam
                        newteams.push(newTeam)
                    }
                    team.members.push(pers.user.properties)
                });
                //console.log(newteams)
                this.setState({ teams: newteams })
            })

            // this.getModels(projId).then(values => {
            //     console.log("Get Models")
            //     console.log(resp)
            //     var newmodels = []
            //     resp.forEach(mod => {
            //         this.getThumbnail(mod.properties.URN).then(thumb => {
            //             const newModel = {
            //                 urn: mod.properties.URN,
            //                 thumbnail: thumb
            //             }
            //             newmodels.push(newModel)
            //             this.setState({
            //                 derivativeModels: newmodels
            //             })
            //         })
            //     })
            // })
        }
    }

    componentDidUpdate(prevProps, prevState) {

        const project = this.props.appState.project
        if (project.id) {
            if (!prevState.projectid || prevState.projectid != project.id) {
                this.setState(
                    {
                        projectid: project.id,
                        projectname: project.Name
                    }
                )
                this.refreshTeammembers(project.id)
                this.state.derivativeModels =[];
                this.fetchModels()
                console.log(prevProps)
                console.log(prevState)
            }
        }

    }



    render() {
        console.log("Render Project Home View...")
        const projectname = this.props.appState.project.Name

        return (
            <div>
                <h3>{projectname}</h3>
                <div className="projecthome-container">
                    
                    <div className="projecthome-column left">
                        <h4>Project Team</h4>
                        {
                            this.state.teams.map((team, idx) => {
                                return (
                                    <ProjectHomeListComponant key={idx} team={team}></ProjectHomeListComponant>
                                )
                            })
                        }
                    </div>

                    <div className="projecthome-column right">
                        <h4>Models</h4>
                        <div>
                            {
                                this.state.derivativeModels.map((derivative, idx) => {
                                    const loc = this.props.location.pathname
                                    const viewloc = `${loc}/viewer?urn=${derivative.urn}`
                                    console.log(viewloc)
                                    return (
                                        <Link key={idx} className="phome-link" to={viewloc}>
                                        <div className="project-home-model" >
                                            <label className="mlabel">{derivative.derivativeName}</label>
                                            <img className='url-thumbnail' src={derivative.thumbnail}></img>
                                        </div>
                                        </Link>

                                    )
                                })

                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProjectHomeView