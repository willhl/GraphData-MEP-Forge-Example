import React, { Component } from 'react'
import { scripts as staticCyphersList } from './StaticCypherFavs'


import Folder from './Folder'


import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSubHeader
} from '../drawer'


export class Favs extends Component{
    constructor (props) {
        super(props)
        this.state = { ...this.props }
      }


      render () {
        const { favorites, folders } = { ...this.state }

        const ListOfFolders = staticCyphersList.map(folder => {

            return (
              <Folder key={folder.name} folder={folder} onItemClick={this.props.onItemClick}>
               </Folder>
            )
          })

    console.log(ListOfFolders)
        return (
          <div>
                {ListOfFolders}
                </div>
        )
      }


}

export default Favs