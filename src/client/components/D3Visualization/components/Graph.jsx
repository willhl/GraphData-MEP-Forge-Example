/*
 * Copyright (c) 2002-2018 "Neo4j, Inc"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { createGraph, mapRelationships, getGraphStats } from '../mapper'
import { GraphEventHandler } from '../GraphEventHandler'
import '../lib/visualization/index'
//import { dim } from 'browser-styles/constants'
import { StyledZoomHolder, StyledSvgWrapper, StyledZoomButton } from './styled'
//import { ZoomInIcon, ZoomOutIcon } from 'browser-components/icons/Icons'
import graphView from '../lib/visualization/components/graphView'
import SVGInline from 'react-svg-inline'
import { ZoomInIcon, ZoomOutIcon } from './icons/Icons'
import ReactDOM from 'react-dom'

export class GraphComponent extends Component {
  state = {
    zoomInLimitReached: false,
    zoomOutLimitReached: false,
    shouldResize: false,
    nodes: []
  }

  graphInit (el) {
    this.svgElement = el
  }

  zoomInClicked (el) {
    let limits = this.graphView.zoomIn(el)
    this.setState({
      zoomInLimitReached: false,
      zoomOutLimitReached: false
    })
  }

  zoomOutClicked (el) {
    let limits = this.graphView.zoomOut(el)
    this.setState({
      zoomInLimitReached: false,
      zoomOutLimitReached: false
    })
  }

 /* getVisualAreaHeight () {
    return this.props.frameHeight && this.props.fullscreen
      ? this.props.frameHeight -
          (dim.frameStatusbarHeight + dim.frameTitlebarHeight * 2)
      : this.props.frameHeight - dim.frameStatusbarHeight ||
          this.svgElement.parentNode.offsetHeight
  }*/


  
  getVisualAreaHeight () {
    return this.props.frameHeight && this.props.fullscreen
      ? this.props.frameHeight -
          (100 + 100 * 2)
      : this.props.frameHeight - 100 ||
          this.svgElement.parentNode.offsetHeight
  }

  componentDidMount () {
    if (this.svgElement != null) {
      this.initGraphView()
      this.graph && this.props.setGraph && this.props.setGraph(this.graph)
      this.props.getAutoCompleteCallback &&
        this.props.getAutoCompleteCallback(this.addInternalRelationships)
      this.props.assignVisElement &&
        this.props.assignVisElement(this.svgElement, this.graphView)
    }
  }

  initGraphView () {
    if (!this.graphView) {
      let NeoConstructor = graphView
      let measureSize = () => {
        return {
          width: this.svgElement.offsetWidth,
          height: this.getVisualAreaHeight()
        }
      }
      this.graph = createGraph(this.props.nodes, this.props.relationships)
      this.graphView = new NeoConstructor(
        this.svgElement,
        measureSize,
        this.graph,
        this.props.graphStyle
      )
      this.graphEH = new GraphEventHandler(
        this.graph,
        this.graphView,
        this.props.getNodeNeighbours,
        this.props.onItemMouseOver,
        this.props.onItemSelect,
        this.props.onGraphModelChange
      )
      this.graphEH.bindEventHandlers()
      this.props.onGraphModelChange(getGraphStats(this.graph))
      this.graphView.resize()
      this.graphView.update()
    }
  }

  addInternalRelationships = internalRelationships => {
    if (this.graph) {
      this.graph.addInternalRelationships(
        mapRelationships(internalRelationships, this.graph)
      )
      this.props.onGraphModelChange(getGraphStats(this.graph))
      this.graphView.update()
      this.graphEH.onItemMouseOut()
    }
  }

  componentWillReceiveProps (props) {
    if (props.styleVersion !== this.props.styleVersion) {
      this.graphView.update()
      //this.graphView.resetGraph()
      this.setState({ nodes:this.props.nodes}, () =>{this.forceUpdate()   })
      //this.forceUpdate()
      console.log("grpah update")
    }
    if (
      this.props.fullscreen !== props.fullscreen ||
      this.props.frameHeight !== props.frameHeight
    ) {
      this.setState({ shouldResize: true })
    } else {
      this.setState({ shouldResize: false })
    }


  }

  componentDidUpdate () {
    if (this.state.shouldResize) {
      this.graphView.resize()
    }
  }

  zoomButtons () {
    if (this.props.fullscreen) {
      return (
        <StyledZoomHolder>
          <StyledZoomButton
            className={'zoom-in'}
            onClick={this.zoomInClicked.bind(this)}
          >
         <SVGInline svg={slZoomInIconSvgRaw} />
          </StyledZoomButton>
          <StyledZoomButton
            className={'zoom-out'}
            onClick={this.zoomOutClicked.bind(this)}
          >
           <SVGInline svg={slZoomOutIconSvgRaw} />
          </StyledZoomButton>
        </StyledZoomHolder>
      ) 
    }
    return null
  }

  render () {
    return (
      <StyledSvgWrapper ref="exprefgraph" >
        <svg className='neod3viz' ref={this.graphInit.bind(this)} />
        {this.zoomButtons()}
      </StyledSvgWrapper>
    )
  }
}


const slZoomOutIconSvgRaw =  '<glyph glyph-name="zoom-out" unicode="&#39;" d="M509 18l-192 192c0 0 0 0 0 0 28 32 46 74 46 121 0 100-82 181-182 181-100 0-181-81-181-181 0-100 81-182 181-182 47 0 89 18 121 46 0 0 0 0 0 0l192-192c2-2 5-3 7-3 3 0 6 1 8 3 4 4 4 11 0 15z m-328 153c-88 0-160 71-160 160 0 88 72 160 160 160 89 0 160-72 160-160 0-89-71-160-160-160z m75 170l-149 0c-6 0-11-4-11-10 0-6 5-11 11-11l149 0c6 0 11 5 11 11 0 6-5 10-11 10z"/>'

const slZoomInIconSvgRaw = '<glyph glyph-name="zoom-in" unicode="&#38;" d="M509 18l-192 192c0 0 0 0 0 0 28 32 46 74 46 121 0 100-82 181-182 181-100 0-181-81-181-181 0-100 81-182 181-182 47 0 89 18 121 46 0 0 0 0 0 0l192-192c2-2 5-3 7-3 3 0 6 1 8 3 4 4 4 11 0 15z m-328 153c-88 0-160 71-160 160 0 88 72 160 160 160 89 0 160-72 160-160 0-89-71-160-160-160z m75 170l-64 0 0 64c0 6-5 11-11 11-6 0-10-5-10-11l0-64-64 0c-6 0-11-4-11-10 0-6 5-11 11-11l64 0 0-64c0-6 4-11 10-11 6 0 11 5 11 11l0 64 64 0c6 0 11 5 11 11 0 6-5 10-11 10z"/>  '