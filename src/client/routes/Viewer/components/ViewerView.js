import Viewer from 'Viewer'
import './ViewerView.scss'
import React from 'react'
import 'react-reflex/styles.css'
import autobind from 'autobind-decorator'
import ServiceManager from 'SvcManager'
import ReactPanel from '../../../components/Viewer.Components/Extensions/Dynamic/Viewing.Extension.ReactPanel/ReactPanel'
import QueryPane from  '../../../components/Viewer.Components/Extensions/Dynamic/Viewing.Extension.QueryPane'
import TimeLineViewer from '../../../components/Viewer.Components/Extensions/Dynamic/Viewing.Extension.TimeLine'
//import D3LineChart from "../../../components/D3LineChart"
//import D3VisLineChart from "../../../components/D3VisCharts"
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
//import StackGrid from "react-stack-grid";
import ChartStacker from "../../../components/ChartStacker"
//import { SizeMe } from 'react-sizeme'
import './three-octree'
import { debounce } from "debounce";
//import { CSSTransitionGroup } from 'react-transition-group' 


class ViewerView extends React.Component {

   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////
   constructor () {

      super ()

      this.state = {
        isVisible: true,
        IsPlaying: false,
        Current: new Date(),
        Start: new Date(),
        End: new Date(),
        ActiveDataSources: {},
        currentSpaceData: {}
      }

      this.chartstacker = React.createRef()

      this.dataSvc = ServiceManager.getService('SensorDataSvc')
      this.buildingGraphSvc =  ServiceManager.getService('BuildingGraphSvc')

      this.onSelectionChanged = this.onSelectionChanged.bind(this);


    //to create a material with specific prefix
    this._customMaterialPrefix = 'forge-material-face-';
    //to create a overlay that renders the shader faces
    this._overlaySceneName = "overlay-room-geometry";
    //store rooms info of this specific floor
    this._specific_Floor_Rooms_Array = [];
 
    this._spaceGeoIds = []
    this._materialArray = {}; 
    
     // for hide/show shader faces
     //store all textures of the shader face
     this._oldTextures = new Array();
     //store all color of the shader face
     this._oldColors = new Array();

     


   }

   /////////////////////////////////////////////////////////
   // Initialize viewer environment
   //
   /////////////////////////////////////////////////////////
   initialize (options) {

      return new Promise((resolve, reject) => {

        Autodesk.Viewing.Initializer (options, () => {

          resolve ()

        }, (error) => {

          reject (error)
        })
      })
   }

   /////////////////////////////////////////////////////////
   // Load a document from URN
   //
   /////////////////////////////////////////////////////////
   loadDocument (urn) {

      return new Promise((resolve, reject) => {

        const paramUrn = !urn.startsWith('urn:')
          ? 'urn:' + urn
          : urn

        Autodesk.Viewing.Document.load(paramUrn, (doc) => {

          resolve (doc)

        }, (error) => {

          reject (error)
        })
      })
   }

   /////////////////////////////////////////////////////////
   // Return viewable path: first 3d or 2d item by default
   //
   /////////////////////////////////////////////////////////
   getViewablePath (doc, pathIdx = 0, roles = ['3d', '2d']) {

      const rootItem = doc.getRootItem()

      const roleArray = [...roles]

      let items = []

      roleArray.forEach((role) => {

        items = [ ...items,
          ...Autodesk.Viewing.Document.getSubItemsWithProperties(
            rootItem, { type: 'geometry', role }, true) ]
      })

      if (!items.length || pathIdx > items.length) {

        return null
      }

      return doc.getViewablePath(items[pathIdx])
   }

