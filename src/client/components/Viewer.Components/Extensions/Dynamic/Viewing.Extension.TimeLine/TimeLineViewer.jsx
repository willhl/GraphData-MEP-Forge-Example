import React from 'react'
import Timeline from 'react-visjs-timeline'
import PlayPauseButton from '../../../../PlayPauseButton'
import './TimeLineViewer.scss' // in conjunction with webpack's style-loader

class TimeLineViewer extends React.Component {

    constructor () {
        super()
        console.log("Rendering Contructed")
        this.isPlaying = false
    }


    onPlaybackChange(playback)
    {
     
      this.isPlaying = playback;
      console.log("is playing: " + this.isPlaying )
    }

    onRangeChanged(props)
    {
      console.log("Range changed")
      if (this.props.onCurrentTimeChanged) 
      {
        this.props.onCurrentTimeChanged(props)
      }
    }

    onPlayPause(isplaying)
    {
      this.isPlaying = isplaying
    }

    render () {

      let height = this.props.height;

      console.log("Rendering timeline")  
        // http://visjs.org/docs/timeline/#Configuration_Options
        const options = { 
          options : {
            max: '2019-12-31',
            min: '2018-10-01',
            width: '100%',
            height: 70,
            stack: true,
            showMajorLabels: true,
            showCurrentTime: true,
            zoomable: true,
            moveable: true,
            editable: {
              add: false,         // add new items by double tapping
              updateTime: true,  // drag items horizontally
              updateGroup: false, // drag items from one group to another
              remove: false,       // delete an item by tapping the delete button top right
              overrideItems: false  // allow these options to override item.editable
            },
            type: 'background',
            format: {
              minorLabels: {
                millisecond:'SSS',
                second:     's',
                minute:     'HH:mm',
                hour:       'HH:mm',
                weekday:    'ddd D',
                day:        'D',
                week:       'w',
                month:      'MMM',
                year:       'YYYY'
              },
              majorLabels: {
                millisecond:'HH:mm:ss',
                second:     'D MMMM HH:mm',
                minute:     'ddd D MMMM',
                hour:       'ddd D MMMM',
                weekday:    'MMMM YYYY',
                day:        'MMMM YYYY',
                week:       'MMMM YYYY',
                month:      'YYYY',
                year:       ''
              }
            }
         },
          items: [
            {id: 1, content: 'April', start: '2019-05-01', end: '2019-05-22'}
            ]
        }

        return (
          <div>
          <div className="btn-container">
              <PlayPauseButton onPlayPause={this.onPlayPause.bind(this)} isEnabled={true} isPlaying={this.isPlaying}/>
          </div>

          <Timeline {...options} rangechangedHandler={(props) => this.onRangeChanged(props)}/>

        </div>
        )
      }

}

export default TimeLineViewer