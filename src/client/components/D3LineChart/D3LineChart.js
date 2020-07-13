import React from 'react'
import * as d3c from 'react-d3-components'
import './D3LineChart.scss'
import ResponsiveWrapper from './ResponsiveWrapper.jsx'

//todo: scale to fit parent
//todo: multiple series per chart
//todo: 3d visuals
//todo: space > Sensor selection tree
//todo: data caching
//todo: move scale with slider, then load data
//todo: animations
//todo: kernal smoothing 1day option

class D3LineChart extends React.Component {

    constructor () {
        super()
        console.log("D3LineChart Constructed")
        this.state =  {}
    }


    componentDidMount () {
        console.log("D3 line mounted")
    }

    componentWillUnmount() {
        console.log("D3 line unmounted")
    }
    
  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  initialize () {

    super.initialize()
    this.state.data = this.options.data
  }

    render () {

        console.log("D3 line rendering")
        this.state.metricName = this.props.metricName
        

        if (!this.state.data){
            this.state.data = this.props.data
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
        this.state.xScale = d3.time.scale().domain([this.xmin, this.xmax]).range([0, 10])
        this.state.yScale = d3.time.scale().domain([this.ymin, this.ymax]).range([0, 20])
       
        return (
          <d3c.LineChart data={this.state.Chartdata} className="d3lineChat-Canvas" width={600} height={500}  margin={{top: 10, bottom: 50, left: 50, right: 20}}  xAxis={{tickFormat: d3.time.format("%m/%d")}}/>
        );
    }


}

export default D3LineChart
//export default ResponsiveWrapper(D3LineChart)