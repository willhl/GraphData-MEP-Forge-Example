# GraphData-MEP-Forge-Example

This repository is for reference only and is not under ongoing development. 

It comprises of an API server and Autodesk Forge viewer implementation with graph data interaction provided by a visualization pane for Neo4j, as shown here:

https://youtu.be/hsbBHZTMWtM

Some items of interest are the Neo4j browser graph visualization provided in a React panel in the Autodesk Forge viewer.

See:
 - src\client\components\D3Visualization
 - src\client\components\Viewer.Components\Extensions\Dynamic\Viewing.Extension.Neo4jGraph

Much of the source is based on the rcdb example from Autodesk, and the Neo4j Browser:

https://github.com/Autodesk-Forge/forge-rcdb.nodejs
https://github.com/neo4j/neo4j-browser
