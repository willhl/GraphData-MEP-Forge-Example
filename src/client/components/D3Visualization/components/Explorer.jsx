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
import deepmerge from 'deepmerge'
import { deepEquals } from '../services/utils'
import { GraphComponent } from './Graph'
import neoGraphStyle from '../graphStyle'
import { InspectorComponent } from './Inspector'
import { LegendComponent } from './Legend'
import { StyledFullSizeContainer } from './styled'
import Editor from './Editor/Editor'

const deduplicateNodes = nodes => {
  return nodes.reduce(
    (all, curr) => {
      if (all.taken.indexOf(curr.id) > -1) {
        return all
      } else {
        all.nodes.push(curr)
        all.taken.push(curr.id)
        return all
      }
    },
    { nodes: [], taken: [] }
  ).nodes
}

export class ExplorerComponent extends React.Component {
  constructor (props) {
    super(props)
    console.log("Explorer created")
    
    const graphStyle = neoGraphStyle()
    this.defaultStyle = graphStyle.toSheet()
    let relationships = this.props.relationships
    let nodes = deduplicateNodes(this.props.nodes)
    let selectedItem = ''
    if (nodes.length > parseInt(this.props.initialNodeDisplay)) {
      nodes = nodes.slice(0, this.props.initialNodeDisplay)
      relationships = this.props.relationships.filter(item => {
        return nodes.filter(node => node.id === item.startNodeId) > 0
      })
      selectedItem = {
        type: 'status-item',
        item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${
          this.props.initialNodeDisplay
        } of ${nodes.length} nodes are being displayed`
      }
    }
    if (this.props.graphStyleData) {
      const rebasedStyle = deepmerge(
        this.defaultStyle,
        this.props.graphStyleData
      )
      graphStyle.loadRules(rebasedStyle)
    }
    this.state = {
      stats: { labels: {}, relTypes: {} },
      graphStyle,
      styleVersion: 0,
      nodes,
      relationships,
      selectedItem
    }

  }

  componentDidMount () {
    console.log("Explorer created")
    const graphStyle = neoGraphStyle()
    this.defaultStyle = graphStyle.toSheet()
    let relationships = this.props.relationships
    let nodes = deduplicateNodes(this.props.nodes)
    let selectedItem = ''
    if (nodes.length > parseInt(this.props.initialNodeDisplay)) {
      nodes = nodes.slice(0, this.props.initialNodeDisplay)
      relationships = this.props.relationships.filter(item => {
        return nodes.filter(node => node.id === item.startNodeId) > 0
      })
      selectedItem = {
        type: 'status-item',
        item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${
          this.props.initialNodeDisplay
        } of ${nodes.length} nodes are being displayed`
      }
    }
    if (this.props.graphStyleData) {
      const rebasedStyle = deepmerge(
        this.defaultStyle,
        this.props.graphStyleData
      )
      graphStyle.loadRules(rebasedStyle)
    }
    this.state = {
      stats: { labels: {}, relTypes: {} },
      graphStyle,
      styleVersion: 0,
      nodes,
      relationships,
      selectedItem
    }
  }