   /////////////////////////////////////////////////////////
   // viewer div and component created
   //
   /////////////////////////////////////////////////////////
   async loadModelInView (viewer) {

     // try {

        let { id, extIds, urn, path, pathIdx } =
          this.props.location.query

        // check if env is initialized
        // initializer cannot be invoked more than once

        if (!this.props.appState.viewerEnv) {

          await this.initialize({
            env: 'AutodeskProduction',
            useConsolidation: true
          })
          
          this.props.setViewerEnv('AutodeskProduction')

          Autodesk.Viewing.endpoint.setEndpointAndApi(
            window.location.origin + '/lmv-proxy-2legged')

          Autodesk.Viewing.Private.memoryOptimizedSvfLoading = true

          //Autodesk.Viewing.Private.logger.setLevel(0)
        }

        if (id) {

          // load by database id lookup
          // !NOT IMPLEMENTED HERE
          // could be something like:
          // const dbModel = getDBModelBy(id)
          // urn = dbModel.urn

        } else if (urn) {

          const doc = await this.loadDocument (urn)

          path = this.getViewablePath (doc, pathIdx || 0)

        } else if (!path) {

          const error = 'Invalid query parameter: ' +
            'use id OR urn OR path in url'

          throw new Error(error)
        }

   

        viewer.start()
        viewer.loadModel(path)


        //this.panel = new ReactPanel(viewer, {id:'react-panel-id', title:'Spaces'}, <DataTable viewer={viewer}/>)
        //this.panelG = new ReactPanel(viewer, {id:'react-panel-id', title:'Graph'}, <Neo4jGraphViewer viewer={viewer} result={[]} autoComplete={true} maxNeighbours={10000} initialNodeDisplay={1000}/>)
        //this.panel = new ReactPanel(viewer, {id:'react-panel-id', title:'Spaces'}, <GrapViewer viewer={viewer}/>)
        this.panel = new ReactPanel(viewer, {id:'react-panel-id', title:'Queries', AddFooter:true}, <QueryPane viewer={viewer} viewerView={this}/>)
        this.panelTimeLine = new ReactPanel(viewer, {id:'react-panel-TimeLine', title:'Timeline', AddFooter:false}, <TimeLineViewer onRangeChanged={() => this.UpdateRange()} />)

        console.log("Showing panel")  

        this.panel.setVisible(true)

        viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelectionChanged);
        viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, debounce(this.onCameraChanged.bind(this), 500));
        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeoReady.bind(this));
        
        this.viewer = viewer
        //this.panelTimeLine.setVisible(true)
        //this.panelG.setVisible(true)
      

      //} catch (ex) {

      //  console.log('Viewer Initialization Error: ')
      ///  console.log(ex)
      //}

      //this.initSpaceRenderOverlay()
   }

   onLoadModelSuccess() {


   }

   onLoadModelError(){

   }



  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onViewerStartResize (e) {

    this.assignState({
      resizing: true
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onViewerStopResize (e) {

    this.viewerFlex = e.component.props.flex

    if (this.state.renderExtension) {

      if (this.state.renderExtension.onStopResize) {

        this.state.renderExtension.onStopResize()
      }
    }

    this.assignState({
      resizing: false
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onStopResize (e) {

    if (this.state.renderExtension) {

      if (this.state.renderExtension.onStopResize) {

        this.state.renderExtension.onStopResize()
      }
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  @autobind
  onResize (event) {

    if (this.state.renderExtension) {

      if (this.state.renderExtension.onResize) {

        this.state.renderExtension.onResize()
      }
    }
  }

  @autobind
  onSplitterDragEnd(){
    this.viewer.resize()
  }


 onCameraChanged(event){

  let navtool = this.viewer.getActiveNavigationTool()

  if ("bimwalk" == navtool){
  this.updateSpacePresence()
  }
}

  async onSelectionChanged( event ) {
    if( !event.selections || event.selections.length <= 0
        || !event.selections[0].dbIdArray
        || event.selections[0].dbIdArray.length <= 0 ) return;
    
    this.dbId = event.selections[0].dbIdArray[0]; 

    var sensorInsance = {}
  
    event.target.getProperties(this.dbId, 
      element => {
          if (element.name.includes("IoT_")){

            for(var i=0; i<element.properties.length; i++){
              if (element.properties[i].displayName == "Data Metirc Name"){
                sensorInsance.Data_Metric_Name = element.properties[i].displayValue
              }

              if (element.properties[i].displayName == "Device Name"){
                sensorInsance.Device_Name = element.properties[i].displayValue
              } 

              if (element.properties[i].displayName == "Type Name"){
                sensorInsance.Family_and_Type = element.properties[i].displayValue
              }
            
              if (element.properties[i].displayName == "Data URI"){
                sensorInsance.Data_URI = element.properties[i].displayValue
              }

              if (element.properties[i].displayName == "Data Metirc Unit"){
                sensorInsance.Data_Metric_Units = element.properties[i].displayValue
              }
            }

            if (sensorInsance.dataUri != undefined)
            {
              this.dataSvc.getDataForDateRange(sensorInsance.dataUri, this.state.start, this.state.end, 30).then(data => {
                sensorInsance.currentData = data
                this.showUpdateDataPanel(sensorInsance, true)
              })
            }
        }
      }, null)

}


showUpdateDataPanel(sensorInsance, show)
{

  if (!show && !(sensorInsance.Panel && sensorInsance.Panel.ChildContent)) return

    if (sensorInsance.Panel && sensorInsance.Panel.ChildContent)
    {
      //sensorInsance.Panel.ChildContent.setState({data:sensorInsance.currentData})
    }else{
      //sensorInsance.Panel = new ReactPanel(this.viewer, {id:'react-panel-LineChart'+sensorInsance.dataUri, title:sensorInsance.typeName, AddFooter:false}, <D3VisLineChart data={sensorInsance.currentData} metricName={sensorInsance.dataMetricName} /> )
      //sensorInsance.Panel.setVisible(true)
      if (!this.state.ActiveDataSources[sensorInsance.Data_URI]){
        this.state.ActiveDataSources[sensorInsance.Data_URI] = {}
      }
      this.state.ActiveDataSources[sensorInsance.Data_URI][sensorInsance.dataMetricName] = sensorInsance
    }

    this.chartstacker.current.setState({ActiveDataSources:this.state.ActiveDataSources})
}


UpdateTime(e) {

  this.state.end = e.end
  this.state.start = e.start

  /*
  for(let dataSourceKey in this.state.ActiveDataSources){
    this.dataSvc.getDataForDateRange(dataSourceKey, this.state.start, this.state.end, 30).then(data => {
      let sensorInstanceKeys = this.state.ActiveDataSources[dataSourceKey]
      for(let sikey in sensorInstanceKeys){
        let si = sensorInstanceKeys[sikey]
        si.currentData = data
        this.showUpdateDataPanel(si, false)
        this.chartstacker.current.updateCharts(si)
      }

    })

  }*/

  this.chartstacker.current.setState({start:this.state.start, end:this.state.end})

}



updateSpacePresence(){

  var rect = this.viewer.impl.getCanvasBoundingClientRect();
  var clientX = 0.5 * rect.width
  var clientY = 0.5 * rect.height

  this.getAllSpacesGeometry((goids) => {

    var origin = this.viewer.impl.clientToViewport(clientX, clientY)
    var ray = new THREE.Ray();
    this.viewer.impl.viewportToRay(origin, ray);
    var hits = this.viewer.impl.rayIntersect(ray, false, goids)
    console.log(hits);

    if (hits){
      this.viewer.getProperties(hits.dbId, (props) =>{

          var nmid = props.name.replace("SP_","").split("-__")
          var name = nmid[0]
          var externalid = nmid[1].split(" ")[0]

          this.viewer.model.getExternalIdMapping((m) => 
          {
             console.log("got id mapping")
             this.IdMapping = m
             var exids = []
             exids.push(this.IdMapping[externalid]) //0 index is assumed to always be the UniqueId
             if (exids) this.viewer.select(exids, Autodesk.Viewing.SelectionMode.REGULAR)
            
         });

        console.log("found space: " + name + ", extid: " + externalid)
        this.onEnterSpace({name:name, extid:externalid})
      },(er) => {})
    }

    //var hits = this.viewer.impl.castRayViewport(,true, goids)

    /*
    if (this._octree){
      var ochits = this._octree.search( origin, 0.0005, true )
      console.log(ochits);
    }*/
  })
  
}

onEnterSpace(space){

  this.chartstacker.current.setState({headerText:space.name})

  this.buildingGraphSvc.Query(`{Space (Number:\"${space.name}\"){Area,Volume, Name, Number, BIMExternalID, Sensors{BIMExternalID, BIMReference, Data_URI, Family_and_Type, Data_Metric_Name, Device_Name}}}`, {}).then(re =>
    {
      this.onGetBuildingSpaceData(re)
      console.log(re);
    })
}


onGetBuildingSpaceData(spaceData){
  
  if (spaceData && spaceData.data && spaceData.data.Space)
  {
  this.state.currentSpaceData = spaceData.data.Space[0]
  
  }else{

    this.state.currentSpaceData  = null
  }


  this.state.ActiveDataSources = {}
  if (this.state.currentSpaceData.Sensors)
  { 
        for (let sensorIndex in this.state.currentSpaceData.Sensors)
        {
          this.state.currentSpaceData.Sensors.forEach(sensor => {
          if (!this.state.ActiveDataSources[sensor.Data_URI]){
            this.state.ActiveDataSources[sensor.Data_URI] = {}
          }
          this.state.ActiveDataSources[sensor.Data_URI][sensor.Data_Metric_Name] = sensor
        })
      }
  }

  this.chartstacker.current.setState({spaceData:this.state.currentSpaceData, ActiveDataSources:this.state.ActiveDataSources})


}



findSpacesGeo(spaceNumber) {
  if (!this.viewer) return

  //this.initSpaceRenderOverlay()

  this.viewer.model.search('SP_'+spaceNumber, 
           (idArray) => {
            idArray.forEach((idA) => {
                  this.renderSpace({spaceId:idA}, 2)
                })
            },
            function(err){
                console.log('ERROR: viewer search: ' + err);
            });  
    

}

getAllSpacesGeometry(gotSpacesCallback){

if (!this.viewer.model) return
//this.initSpaceRenderOverlay()

  this.viewer.model.search('SP_', 
           (idArray) => {
              this._spaceGeoIds = idArray           
              gotSpacesCallback(idArray)
            },
            function(err){
                console.log('ERROR: viewer search: ' + err);
            }); 

  return this._spaceGeoIds
}


onGeoReady()
{
   this.initSpaceRayCheck()
   this.initSpaceRenderOverlay()
}

initSpaceRenderOverlay() {
  if (this.isinit) return
  this.isinit = true

  this._defaultFaceMaterial =  this.createFaceMaterial("#b4ff77", 0.9, true);

  this._materialArray = {}
  /*
        //hex color array for different rooms
        var colorHexArray = ["#ff77b4", "#b4ff77", "#77b4ff", "#c277ff", "#ffc277", "#f8ff77"];
        for(var k = 0; k < colorHexArray.length; k++){
            //create some materials with specific colors
            var material = this.createFaceMaterial(colorHexArray[k], 0.1, true);
            this._materialArray.push(material);
        } 

        var material = new THREE.MeshPhongMaterial({
            color: 0xb4ff77,
            opacity: 0.1,
            transparent: true,
            side: THREE.DoubleSide,
            aoMapIntensity: 0,
            depthWrite: false
        });
        
        this._materialArray.push(material)
          //create a layer
          */
        this.viewer.impl.createOverlayScene(this._overlaySceneName);
        
   
}

initSpaceRayCheck(){

  if (!this.viewer.model) return

  this.viewer.model.search('SP_', 
             (idArray) => {
              this._spaceGeoIds = idArray
              idArray.forEach((idA) => {
                this.renderSpaceDoubleSided({spaceId:idA}, 0)
              })
              },
              function(err){
                  console.log('ERROR: viewer search: ' + err);
              }); 
  }

  renderSpaceDoubleSided(space){
  
    const fragList = this.viewer.model.getFragmentList()
  
    var instanceTree =  this.viewer.model.getData().instanceTree; 
    instanceTree.enumNodeFragments(space.spaceId, (fragId) => {     
            //make the space geomoery material double sided to ray check hits when inside the space
            var met = fragList.getMaterial(fragId)
            this.orgSpaceMet = met;
            met.side = THREE.DoubleSide
            fragList.setMaterial(fragId, met)
        });
  
  }

  clearVisuals(){
    if (!this.viewer.model) return

    const fragList = this.viewer.model.getFragmentList()

    this.viewer.model.search('SP_', 
               (idArray) => {
                this._spaceGeoIds = idArray
                idArray.forEach((idA) => {
                  var instanceTree =  this.viewer.model.getData().instanceTree; 
                  instanceTree.enumNodeFragments(idA, (fragId) => {     
                          //make the space geomoery material double sided to ray check hits when inside the space
                          //var met = fragList.getMaterial(fragId)
                          //met.side = THREE.DoubleSide
                          //met.opacity = 0
                          //met.transparent = true
                          //met.needsUpdate = true
                          fragList.setMaterial(fragId, this.orgSpaceMet)
                          this.viewer.impl.invalidate(true, true, false);
                      });
                })
                },
                function(err){
                    console.log('ERROR: viewer search: ' + err);
                }); 
    
  }

  renderSpaceColour(spaceNumber, colorhex){
  
   
  
    if (!this.viewer) return
    var faceMeshArray = []
    var meterial = null

    var fragList = this.viewer.model.getFragmentList()
    var mats = this.viewer.impl.matman()._materials;

    this.viewer.model.search('SP_'+spaceNumber, 
             (idArray) => {
              idArray.forEach((idA) => {

              var instanceTree =  this.viewer.model.getData().instanceTree; 
              instanceTree.enumNodeFragments(idA, (fragId) => {     

                //iterate each material
                for (let index in mats) {
              
                    var m = mats[index];
                    if(m.name == spaceNumber){
                      meterial = m
                    } 
                    if (meterial){ break} 
                }
                
                //meterial = fragList.getMaterial(fragId)
                
                  if (meterial)
                  {
                      //meterial = this._materialArray[spaceNumber].meterial
                      var colorHexStr = colorhex;
                      var colorThreeStr = colorHexStr.replace('#', '0x');
                      var colorValue = parseInt(colorThreeStr, 16);
                      meterial.color = new THREE.Color(colorValue)
                      meterial.needsUpdate = true
                      meterial.opacity = 0.7
                      meterial.transparent = true
                      meterial.side = THREE.DoubleSide
                  }else{
                    meterial = this.createFaceMaterial(colorhex, 0.9, true)         
                    meterial.name = spaceNumber
                  }

                  fragList.setMaterial(fragId, meterial)
                  this._materialArray[spaceNumber] = {meterial:meterial, faces:faceMeshArray, colour:colorhex}
                  

                  /*
                  var renderProxy = this.viewer.impl.getRenderProxy(this.viewer.model, fragId);
                  var matrix = renderProxy.matrixWorld;
                  var indices = renderProxy.geometry.ib;
                  var positions = renderProxy.geometry.vb;
                  var stride = renderProxy.geometry.vbstride;
                  var offsets = renderProxy.geometry.offsets;
              
                  if (!offsets || offsets.length === 0) {
                      offsets = [{start: 0, count: indices.length, index: 0}];
                  }
              
                  var vA = new THREE.Vector3();
                  var vB = new THREE.Vector3();
                  var vC = new THREE.Vector3();


                  for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {
              
                      var start = offsets[oi].start;
                      var count = offsets[oi].count;
                      var index = offsets[oi].index;
              
                      var checkFace = 0;

                      for (var i = start, il = start + count; i < il; i += 3) {
                      
                          var a = index + indices[i];
                          var b = index + indices[i + 1];
                          var c = index + indices[i + 2];
              
                          vA.fromArray(positions, a * stride);
                          vB.fromArray(positions, b * stride);
                          vC.fromArray(positions, c * stride);
                  
                          vA.applyMatrix4(matrix);
                          vB.applyMatrix4(matrix);
                          vC.applyMatrix4(matrix);
              
                          var faceGeometry = this.createFaceGeometry(vA, vB, vC);
                          var faces = faceGeometry.faces;

                          for(var f = 0; f < faces.length; f++){
                                  var faceMesh = this.drawFaceMesh(faceGeometry,
                                    this._overlaySceneName, 
                                    meterial,
                                    renderProxy);
                                    faceMeshArray.push(faceMesh); 
                          }
                      }
                    }

                   */
          })
        });
        //this.viewer.impl.sceneUpdated(true)
        this.viewer.impl.invalidate(false, true, false);
      },
    function(err){
        console.log('ERROR: viewer search: ' + err);
    });  

    
  }

  



//create material and add it to Forge Viewer object stack
createFaceMaterial(colorhex, opacity, transparent) {

  var colorHexStr = colorhex;
  var colorThreeStr = colorHexStr.replace('#', '0x');
  var colorValue = parseInt(colorThreeStr, 16);

  var material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(colorValue),
      opacity: opacity,
      transparent: transparent,
      side: THREE.DoubleSide
  });

  this.viewer.impl.matman().addMaterial(
    this._customMaterialPrefix + this.newGUID(),
      material,
      true);

  return material;
}


newGUID() {

  var d = new Date().getTime();

  var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
      /[xy]/g,
      function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });

  return guid;
}

/*
renderSpace(space){
    
  //if (this._octree) return

  //var colorIndex = colour;
  //var faceMeshArray = [];

  const fragList = this.viewer.model.getFragmentList()

  var instanceTree =  this.viewer.model.getData().instanceTree; 
  instanceTree.enumNodeFragments(space.spaceId, (fragId) => {
      
          //var renderProxy = this.viewer.impl.getRenderProxy(this.viewer.model, fragId);
  
          //make the space geomoery material double sided to ray check hits when inside the space
          var met = fragList.getMaterial(fragId)
          met.side = THREE.DoubleSide,
          fragList.setMaterial(fragId, met);//this._materialArray[colorIndex]

          var matrix = renderProxy.matrixWorld;
          var indices = renderProxy.geometry.ib;
          var positions = renderProxy.geometry.vb;
          var stride = renderProxy.geometry.vbstride;
          var offsets = renderProxy.geometry.offsets;
      
          if (!offsets || offsets.length === 0) {
              offsets = [{start: 0, count: indices.length, index: 0}];
          }
      
          var vA = new THREE.Vector3();
          var vB = new THREE.Vector3();
          var vC = new THREE.Vector3();


          for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {
      
              var start = offsets[oi].start;
              var count = offsets[oi].count;
              var index = offsets[oi].index;
      
              var checkFace = 0;

              for (var i = start, il = start + count; i < il; i += 3) {
              
                  var a = index + indices[i];
                  var b = index + indices[i + 1];
                  var c = index + indices[i + 2];
      
                  vA.fromArray(positions, a * stride);
                  vB.fromArray(positions, b * stride);
                  vC.fromArray(positions, c * stride);
          
                  vA.applyMatrix4(matrix);
                  vB.applyMatrix4(matrix);
                  vC.applyMatrix4(matrix);
      
                  var faceGeometry = this.createFaceGeometry(vA, vB, vC);
                  var faces = faceGeometry.faces;

                  for(var f = 0; f < faces.length; f++){
                           var faceMesh = this.drawFaceMesh(faceGeometry,
                            this._overlaySceneName, 
                            this._materialArray[colorIndex],
                            renderProxy);
                            faceMeshArray.push(faceMesh); 
                  }
              }
          }
      });

  space.defaultcolor = this._materialArray[colorIndex];
  space.facemeshes = faceMeshArray;

  colorIndex++;


}*/

/*

hideShader () {  
        
  //get materials collection of this model
  var mats = this.viewer.impl.matman()._materials;
  //define a color in grey
  var grey = new THREE.Color(0.5, 0.5, 0.5);

  //iterate each material
  for (let index in mats) {

      var m = mats[index];

      if(index.includes(this._customMaterialPrefix)){
          //if this is a material created for the shader face
          this._oldTextures[index] = m.map;
          this._oldColors[index] = m.color; 

          //set texture to null
          m.map = null;
          //set the color to the grey (but because m.transparent = true, this line does not take effect )
          m.color = grey;

          //set the material completely transparent
          m.transparent = true;
          m.opacity = 0;
          
          //notify Viewer to refresh the scene.
          m.needsUpdate = true; 
      }
  }
  this.viewer.impl.invalidate(true, true, false);
}
*/

/*
showShader() { 


  //get materials collection of this model
  var mats = this.viewer.impl.matman()._materials;

  //iterate each material
  for (let index in mats) {
      if(index.includes(this._customMaterialPrefix)){

          //if this is a material created for the shader face 
          m = mats[index]; 
          m.map = _oldTextures[index];
          m.color = _oldColors[index];;

          //make the original texture and color take effect.
          m.transparent = false;
          m.opacity = 1;
          //notify Viewer to refresh the scene. 
          m.needsUpdate = true; 
      }
  }
  this.viewer.impl.invalidate(true, true, false);
}; 
*/


/*
initSpaceRenderOverlay() {
  if (this.isinit) return
  this.isinit = true

  this._defaultFaceMaterial =  this.createFaceMaterial("#b4ff77", 0.9, true);

        //hex color array for different rooms
        var colorHexArray = ["#ff77b4", "#b4ff77", "#77b4ff", "#c277ff", "#ffc277", "#f8ff77"];
        for(var k = 0; k < colorHexArray.length; k++){
            //create some materials with specific colors
            var material = this.createFaceMaterial(colorHexArray[k], 0.1, true);
            this._materialArray.push(material);
        } 

        var transparentMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          opacity: 0.1,
          transparent: true })

        var material = new THREE.MeshPhongMaterial({
            color: 0xb4ff77,
            opacity: 0.1,
            transparent: true,
            side: THREE.DoubleSide,
            aoMapIntensity: 0,
            depthWrite: false
        });
        
        this._materialArray.push(material)
          //create a layer
        this.viewer.impl.createOverlayScene(this._overlaySceneName);
        
   
}
*/

createFaceGeometry(vA, vB, vC, geom,color){
     
  if(!geom){
     var geom = new THREE.Geometry();
  }

  var vIndex = geom.vertices.length;

  geom.vertices.push(vA.clone());
  geom.vertices.push(vB.clone());
  geom.vertices.push(vC.clone());

  var face = new THREE.Face3(vIndex, vIndex + 1, vIndex + 2);
 
  //face.color.setRGB(color.R,color.G,color.B);
  geom.faces.push(face);
  geom.computeFaceNormals();

  return geom;
}


drawFaceMesh(geom, overlaySceneName, material, mesh){

  if(!material) {
      material = this._faceMaterial
  }
 
  var faceMesh = new THREE.Mesh(geom, material);  
  this.viewer.impl.addOverlay(this._overlaySceneName, faceMesh);

  return faceMesh;
 
}




   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////
   render () {

      return (
      <div >
        <div className="viewer-view">
        <SplitterLayout primaryIndex={0} onDragEnd={this.onSplitterDragEnd} secondaryMinSize={60} secondaryInitialSize={300}> 
          <div className="viewer-view">
              <Viewer onViewerCreated={(viewer => {this.loadModelInView(viewer)})} />
          </div>   

          <div className="chart-stack-panel" >
            <ChartStacker ActiveDataSources={this.state.ActiveDataSources} ref={this.chartstacker} headerText={this.state.currentSpaceName} spaceData={this.state.currentSpaceData} viewerView={this}/>
          </div>
        </SplitterLayout>
        </div>
        <div className="TimeLineContainer">
          <TimeLineViewer onCurrentTimeChanged={(e) => {debounce(this.UpdateTime(e), 200)}} />
        </div> 
     </div>


        
        )
   }
}

export default ViewerView


