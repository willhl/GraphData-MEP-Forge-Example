import { IndexLink, Link } from 'react-router'
import React from 'react'
import ServiceManager from 'SvcManager'
import './HomeView.scss'

class HomeView extends React.Component {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor(props) {

    super(props)

    this.bucketSvc = ServiceManager.getService('BucketSvc')
    this.derivativeSvc = ServiceManager.getService('DerivativeSvc')
    this.graphSvc = ServiceManager.getService('GraphSvc')

    this.state = {
      projects: [],
      user: props.appState.user
    }

  }

  refreshProjects(user) {
    this.getProjects(user).then(value => {
      var newprojects = []
      var i = 0
      value.forEach(element => {


        switch (i) {
          case 0: {
            element.thumbnail = 'resources/img/square.PNG'
          }
            break;
          case 1: {
            element.thumbnail = 'resources/img/hexagon.PNG'
          }
            break;
          default: {
            element.thumbnail = 'resources/img/circle.PNG'
            i = 0
          }

        }
        i = i + 1
        newprojects.push(element)
      });

      this.setState({
        projects: newprojects
      })
    })
  }

  componentDidMount(){
    const user = this.props.appState.user
    if(user){
      this.setState({
        user: this.props.appState.user
      })
      this.refreshProjects(user)
    }
  }


  componentDidUpdate(prevProps, prevState) {

    const user = this.props.appState.user

    if (user) {
      if (!prevState.user || prevState.user.userId != user.userId) {
        this.setState({
          user: this.props.appState.user
        })
        this.refreshProjects(user)
      }
    }

  }


  async getProjects(user) {
    const userName = `${user.firstName} ${user.lastName}`
    const projects = await this.graphSvc.getUserProjects(userName)
    return projects
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  render() {

    var welcomestring = ""
    if (this.state.user) {
      welcomestring =`Welcome ${this.state.user.firstName} ${this.state.user.lastName}`
    } else {
      welcomestring = "Please log in"
    }

    console.log("Rendering home...")

    return (
      <div className="home">
        <div className='home-banner'>
          <img className='logo-hero' src='resources/img/hl-home-banner.jpg' />
        </div>
        <div className="models">
          <div className="title">
            {welcomestring}
          </div>
          <div className="content responsive-grid">
            {
              this.state.projects.map((project, idx) => {

                let modelname = project.properties.Name

                return (

                  <Link key={idx} to={{ pathname: `/project/${modelname}` }}>
                    <figure>
                      <figcaption>
                        {modelname}
                      </figcaption>

                      {
                        <img className={'url-thumbnail'}
                          src={project.thumbnail} />
                        /* <img className={project.thumbnailClass || 'default-thumbnail'}
                        src={project.thumbnail || ''} /> */
                      }
                    </figure>
                  </Link>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default HomeView
























































