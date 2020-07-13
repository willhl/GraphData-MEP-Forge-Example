/*
 * Copyright (c) 2002-2018 "Neo4j, Inc"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
//import { DropTarget } from 'react-dnd'
//import Render from 'browser-components/Render'
//import { ConfirmationButton } from '../buttons/ConfirmationButton'
import {
  CollapseMenuIcon,
  ExpandMenuIcon,
  BinIcon
} from '../icons/Icons'
//import ItemTypes from './DragItemTypes'
import {
  FoldersButton,
  StyledList,
  StyledListHeaderItem,
  StyledFavFolderButtonSpan,
  EditFolderButton,
  FolderButtonContainer,
  EditFolderInput,
  StyledFolderLabel
} from './styled'
import Favorite from './Favorite'
import { toKeyString } from '../../services/utils'

class Folder extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }

  
  }

  componentDidMount () {
    let ch = []
    let indx = 0;
    this.props.folder.content.forEach(entry => {   
      ch.push(
        <Favorite
          entry={entry}
          key={`${toKeyString(entry + indx++)}`}
          content={entry}
          onItemClick={this.props.onItemClick}
          onExecClick={this.props.onExecClick}
          isChild={true}
          isStatic={false}
        />)
      })
      this.state.children = ch;
  }

  onFolderNameChanged (e) {
    this.props.updateFolder(e.target.value, this.props.folder.id)
  }

  folderNameInputSet (el) {
    if (el) {
      this.folderNameInput = el
      this.folderNameInput.onkeypress = this.handleKeyPress.bind(this)
    }
  }

/*
  handleKeyPress (e) {
    if (e.keyCode === 13) {
      this.setState({ editing: false })
    }
  }

  componentDidUpdate () {
    this.folderNameInput && this.folderNameInput.focus()
  }
*/

  render () {
    let icon = this.state.active ? <CollapseMenuIcon /> : <ExpandMenuIcon />
    let folderContents = (
      <div>
        <StyledList>
          <StyledListHeaderItem>
            
              <StyledFolderLabel onClick={() => this.setState({ active: !this.state.active })}>
                {this.props.folder.name}
              </StyledFolderLabel>
           
            <FolderButtonContainer>
              <FoldersButton onClick={() => this.setState({ active: !this.state.active })}>
                {icon}
              </FoldersButton>
            </FolderButtonContainer>

          </StyledListHeaderItem>
          {this.state.active ? this.state.children : null}
        </StyledList>
      </div>
    )

     return folderContents
    
  }
}

/*
const folderTarget = {
  hover (props, monitor, component) {
    const dragItem = monitor.getItem()
    props.moveToFolder(props.folder, dragItem, false)
  },
  drop (props, monitor, component) {
    const dragItem = monitor.getItem()
    props.moveToFolder(props.folder, dragItem, true)
  }
}*/

export default Folder

/*
export default DropTarget(ItemTypes.FAVORITE, folderTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Folder)*/
