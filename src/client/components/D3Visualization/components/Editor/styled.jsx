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

import styled from 'styled-components'
//import { dim } from 'browser-styles/constants'

const editorPadding = 12

export const BaseBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: middle;
  min-height: ${props =>
    props.expanded
      ? '100vh'
      : Math.max(20, props.minHeight + editorPadding * 2)}px;
  overflow: hidden;
  margin: 0 0px;
`
export const Bar = styled(BaseBar)`
  ${props => {
    if (props.expanded) {
      return (
        'position: absolute;' +
        'height: 100vh;' +
        'z-index: 100;' +
        'right: 0;' +
        'left: 0;' +
        'bottom: 0;'
      )
    }
  }};
`
export const ActionButtonSection = styled.div`
  flex: 0 0 60px;
  flex-direction: column-reverse 
  flex-flow: column-reverse  nowrap
  align-items: top;
  display: flex-end;
  padding-top: 21px;
  justify-content: space-between;
  background-color: ${props => props.theme.editorBarBackground};

`

const BaseEditorWrapper = styled.div`
  flex: auto;
  padding: ${editorPadding}px;
  background-color: ${props => props.theme.editorBarBackground};
  min-height: ${props =>
    props.expanded
      ? '100vh'
      : Math.max(20, props.minHeight + editorPadding * 2)}px;
  width: 0;
  .CodeMirror {
    background-color: #ededed4d !important;
    color: #000000;
    height: 80px;
  }
  .CodeMirror-gutter{
    background-color: #ededed4d 
    color: #000000;
  }
`

export const EditorWrapper = styled(BaseEditorWrapper)`
  ${props => {
    if (props.expanded) {
      return (
        'height: 100%;' +
        'z-index: 2;' +
        '.CodeMirror {' +
        '  position: absolute;' +
        '  left: 12px;' +
        '  right: 142px;' +
        '  top: 12px;' +
        '  bottom: 12px;' +
        '}' +
        '.CodeMirror-scroll {' +
        '   max-height: initial !important;' +
        '}'
      )
    }
  }};
`
