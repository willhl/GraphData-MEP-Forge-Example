//////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2016 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import ReactDOM from 'react-dom'
import 'react-reflex/styles.css'
import React from 'react'
import Panel from 'Panel'
import Griddle from 'griddle-react'
import './Viewer.scss'
import autobind from 'autobind-decorator'
import BaseComponent from 'BaseComponent'

class Viewer extends BaseComponent {

  constructor () {

    super()

    this.state = {
        dataExtension: null,
        viewerPanels: [],
        viewerFlex: 1.0,
        resizing: false,
      }

  }


  ///////////////////////////////////////////////////////////////////
  // Component has been mounted so this container div is now created
  // in the DOM and viewer can be instantiated
  //
  ///////////////////////////////////////////////////////////////////
  componentDidMount () {

    this.viewerContainer = document.getElementById("ViewerContainer")
    
    this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.viewerContainer)
    this.viewer.loadDynamicExtension = this.loadDynamicExtension
    console.log("Viewer init")

    if (this.props.onViewerCreated) 
    {
      this.props.onViewerCreated(this.viewer)
    }

   
  }

  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  componentDidUpdate () {

    
    if (this.viewer && this.viewer.impl) {
      
      this.viewerContainer = document.getElementById("ViewerContainer")

      if (this.viewerContainer.offsetHeight !== this.height ||
          this.viewerContainer.offsetWidth !== this.width) {

        this.height = this.viewerContainer.offsetHeight
        this.width = this.viewerContainer.offsetWidth

        this.viewer.resize()
      }
    }
  }

  ///////////////////////////////////////////////////////////////////
  // Component will unmount so we can destroy the viewer to avoid
  // memory leaks
  //
  ///////////////////////////////////////////////////////////////////
  componentWillUnmount () {

    if (this.viewer) {

      if(this.viewer.impl.selector) {

        this.viewer.tearDown()
        this.viewer.finish()
        this.viewer = null
      }
    }
  }


  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onViewerStartResize (e) {

  
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onViewerStopResize (e) {

 
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onStopResize (e) {

   
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onResize (event) {

  
  }

  ///////////////////////////////////////////////////////////////////
  // Render component, resize the viewer if exists
  //
  ///////////////////////////////////////////////////////////////////
  render() {

    return (

        <div className="viewer" style={this.props.style} id="ViewerContainer" >
        </div>
    )
  }
    
  
}

export default Viewer
