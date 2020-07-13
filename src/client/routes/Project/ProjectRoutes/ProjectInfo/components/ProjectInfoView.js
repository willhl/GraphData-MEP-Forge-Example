import { IndexLink, Link } from 'react-router'
import './ProjectInfoView.scss'
import ServiceManager from 'SvcManager'
import React from 'react'

function ThumbnailView(props){

    return(
        <img src={props.url}></img>
    )
}

function DBModel(props){

    return(
        <label src={props.name}></label>
    )
}

class ProjectInfoView extends React.Component{

    // static propTypes = {
    //     children : React.PropTypes.element.isRequired
    //   }

    constructor(props){
        super(props)
        this.derivativeSvc = ServiceManager.getService('DerivativeSvc')
        this.graphSvc = ServiceManager.getService('GraphSvc')
        this.state = props.appState.project
        this.state.projects = []
        this.updateProjects()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.appState.project.models !== this.state.models) {
            console.log(prevState)
            console.log(snapshot)
        }
    }

    async getThumbnail(urn) {
        const thumbnail = await this.derivativeSvc.getThumbnail(urn, 600)
        return thumbnail
    }

    async getProjects(){
        const models = await this.graphSvc.getProjects()
        return models
    }

    updateProjects(){
        const nmodels = this.state.projects.slice()
        this.getProjects().then(val =>{
            console.log(val)
        })
    }

    updateThumbnails(){
        this.state.models.forEach((model) => {
            this.getThumbnail(model.urn).then(val =>{
                model.thumbnail = val
                this.updateItem(model)
            })
        });
    }

    updateItem(updatedItem){
        const nmodels = this.state.models.slice()
        const objIndex = nmodels.findIndex((obj => obj.urn === updatedItem.urn))
        nmodels[objIndex] = updatedItem
        this.setState({
          models: nmodels
        })
      }

    componentDidMount(){
        this.updateThumbnails()
    }

    render(){

        const projectName = this.state.name

        return(
           <div className="project-container">
               <label>Project info for {projectName}</label>
               <div>
               {
                   this.state.projects.map((project, idx) => {
                       if(model.thumbnail){
                        return <DBModel key={idx} name={project}></DBModel>
                       }                     
                   })
               }
               </div>
               <div>{
                   this.state.models.map((model, idx) => {
                       if(model.thumbnail){
                        return <ThumbnailView key={idx} url={model.thumbnail}></ThumbnailView>
                       }                     
                   })
               }
               </div>
           </div>
        )
    }
}

export default ProjectInfoView