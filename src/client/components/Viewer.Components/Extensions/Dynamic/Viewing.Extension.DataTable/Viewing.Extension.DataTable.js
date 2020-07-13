/////////////////////////////////////////////////////////
// Viewing.Extension.Database.Table
// by Philippe Leefsma, September 2017
//
/////////////////////////////////////////////////////////
import MultiModelExtensionBase from '../../MultiModelExtensionBase/Viewer.MultiModelExtensionBase'
import './Viewing.Extension.DataTable.scss'
import WidgetContainer from 'WidgetContainer'
import ServiceManager from 'SvcManager'
import throttle from 'lodash/throttle'
import React from 'react'
import Griddle from 'griddle-react'

class DataTableExtension extends MultiModelExtensionBase {

  /////////////////////////////////////////////////////////
  // Class constructor
  //
  /////////////////////////////////////////////////////////
  constructor (viewer, options) {

    super (viewer, options)

    this.onStopResize = this.onStopResize.bind(this)
    this.onResize = throttle(this.onResize, 250)
    this.graphSvc = ServiceManager.getService('GraphSvc')
    this.react = options.react
  }

  
  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  get className() {

    return 'datatable'
  }

  /////////////////////////////////////////////////////////
  // Extension Id
  //
  /////////////////////////////////////////////////////////
  static get ExtensionId() {

    return 'Viewing.Extension.DataTable'
  }

  /////////////////////////////////////////////////////////
  // Load callback
  //
  /////////////////////////////////////////////////////////
  load () {

   // this.react.pushRenderExtension(this)
    console.log('Viewing.Extension.DataTable loaded')
    
    
    window.addEventListener(
      'resize', this.onStopResize)

      Render()

    return true
  }

  /////////////////////////////////////////////////////////
  // Unload callback
  //
  /////////////////////////////////////////////////////////
  unload () {

    console.log('Viewing.Extension.Database.Table unloaded')

    super.unload ()

    return true
  }

 
  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onSelectItem (item, propagate) {

    if (item) {

      

    } else {

    }

    this.react.setState({
      selectedItem: item
    })

}

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  async onModelCompletedLoad () {

    
  }

  
  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  renderTitle () {

    return (
      <div className="title">
        <label>
          Spaces
        </label>
      </div>
    )
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onResize () {

    this.react.setState({
      guid: this.guid()
    })
  }


  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onStopResize () {

    const state = this.react.getState()

    this.react.setState({
      guid: this.guid()
    })
  }


  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  renderContent () {

    const {guid, items, selectedItem} =
      this.react.getState()

    const showLoader = !items.length

    return (
      <div className="content" width="200" >
       <Griddle />
      </div>
    )
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render (opts = {showTitle: true}) {

    return (
      <WidgetContainer
        renderTitle={() => this.renderTitle(opts.docked)}
        showTitle={opts.showTitle}
        className={this.className}>

        { this.renderContent() }

      </WidgetContainer>
    )
  }


}

Autodesk.Viewing.theExtensionManager.registerExtension(
    DataTableExtension.ExtensionId,
    DataTableExtension)