  drawGraph(props)
  {
    const graphStyle = neoGraphStyle()
    this.defaultStyle = graphStyle.toSheet()
    let relationships = props.relationships
    let nodes = deduplicateNodes(props.nodes)
    let selectedItem = ''
    if (nodes.length > parseInt(props.initialNodeDisplay)) {
      nodes = nodes.slice(0, props.initialNodeDisplay)
      relationships = props.relationships.filter(item => {
        return nodes.filter(node => node.id === item.startNodeId) > 0
      })
      selectedItem = {
        type: 'status-item',
        item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${
          props.initialNodeDisplay
        } of ${nodes.length} nodes are being displayed`
      }
    }
    if (props.graphStyleData) {
      const rebasedStyle = deepmerge(
        this.defaultStyle,
        props.graphStyleData
      )
      graphStyle.loadRules(rebasedStyle)
    }
    let sv = this.state.styleVersion + 1
    this.setState({
      nodes: nodes,
      relationships: relationships,
      selectedItem: selectedItem,
      styleVersion: sv
    })
  }

  getNodeNeighbours (node, currentNeighbours, callback) {
    if (currentNeighbours.length > this.props.maxNeighbours) {
      callback(null, { nodes: [], relationships: [] })
    }
    this.props.getNeighbours(node.id, currentNeighbours).then(
      result => {
        let nodes = result.nodes
        if (
          result.count >
          this.props.maxNeighbours - currentNeighbours.length
        ) {
          this.setState({
            selectedItem: {
              type: 'status-item',
              item: `Rendering was limited to ${
                this.props.maxNeighbours
              } of the node's total ${result.count +
                currentNeighbours.length} neighbours due to browser config maxNeighbours.`
            }
          })
        }
        callback(null, { nodes: nodes, relationships: result.relationships })
      },
      () => {
        callback(null, { nodes: [], relationships: [] })
      }
    )
  }

  onItemMouseOver (item) {
    this.setState({ hoveredItem: item })
  }

  onItemSelect (item) {
    this.setState({ selectedItem: item })
    this.props.setSelectionInView(item)
  }

  onGraphModelChange (stats) {
    this.setState({ stats: stats })
    this.props.updateStyle(this.state.graphStyle.toSheet())
  }

  onSelectedLabel (label, propertyKeys) {
    this.setState({
      selectedItem: {
        type: 'legend-item',
        item: {
          selectedLabel: { label: label, propertyKeys: propertyKeys },
          selectedRelType: null
        }
      }
    })
  }

  onSelectedRelType (relType, propertyKeys) {
    this.setState({
      selectedItem: {
        type: 'legend-item',
        item: {
          selectedLabel: null,
          selectedRelType: { relType: relType, propertyKeys: propertyKeys }
        }
      }
    })
  }

  componentWillReceiveProps (props) {
    if (!deepEquals(props.graphStyleData, this.props.graphStyleData)) {
      if (props.graphStyleData) {
        const rebasedStyle = deepmerge(this.defaultStyle, props.graphStyleData)
        this.state.graphStyle.loadRules(rebasedStyle)
        this.setState({
          graphStyle: this.state.graphStyle,
          styleVersion: this.state.styleVersion + 1
        })
      } else {
        this.state.graphStyle.resetToDefault()
        this.setState(
          { graphStyle: this.state.graphStyle, freezeLegend: true },
          () => {
            this.setState({ freezeLegend: false })
            this.props.updateStyle(this.state.graphStyle.toSheet())
          }
        )
      }
    }
    this.setState({nodes:props.nodes, relationships:props.relationships})
    this.drawGraph(props)
  }

  OnExecuteCypher(source){
      console.log(source)
      if (cypherRunner) cypherRunner(source)
      if (this.cypherRunner) this.cypherRunner(source)
  }
  
  onInspectorExpandToggled (contracted, inspectorHeight) {
    this.setState({
      inspectorContracted: contracted,
      forcePaddingBottom: inspectorHeight
    })
  }

  shouldComponentUpdate()
  {
    return true
  }

  render () {
    // This is a workaround to make the style reset to the same colors as when starting the browser with an empty style
    // If the legend component has the style it will ask the neoGraphStyle object for styling before the graph component,
    // and also doing this in a different order from the graph. This leads to different default colors being assigned to different labels.
    var legend
    if (this.state.freezeLegend) {
      legend = (
        <LegendComponent
          stats={this.state.stats}
          graphStyle={neoGraphStyle()}
          onSelectedLabel={this.onSelectedLabel.bind(this)}
          onSelectedRelType={this.onSelectedRelType.bind(this)}
        />
      )
    } else {
      legend = (
        <LegendComponent
          stats={this.state.stats}
          graphStyle={this.state.graphStyle}
          onSelectedLabel={this.onSelectedLabel.bind(this)}
          onSelectedRelType={this.onSelectedRelType.bind(this)}
        />
      )
    }
    const inspectingItemType =
      !this.state.inspectorContracted &&
      ((this.state.hoveredItem && this.state.hoveredItem.type !== 'canvas') ||
        (this.state.selectedItem && this.state.selectedItem.type !== 'canvas'))

    return (
      <StyledFullSizeContainer
        id='svg-vis'
        className={
          Object.keys(this.state.stats.relTypes).length ? '' : 'one-legend-row'
        }
        forcePaddingBottom={
          inspectingItemType ? this.state.forcePaddingBottom : null
        }
      >

        {legend}
        <GraphComponent
          fullscreen={this.props.fullscreen}
          frameHeight={this.props.frameHeight}
          relationships={this.state.relationships}
          nodes={this.state.nodes}
          getNodeNeighbours={this.getNodeNeighbours.bind(this)}
          onItemMouseOver={this.onItemMouseOver.bind(this)}
          onItemSelect={this.onItemSelect.bind(this)}
          graphStyle={this.state.graphStyle}
          styleVersion={this.state.styleVersion} // cheap way for child to check style updates
          onGraphModelChange={this.onGraphModelChange.bind(this)}
          assignVisElement={this.props.assignVisElement}
          getAutoCompleteCallback={this.props.getAutoCompleteCallback}
          setGraph={this.props.setGraph}
        />
          
        <InspectorComponent
          fullscreen={this.props.fullscreen}
          hoveredItem={this.state.hoveredItem}
          selectedItem={this.state.selectedItem}
          graphStyle={this.state.graphStyle}
          onExpandToggled={this.onInspectorExpandToggled.bind(this)}
        />
      </StyledFullSizeContainer>
    )
  }
}

//<Editor onExecute={this.props.cypherRunner} />
