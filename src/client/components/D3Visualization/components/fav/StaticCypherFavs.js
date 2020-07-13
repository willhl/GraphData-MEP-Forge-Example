export const scripts = [
    {
      name: 'Spaces',
      content: [
       '// A single space\nMATCH (n:Space {Number:"01-08"}) RETURN n',
       '// Boundaries between spaces\nMATCH (n:Space {Number:"01-08"})-[:BOUNDED_BY]->(s:Section)-[:BOUNDED_BY]->(p:Space {Number:"01-10"})\nMATCH (s)-[:IS_ON]-(m)-[:IS_OF]-(t)\nRETURN n,p,s,m,t LIMIT 30',
       '// Boundaries to outside\nMATCH (n:Space {Number:"01-11"})-[:BOUNDED_BY]-(s:Section)-[:BOUNDED_BY]-(p:Environment)\nMATCH (s)-[:IS_ON]-(m)\nRETURN n,p,s,m LIMIT 30'
      ]
    },
    {
        name: 'Electrical',
        content :[
          '// DB Panels and Circuits\nMATCH (rv:RevitModel {\`Project Number\`:\'Project Number\'})-[:IS_IN]-()-[:REALIZED_BY]-(n:DBPanel)-[r:ELECTRICAL_FLOW_TO*]->(s:Circuit)-[z:ELECTRICAL_FLOW_TO]->(b) RETURN n,s,b LIMIT 300',
          '// Cable tray between spaces\nMATCH a=(rv:RevitModel {`Project Number`:\'Project Number\'})-[:IS_IN]-()-[:REALIZED_BY]-(s:CableTray )-[:IS_IN_SPACE]->(sp:Space {Number:"01-12"}) \nMATCH p=(s)-[:CABLETRAY_FLOW_TO*]-(i:CableTray)-[:IS_IN_SPACE]->(sc:Space {Number:"01-27"}) RETURN a,p',
          '// Shortest Cable tray route between space\nmatch (sp:Space {Number:"01-12"})<-[:IS_IN_SPACE]-(s1:CableTray) MATCH (sc:Space {Number:"01-27"})<-[:IS_IN_SPACE]-(s2:CableTray {Category:"Cable Trays"})\nCALL apoc.algo.dijkstra(s1, s2, \'CABLETRAY_FLOW_TO>\', \'Length\') YIELD path, weight \n RETURN path, sum(weight), sp, sc'
         ]
      },
      {
        name: 'Mechanical',
        content :[
          '// Ducts between spaces\nMATCH p=(n:Space {Number:"01-01"})<-[:FLOWS_TO_SPACE]-(:Terminal)-[:AIR_FLOW_TO*1..20]-(:Terminal)-[:FLOWS_TO_SPACE]->(:Space {Number:"01-02"}) RETURN p LIMIT 30',
          '// From space to AHU\nMATCH (r:RevitModel {`Project Number`:\'Project Number\'})<-[:IS_IN]-(ModelElement)<-[:REALIZED_BY]-(sp:Space {Number:\'01-01\'}) MATCH pai=(sp)<-[:FLOWS_TO_SPACE]-(ain:Terminal)<-[ai:AIR_FLOW_TO*]-(e:Equipment)\nOPTIONAL MATCH pao=(sp)-[:FLOWS_TO_SPACE]->(aout:Terminal)-[ao:AIR_FLOW_TO*]->(e:Equipment)\nreturn pai,pao',
          '// Shortest LTHW route back to Boiler\nmatch (sp:Space {Number:"01-01"})<-[:IS_IN_SPACE]-(s1:Equipment) MATCH (sc:Equipment)-[:IS_OF]-(t:ElementType {IfcPresentationLayer:\'M-Pr_60_60_08-M_Boilers\'}) CALL apoc.algo.dijkstra(s1, sc, \'HYDRONIC_FLOW_TO>\', \'Length\') YIELD path, weight RETURN path, sum(weight), sp, sc'
         ]
      },
     {
        name: 'Snippets',
        content :[
          '// Elements in model\n MATCH (rv:RevitModel {`Project Number`:\'Project Number\'})-[:IS_IN]-()-[:REALIZED_BY]-(e) return e'
         ]
      },
  ]

  