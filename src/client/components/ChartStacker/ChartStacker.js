
import React from 'react'
import ServiceManager from 'SvcManager'
import D3VisLineChart from "../D3VisCharts"
//import StackGrid from "react-stack-grid";
//import { Grid, Column, Row } from "react-awesome-grid";
//import { emitKeypressEvents } from 'readline';
//import { CSSTransitionGroup } from 'react-transition-group' 
import numeral  from 'numeral'
import './ChartStacker.scss'
import Rainbow from './RainbowVis.js'
import { IoMdRefresh } from "react-icons/io";


class ChartStacker extends React.Component {

    constructor () {
        super()
        console.log("ChartStacker Constructed")
        this.state =  {
        charts: {}, 
        headerText:"-no space-",
        Current: new Date(),
        Start: new Date(),
        End: new Date(),}

        this.sensorDataSvc = ServiceManager.getService('SensorDataSvc')
        this.refs = {}
    }

    updateCharts (sensorInsance){
        let dlkey = sensorInsance.dataUri + sensorInsance.dataMetricName
        if (this.state.charts[dlkey])
        {
            let skv = this.state.charts[dlkey]
            skv.ref.current.setState({data:sensorInsance.currentData})
        }


    }

    shouldComponentUpdate(props, state){

        if (this.state.spaceData && state.spaceData && this.state.spaceData.Name != state.spaceData.Name) return true;

        if (this.state.headerText != state.headerText) return true

        if (this.state.start == state.start && this.state.end == state.end) return false
        
        this.loadData()
        return false

    }



    loadData(){
        console.log("loading data")
        for (let dataUri in this.refs)
        {
            let refs = this.refs[dataUri]
            this.sensorDataSvc.getDataForDateRange(dataUri, this.state.start, this.state.end, 30).then(data => {
                refs.forEach(ref => {
                    ref.sensorInstance.currentData = data
                    ref.sensorInstance.loading = false;
                    if (ref.vsref.current){
                        ref.vsref.current.setState({data:data})
                    }
                })
                
            })
        }


    }


    updateVis(metric, value, min, max){
    
        if (this.props.viewerView){

            var rainbow = new Rainbow();
            var color = rainbow.colourAt(value.y)

            this.props.viewerView.renderSpaceColour(this.state.spaceData.Number, "#" + color)
        }

    }

    clearVisuals(){

            this.props.viewerView.clearVisuals()
    }

    cheChanged(ch){

       
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(value)
    }

    render () {

        console.log("ChartStacker render")
        
        var headerText = this.state.headerText

        if (!this.state.ActiveDataSources){
            this.state.ActiveDataSources = this.props.ActiveDataSources
        }

        let lcharts = []
        this.refs = {}
        for(let dataSourceKey in this.state.ActiveDataSources){
              let sensorInstanceKeys = this.state.ActiveDataSources[dataSourceKey]
              for(let sikey in sensorInstanceKeys){
                let sensorInsance = sensorInstanceKeys[sikey]
                let dlkey = dataSourceKey + sikey
                let vsref = React.createRef()
                lcharts.push(<li><D3VisLineChart spaceVis={this} data={sensorInsance.currentData ? sensorInsance.currentData : []} metricName={sensorInsance.Data_Metric_Name} key={dlkey} ref={vsref}/></li>)
                this.state.charts[dlkey] = {si:sensorInsance, ref:vsref}
                
                    if (!this.refs[sensorInsance.Data_URI]){
                       this.refs[sensorInsance.Data_URI]  = []
                    }
                    this.refs[sensorInsance.Data_URI].push({vsref:vsref, sensorInstance:sensorInsance, loading:false})
                   
               }
        }
         
        this.loadData()
        
          return (
              <div>

                    <div class="input-controls">
                        <button type="button" className="btn btn-default btn-circle" onClick={this.clearVisuals.bind(this)}><IoMdRefresh size={15} /></button>
                        <div class="input-container">
                        <span class="input-titles">Visulaise</span>
                        <label class="switch">
                            <input type="checkbox" onChange={this.cheChanged.bind(this)} value={this.state.isch}></input>
                            <span class="slider round"></span>
                        </label>
                        </div>

                        <div class="input-container">
                        <span class="input-titles">All Spaces</span>
                        <label class="switch">
                            <input type="checkbox" onChange={this.cheChanged.bind(this)} value={this.state.isch}></input>
                            <span class="slider round"></span>
                        </label>
                        </div>                   
                   </div>

                    <div className="chartstacker-header">
                        {this.state.spaceData ?
                        (   <div>
                            {this.state.spaceData.Name} <br></br>
                            {numeral(this.state.spaceData.Area).format('0')  + ' m2, ' + numeral(this.state.spaceData.Volume).format('0')  + ' m3'}
                            </div>
                        ) : <div>{headerText}</div>}
                    </div>
                    
                    <div>
                        {lcharts}
                    </div>
                </div>
          )
       }

}


export default ChartStacker