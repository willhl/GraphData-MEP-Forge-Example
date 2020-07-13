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

import React from 'react'
import { keyframes, css } from 'styled-components'
import { IconContainer } from './IconContainer'
import ratingStar from './icons/rating-star.svg'
import databaseCheck from './icons/database-check.svg'
import bookSearch from './icons/book-search.svg'
import cog from './icons/cog.svg'
import cloudCheck from './icons/cloud-check.svg'
import cloudRemove from './icons/cloud-remove.svg'
import neo4j from './icons/neo-world.svg'
import pin from './icons/pin.svg'
import arrowUp1 from './icons/arrow-up-1.svg'
import close from './icons/close.svg'
import expand01 from './icons/expand-01.svg'
import shrink from './icons/shrink.svg'
import buttonRefreshArrow from './icons/button-refresh-arrow.svg'
import downloadBottom from './icons/download-bottom.svg'
import table01 from './icons/table-01.svg'
import Text201 from './icons/Text2-01.svg'
import appWindowCode from './icons/app-window-code.svg'
import arrowLeft1 from './icons/arrow-left-1.svg'
import arrowRight1 from './icons/arrow-right-1.svg'

const inactive = `
  color: #797979;
  fill: #797979;
`
const green = `
  color: #4cd950;
`
const successGreen = `
  color: #4cd950;
`
const blue = `
  color: #58c8e3;
`
const alertYellow = `
  color: #ffaf00;
`
const warningRed = `
  color: #df4d3b;
`
const white = `
  color: #ffffff;
`
const lightBlue = `
  color: #5dade2;
`

const neo4jPulse = keyframes`
  0%,
  100% {
    fill: #1bf621;
  }
  50% {
    fill: #00a3ff;
  }
`

const credits = css`
  animation: ${neo4jPulse} 2s infinite;
  animation-timing-function: ease-in-out;
`

const databaseConnectionStateStyles = {
  connected: {
    active: green,
    inactive: inactive,
    classModifier: 'check'
  },
  disconnected: {
    active: warningRed,
    inactive: inactive,
    classModifier: 'delete'
  },
  pending: {
    active: alertYellow,
    inactive: inactive,
    classModifier: 'alert'
  }
}

export const DatabaseIcon = props => {
  const { connectionState, ...rest } = props
  return (
    <IconContainer
      activeStyle={databaseConnectionStateStyles[connectionState].active}
      inactiveStyle={databaseConnectionStateStyles[connectionState].inactive}
      className={databaseConnectionStateStyles[connectionState].classModifier}
      icon={databaseCheck}
      width={28}
      {...rest}
    />
  )
}

export const FavoritesIcon = props => (
  <IconContainer
    activeStyle={white}
    inactiveStyle={inactive}
    icon={ratingStar}
    width={28}
    {...props}
  />
)
export const DocumentsIcon = props => (
  <IconContainer
    activeStyle={white}
    inactiveStyle={inactive}
    icon={bookSearch}
    width={28}
    {...props}
  />
)

export const CloudIcon = props => (
  <IconContainer
    activeStyle={successGreen}
    inactiveStyle={inactive}
    icon={cloudCheck}
    width={28}
    {...props}
  />
)
export const CloudDisconnectedIcon = props => (
  <IconContainer
    activeStyle={warningRed}
    inactiveStyle={warningRed}
    icon={cloudRemove}
    width={28}
    {...props}
  />
)
export const CloudSyncIcon = props => {
  const { connected, ...rest } = props
  return (
    <IconContainer
      activeStyle={connected ? successGreen : warningRed}
      inactiveStyle={connected ? inactive : warningRed}
      icon={connected ? cloudCheck : cloudRemove}
      width={28}
      {...rest}
    />
  )
}

export const SettingsIcon = props => (
  <IconContainer
    activeStyle={white}
    inactiveStyle={inactive}
    icon={cog}
    width={28}
    {...props}
  />
)
export const AboutIcon = props => (
  <IconContainer
    activeStyle={credits}
    inactiveStyle={inactive}
    icon={neo4j}
    width={32}
    {...props}
  />
)

export const SlidePreviousIcon = () => (
  <IconContainer icon={arrowLeft1} width={16} />
)
export const SlideNextIcon = () => (
  <IconContainer icon={arrowRight1} width={16} />
)
export const TableIcon = () => (
  <IconContainer icon={table01} text='Table' width={20} />
)
export const VisualizationIcon = () => (
  <IconContainer icon={neo4j} text='Graph' width={20} />
)
export const AsciiIcon = () => (
  <IconContainer icon={Text201} text='Text' width={18} />
)
export const CodeIcon = () => (
  <IconContainer icon={appWindowCode} text='Code' width={20} />
)
export const PlanIcon = () => (
  <IconContainer className='sl-hierarchy' text='Plan' />
)
export const AlertIcon = () => (
  <IconContainer className='sl-alert' text='Warn' />
)
export const ErrorIcon = () => (
  <IconContainer className='fa fa-file-text-o' text='Error' />
)

