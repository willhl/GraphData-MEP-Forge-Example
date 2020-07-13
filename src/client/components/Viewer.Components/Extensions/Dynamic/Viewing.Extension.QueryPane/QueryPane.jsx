
import React from 'react'
import Editor from '../../../../D3Visualization/components/Editor/Editor'
import ReactPanel from '../Viewing.Extension.ReactPanel/ReactPanel'
import Neo4jGraphViewer from "../Viewing.Extension.Neo4jGraph/Neo4jGraphViewer"

class QueryPane extends React.Component {

    constructor () {

        super()
    }

    cypherRunner(query)
    {
        this.viewer = this.props.viewer
        this.viewerView = this.props.viewerView
        let panel = new ReactPanel(this.viewer, {id:'react-panel-id', title:'Graph'}, <Neo4jGraphViewer viewer={this.viewer} viewerView={this.viewerView} query={query} result={[]} autoComplete={true} maxNeighbours={50} initialNodeDisplay={1000}/>)
        panel.setVisible(true)

    }



    render () {

        this.viewer = this.props.viewer

        return (
       <Editor onExecute={this.cypherRunner.bind(this)} />

        )
      }

}

export default QueryPane