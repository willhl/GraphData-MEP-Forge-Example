import React from 'react';
import d3 from 'd3'
import { SizeMe } from 'react-sizeme'

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  MarkSeries,
  Hint
} from 'react-vis';

import './D3VisLineChart.scss'


//todo: scale to fit parent
//todo: multiple series per chart
//todo: 3d visuals
//todo: space > Sensor selection tree
//todo: data caching
//todo: move scale with slider, then load data
//todo: animations
const CHART_MARGINS = {left: 50, right: 10, top: 10, bottom: 80};

class D3VisLineChart extends React.Component {

    constructor () {
        super()
        console.log("D3LineChart Constructed")
        this.state = {
            value: null
          };    
    }


    componentDidMount () {
        console.log("D3 line mounted")
    }

    componentWillUnmount() {
        console.log("D3 line unmounted")
    }
    
    static _xTickFormatValue(v, i, scale, tickTotal) {
        // format axis tick with SI prefix (e.g. kWh, MWh)
        return d3.time.format("%d/%m %H:%M")(v);
      }
    
  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  initialize () {

    super.initialize()
    this.state.data = this.options.data
  }


  _rememberValue = value => {
    this.setState({value});

    if (this.props.spaceVis){
        this.props.spaceVis.updateVis(this.state.metricName, value,this.ymin, this.ymax)
    }
  };

    render () {

        console.log("D3 line rendering")
        this.state.metricName = this.props.metricName
        

        if (!this.state.data){
            this.state.data = this.props.data
        }

        if (!this.state.data){
            return (<div>No Data</div>)
        }

        this.state.dataMapped = [];
            this.state.data.forEach((data) => {
                let parsedDate = Date.parse(data.timestamp)
                if (this.xmin) {
                    this.xmin = Math.min(this.xmin, parsedDate)
                }else{ 
                    this.xmin = parsedDate
                }

                if (this.xmax) {
                    this.xmax = Math.max(this.xmax, parsedDate)   
                }else{ 
                    this.xmax = parsedDate
                }

                let yvalue = data[this.state.metricName]
                if (this.ymin) {
                    this.ymin = Math.min(this.ymin, yvalue)
                }else{ 
                    this.ymin = yvalue
                }

                if (this.ymax) {
                    this.ymax = Math.max(this.ymax, yvalue)   
                }else{ 
                    this.ymax = yvalue
                }

                this.state.dataMapped.push({"x":parsedDate, "y":yvalue});
                
            });

  
        this.state.Chartdata = {label: '', values: this.state.dataMapped}
        const {value} = this.state;
        return (
            <SizeMe monitorHeight={true}>{({ size }) =>
              <div>
                <XYPlot xType="time-utc" width={(size && size.width) ? size.width : 500} height={(size && size.height) ? size.height : 350} margin={CHART_MARGINS}    >
                <HorizontalGridLines />
                <XAxis tickLabelAngle={-45} tickFormat={D3VisLineChart._xTickFormatValue} style={{
  title: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600, fontSize:20},
  line: {stroke: '#ADDDE1'},
  ticks: {stroke: '#ADDDE1'},
  text: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600}}} />

                <YAxis title={this.state.metricName} style={{
  title: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600, fontSize:20},
  line: {stroke: '#ADDDE1'},
  ticks: {stroke: '#ADDDE1'},
  text: {stroke: 'none', fill: '#FFFFFF', fontWeight: 600}}} />

                <LineSeries onNearestX={this._rememberValue} data={this.state.dataMapped} animation={true}  />
                {value ? (
                    <LineSeries
                        data={[{x: value.x, y: value.y}, {x: value.x, y: this.ymax  }]}
                        stroke="black"
                    />
                ) : null}
                {value ? (
                    <Hint
                        value={value}
                        align={{horizontal: Hint.ALIGN.AUTO, vertical: Hint.ALIGN.TOP_EDGE}}>
                        <div className="rv-hint__content">{`(${d3.time.format('%d/%m %H:%M')(new Date(value.x))}, ${value.y ? Math.round(value.y) : 'none'})`}</div>
                    </Hint>
                ) : null}
                </XYPlot>
             </div>}</SizeMe>
        );
    }
}

export default D3VisLineChart
//export default ResponsiveWrapper(D3LineChart)