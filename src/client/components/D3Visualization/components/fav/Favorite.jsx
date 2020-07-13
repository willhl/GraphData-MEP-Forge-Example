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
import ReactDOM from 'react-dom'
import {
  StyledListItem,
  StyledFavoriteText,
  ExecFavoriteButton,
  StyledFavFolderButtonSpan
} from './styled'


function extractNameFromCommand (input) {
  if (!input) {
    return ''
  }

  let firstRow = input.split('\n')[0]
  if (firstRow.indexOf('//') === 0) {
    return firstRow.substr(2).trim()
  } else {
    return input.trim()
  }
}

class Favorite extends Component {
  constructor () {
    super()
  
  }

  componentDidMount () {
    this.props.onItemRef && this.props.onItemRef(this.itemRef.current)
  }

  render () {
    const name = extractNameFromCommand(this.props.content)
    const {
      connectDropTarget,
      isStatic,
      onItemClick,
      removeClick,
      onItemRef,
      id,
      content,
      onExecClick,
      isChild,
      ...rest
    } = this.props
console.log(name)
    let favoriteContent = (
      <StyledListItem
        ref={this.itemRef}
        isChild={isChild}
        data-test-id='sidebarFavoriteItem'
      >
        <ExecFavoriteButton onClick={() => onExecClick(content)} />
        <StyledFavoriteText {...rest} onClick={() => onItemClick(id, content)}>
          {name}
        </StyledFavoriteText>
      </StyledListItem>
    )

    return favoriteContent
  }
}



export default Favorite
