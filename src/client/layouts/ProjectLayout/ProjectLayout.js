import ServiceManager from 'SvcManager'
//import 'forge-white.scss'
import React from 'react'
import SideNavBar from 'SideBar';
import PropTypes  from 'prop-types';

class ProjectLayout extends React.Component {

    constructor(props) {
        super(props)

        this.graphSvc = ServiceManager.getService('GraphSvc')

        if (props.params.projectName) {
            var projName = props.params.projectName
            this.props.setProject({
                Name: projName
            })
            this.setProjectState(projName)
            
        } else {
            this.props.router.push('/')
        }

    }

    static propTypes = {
        children: PropTypes.element.isRequired
    }

    // async loadModels(pName) {

    //     this.getBuckets().then(value => {
    //         value.forEach(bucket => {
    //             this.getItems(bucket.bucketKey).then((val1) => {
    //                 val1.items.forEach(ob => {

    //                     if (ob.objectKey === pName) {
    //                         let urn = Buffer(ob.objectId).toString('base64')
    //                         var newModel = {
    //                             urn: urn,
    //                             name: ob.objectKey
    //                         }
    //                         this.props.addModel(newModel.name, newModel.urn)
    //                         return
    //                     }
    //                 })
    //             })
    //         })
    //     })
    // }

    // async getBuckets() {
    //     const buckets = await this.bucketSvc.getBuckets()
    //     return buckets.body.items
    // }

    // async getItems(bucketKey) {
    //     const items = await this.bucketSvc.getBucketObjects(bucketKey)
    //     return items.body
    // }

    setProjectState(projectname){
        this.getProjectByName(projectname).then(proj =>{
            if(proj[0]){
                this.props.setProject(proj[0].properties)
            }
        })
    }

    async getProjectByName(projName){
        const project = await this.graphSvc.getProjectByName(projName)
        return project
    }


    render() {

        const { children } = this.props

        return (
            <div>
                <div className='sidebar-core-container'>
                    <div className='column left'>
                        <SideNavBar {...this.props} />
                    </div>
                    <div className='column right'>
                        <div className='core-layout'>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}

export default ProjectLayout
