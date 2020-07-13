
import ReactDataGrid from 'react-data-grid'
import React from 'react'
import './DataTable.scss'
import ServiceManager from 'SvcManager'




class DataTable extends React.Component {


  constructor()
  {
    super ()

    this.state = {
      data: []
    };

    this._columns = [
      {
        key: 'Name',
        name: 'Name',
        resizable: true
      }
    ];

    let rows = [];
    this.state = { rows, selectedIndexes: [] };
    this.graphSvc = ServiceManager.getService('GraphSvc')
    this.graphSvc.getSpaces().then((res) => {
      
      var nl = this.getAsArray(res)
      this.setState({rows:nl})

    })

   

    window.addEventListener('resize', this.onResize)

  }


  onResize()
  {
      var n = 1
  }

  getExternalId(dbNodeId)
  {
     

  }

  showRelatedInVeiwer()
  {
       this.props.viewer.model.getExternalIdMapping((m) => 
     {
        console.log("got id mapping")
        this.IdMapping = m
   
      this.state.selectedIndexes.forEach(rowid => {        
          var nid = this.state.rows[rowid]["NodeID"]

          this.graphSvc = ServiceManager.getService('GraphSvc')
          this.graphSvc.getRelated(nid,"IS_IN_SPACE").then((res) => {
      
          var nl = this.getAsArray(res)

          var exids = nl.map((n) => this.IdMapping[n["ExternalID"]])
          this.props.viewer.isolate(exids)
      })

     

    });

  }, () => {})  

  }

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  onRowsSelected = (rows) => {
    this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
    this.showRelatedInVeiwer();
  };

  onRowsDeselected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});

  };

  render() {
    const rowText = this.state.selectedIndexes.length === 1 ? 'row' : 'rows';
    return  (
      <div className="reactdatagrid-container">
        <ReactDataGrid
          rowKey="id"
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes
            }
          }} />
      </div>);
  }

  getAsArray(res) { 

    var nodes=[];
    var idx = 0;
      res.forEach(function (row) 
      {
        var colData = {}
        colData["id"] = idx++
        row.keys.forEach(function(key) 
        {
           if (key.toLowerCase() == "nodeid")
           {
              colData[key] = row._fields[row._fieldLookup[key]].low
           }else{
              colData[key] = row._fields[row._fieldLookup[key]]
           }
        });

        nodes.push(colData)
      });

  return nodes;

  }

}

export default DataTable;


