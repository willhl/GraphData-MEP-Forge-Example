import ReactPanelContent from './ReactPanelContent'
import ReactDOM from 'react-dom'
import './ReactPanel.scss'
import React from 'react'

export default class ReactPanel extends Autodesk.Viewing.UI.DockingPanel {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor (viewer, options, content) {

    super (viewer.container, options.id, options.title, {
      addFooter: options.AddFooter,
      viewer
    })

    this.content = content;
    this.container.classList.add('react-docking-panel')
    this.DOMContent = document.createElement('div')
    this.DOMContent.className = 'content docking-panel-scroll'
    this.container.appendChild(this.DOMContent)
    this.ChildContent = null 
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  initialize () {

    super.initialize()
    this.viewer = this.options.viewer
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  setVisible (show) {

   super.setVisible(show)

    if (show) {

      this.ChildContent = ReactDOM.render(this.content, this.DOMContent)
      console.log("setting viewer")
    } else if (this.ChildContent) {

      ReactDOM.unmountComponentAtNode(this.DOMContent)

      this.ChildContent = null  
    }
  }

}