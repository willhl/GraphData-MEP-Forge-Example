import { Graph } from 'react-d3-graph';
import React from 'react'
import ServiceManager from 'SvcManager'
import TheSvcManager from '../../../server/api/services/SvcManager';
import './GraphViewer.scss'

// graph payload (with minimalist structure)
const data = {
    nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
    links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
};
 
// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: 'lightgreen',
        size: 120,
        highlightStrokeColor: 'blue'
    },
    link: {
        highlightColor: 'lightblue'
    }
};
 

class GraphViewer extends React.Component {

constructor()
{
  super ()


  this.handleChange = this.handleChange.bind(this);

  this.state = {data:data,query:""}

  this.graphSvc = ServiceManager.getService('GraphSvc')
  this.graphSvc.getShortestPath().then((res) => {    
   this.setState({data:res})

   this.state.data.nodes.forEach(n => {        
        this.graphSvc.getExternalId(n.id).then((res) => {
        var rs = res[0]
        n.ExternalID = rs._fields[0]
    
    });
  });

});

}


idIndex(a,id) {
    for (var i=0;i<a.length;i++) {
      if (a[i].id == id) return i;}
    return null;
  }
  
  getAsD3(res){
  
    var nodes=[], links=[];
  
  res.results[0].data.forEach(function (row) {
     row.graph.nodes.forEach(function (n) {
       if (idIndex(nodes,n.id) == null)
         nodes.push({id:n.id,label:n.labels[0],title:n.properties.name});
     });
  
     links = links.concat( row.graph.relationships.map(function(r) {
       return {start:idIndex(nodes,r.startNode),end:idIndex(nodes,r.endNode),type:r.type};
     }));
  
  });
  
  viz = {nodes:nodes, links:links};
  
  }

  showRelatedInVeiwer()
  {
       this.props.viewer.model.getExternalIdMapping((m) => 
     {
        console.log("got id mapping")
        this.IdMapping = m
        var exids = []

        var exids = this.state.data.nodes.map((n) => this.IdMapping[n.ExternalID])

      this.props.viewer.isolate(exids)

    });


  }

  
// graph event callbacks
onClickNode = (nodeId) => {
    this.props.viewer.model.getExternalIdMapping((m) => 
    {
       console.log("got id mapping")
       this.IdMapping = m
       var exids = []

       var exids = this.state.data.nodes.map((n) => this.IdMapping[n.ExternalID])

     this.props.viewer.isolate(exids)

   });
};
 
onMouseOverNode = function(nodeId) {
    //window.alert(`Mouse over node ${nodeId}`);
};
 
onMouseOutNode = function(nodeId) {
   // window.alert(`Mouse out node ${nodeId}`);
};
 
onClickLink = function(source, target) {
   //window.alert(`Clicked link between ${source} and ${target}`);
};
 
onMouseOverLink = function(source, target) {
   // window.alert(`Mouse over in link between ${source} and ${target}`);
};
 
onMouseOutLink = function(source, target) {
   // window.alert(`Mouse out link between ${source} and ${target}`);
};

onClickRun = function(source, target) {
  // window.alert(`Mouse out link between ${source} and ${target}`);
};


handleChange(event) {
  this.setState({query: event.target.value});
}


    render ()
    {
        const data  = this.state.data
        return ( 

          <div>
          <div className="Graph-Query-panel">
            <form>
            <label >
          Query:
          <textarea  value={this.state.query} onChange={this.handleChange} />
          <button type="button" onclick={this.onClickRun}>Run</button>
        </label>
            </form>
            </div>
<div>      
<Graph
    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
    data={data}
    config={myConfig}
    onClickNode={this.onClickNode}
    onClickLink={this.onClickLink}
    onMouseOverNode={this.onMouseOverNode}
    onMouseOutNode={this.onMouseOutNode}
    onMouseOverLink={this.onMouseOverLink}
    onMouseOutLink={this.onMouseOutLink}
        /></div>
        
       </div>
            );
    }
}

export default GraphViewer;