export const ZoomInIcon = () => (
  <IconContainer
    activeStyle={inactive}
    inactiveStyle={inactive}
    icon={slZoomInIconSvgRaw}
  />
)
export const ZoomOutIcon = () => (
  <IconContainer
    activeStyle={inactive}
    inactiveStyle={inactive}
    icon={slZoomOutIconSvgRaw}
  />
)

export const BinIcon = props => (
  <IconContainer
    activeStyle={props.deleteAction ? warningRed : white}
    inactiveStyle={props.deleteAction ? warningRed : white}
    {...props}
    className='sl-bin'
  />
)

export const ExpandIcon = () => <IconContainer icon={expand01} width={12} />
export const ContractIcon = () => <IconContainer icon={shrink} width={12} />
export const RefreshIcon = () => (
  <IconContainer icon={buttonRefreshArrow} width={12} />
)
export const CloseIcon = () => <IconContainer icon={close} width={12} />
export const UpIcon = () => <IconContainer icon={arrowUp1} width={12} />
export const DownIcon = () => <IconContainer className='sl-chevron-down' />
export const DoubleUpIcon = () => <IconContainer className='sl-double-up' />
export const DoubleDownIcon = () => <IconContainer className='sl-double-down' />
export const PinIcon = () => <IconContainer icon={pin} width={12} />
export const MinusIcon = () => (
  <IconContainer
    activeStyle={blue}
    inactiveStyle={inactive}
    className='sl-minus-circle'
  />
)
export const RightArrowIcon = () => (
  <IconContainer
    activeStyle={blue}
    inactiveStyle={inactive}
    className='sl-arrow-circle-right'
  />
)
export const CancelIcon = () => (
  <IconContainer
    activeStyle={blue}
    inactiveStyle={inactive}
    className='sl-delete-circle'
  />
)
export const DownloadIcon = () => (
  <IconContainer icon={downloadBottom} width={12} />
)
export const ExpandMenuIcon = () => (
  <IconContainer activeStyle={blue} className='fa fa-caret-left' />
)
export const CollapseMenuIcon = () => (
  <IconContainer activeStyle={blue} className='fa fa-caret-down' />
)
export const PlayIcon = () => (
  <IconContainer
    activeStyle={lightBlue}
    inactiveStyle={blue}
    className='fa fa-play-circle-o'
  />
)
export const PlainPlayIcon = () => (
  <IconContainer className='fa fa-play-circle' />
)
export const QuestionIcon = props => (
  <IconContainer
    activeStyle={lightBlue}
    inactiveStyle={blue}
    {...props}
    className='fa fa-question-circle-o'
  />
)
export const PlusIcon = () => (
  <IconContainer
    activeStyle={white}
    inactiveStyle={white}
    className='fa fa-plus'
  />
)
export const EditIcon = () => (
  <IconContainer
    activeStyle={white}
    inactiveStyle={white}
    className='sl-pencil'
  />
)
export const Spinner = () => (
  <IconContainer className='fa fa-spinner fa-spin fa-2x' />
)
export const SmallSpinner = () => (
  <IconContainer className='fa fa-spinner fa-spin ' />
)
export const SquareIcon = () => <IconContainer className='fa fa-square-o' />
export const CheckedSquareIcon = () => (
  <IconContainer className='fa fa-check-square-o' />
)

export const ExclamationTriangleIcon = () => (
  <IconContainer suppressIconStyles className='fa fa-exclamation-triangle' />
)

export const FireExtinguisherIcon = ({ title = 'Reset' }) => (
  <IconContainer className='fa fa-fire-extinguisher' title={title} />
)

const slZoomOutIconSvgRaw =  '<glyph glyph-name="zoom-out" unicode="&#39;" d="M509 18l-192 192c0 0 0 0 0 0 28 32 46 74 46 121 0 100-82 181-182 181-100 0-181-81-181-181 0-100 81-182 181-182 47 0 89 18 121 46 0 0 0 0 0 0l192-192c2-2 5-3 7-3 3 0 6 1 8 3 4 4 4 11 0 15z m-328 153c-88 0-160 71-160 160 0 88 72 160 160 160 89 0 160-72 160-160 0-89-71-160-160-160z m75 170l-149 0c-6 0-11-4-11-10 0-6 5-11 11-11l149 0c6 0 11 5 11 11 0 6-5 10-11 10z"/>'

const slZoomInIconSvgRaw = '<glyph glyph-name="zoom-in" unicode="&#38;" d="M509 18l-192 192c0 0 0 0 0 0 28 32 46 74 46 121 0 100-82 181-182 181-100 0-181-81-181-181 0-100 81-182 181-182 47 0 89 18 121 46 0 0 0 0 0 0l192-192c2-2 5-3 7-3 3 0 6 1 8 3 4 4 4 11 0 15z m-328 153c-88 0-160 71-160 160 0 88 72 160 160 160 89 0 160-72 160-160 0-89-71-160-160-160z m75 170l-64 0 0 64c0 6-5 11-11 11-6 0-10-5-10-11l0-64-64 0c-6 0-11-4-11-10 0-6 5-11 11-11l64 0 0-64c0-6 4-11 10-11 6 0 11 5 11 11l0 64 64 0c6 0 11 5 11 11 0 6-5 10-11 10z"/>'