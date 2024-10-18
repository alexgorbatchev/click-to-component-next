/**
 * @typedef {import('./types').ClickToComponentProps} Props
 * @typedef {import('./types').Coords} Coords
 */

import { FloatingPortal } from '@floating-ui/react'
import { html } from 'htm/react'
import * as React from 'react'

import { ContextMenu } from './ContextMenu.js'
import { getPathToSource } from './getPathToSource.js'
import { getSourceForElement } from './getSourceForElement.js'
import { getUrl } from './getUrl.js'

export const State = /** @type {const} */ ({
  IDLE: 'IDLE',
  HOVER: 'HOVER',
  SELECT: 'SELECT',
})

const isJavaScriptProtocol =
  // eslint-disable-next-line no-control-regex
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i

/**
 * @param {Props} props
 */
export function ClickToComponent({ editor = 'vscode', getEditorUrl }) {
  const [state, setState] = React.useState(
    /** @type {State[keyof State]} */
    (State.IDLE)
  )

  const [target, setTarget] = React.useState(
    /** @type {HTMLElement | null} */
    (null)
  )

  const onClick = React.useCallback(
    function handleClick(
      /**
       * @type {MouseEvent}
       */
      event
    ) {
      if (state === State.HOVER && target instanceof HTMLElement) {
        const source = getSourceForElement(target)
        const { path, column, line } = getPathToSource(source)
        const url = getUrl({
          editor,
          path,
          column,
          line,
          getEditorUrl,
        })

        event.preventDefault()
        if (isJavaScriptProtocol.test(url)) {
          console.warn(`ClickToComponent has blocked a javascript: URL as a security precaution`)
          return
        }
        window.location.assign(url)

        setState(State.IDLE)
      }
    },
    [editor, state, target, getEditorUrl]
  )

  const onClose = React.useCallback(
    function handleClose(returnValue) {
      if (returnValue) {
        const url = getUrl({
          path: '',
          line: 0,
          column: 0,
          editor,
          getEditorUrl,
          pathToSource: returnValue,
        })
        if (isJavaScriptProtocol.test(url)) {
          console.warn(`ClickToComponent has blocked a javascript: URL as a security precaution`)
          return
        }
        window.location.assign(url)
      }

      setState(State.IDLE)
    },
    [editor, getEditorUrl]
  )

  const onContextMenu = React.useCallback(
    function handleContextMenu(
      /**
       * @type {MouseEvent}
       */
      event
    ) {
      const { target } = event

      if (state === State.HOVER && target instanceof HTMLElement) {
        event.preventDefault()

        setState(State.SELECT)
        setTarget(target)
      }
    },
    [state]
  )

  const onKeyDown = React.useCallback(
    function handleKeyDown(
      /**
       * @type {KeyboardEvent}
       */
      event
    ) {
      switch (state) {
        case State.IDLE:
          if (event.altKey) setState(State.HOVER)
          break

        default:
      }
    },
    [state]
  )

  const onKeyUp = React.useCallback(
    function handleKeyUp(
      /**
       * @type {KeyboardEvent}
       */
      event
    ) {
      switch (state) {
        case State.HOVER:
          setState(State.IDLE)
          break

        default:
      }
    },
    [state]
  )

  const onMouseMove = React.useCallback(
    function handleMouseMove(
      /** @type {MouseEvent} */
      event
    ) {
      if (!(event.target instanceof HTMLElement)) {
        return
      }

      switch (state) {
        case State.IDLE:
        case State.HOVER:
          setTarget(event.target)
          break

        default:
          break
      }
    },
    [state]
  )

  const onBlur = React.useCallback(
    function handleBlur() {
      switch (state) {
        case State.HOVER:
          setState(State.IDLE)
          break

        default:
      }
    },
    [state]
  )

  React.useEffect(
    function toggleIndicator() {
      for (const element of Array.from(document.querySelectorAll('[data-click-to-component-target]'))) {
        if (element instanceof HTMLElement) {
          delete element.dataset.clickToComponentTarget
        }
      }

      if (state === State.IDLE) {
        delete window.document.body.dataset.clickToComponent
        if (target) {
          delete target.dataset.clickToComponentTarget
        }
        return
      }

      if (target instanceof HTMLElement) {
        window.document.body.dataset.clickToComponent = state
        target.dataset.clickToComponentTarget = state
      }
    },
    [state, target]
  )

  React.useEffect(
    function addEventListenersToWindow() {
      window.addEventListener('click', onClick, { capture: true })
      window.addEventListener('contextmenu', onContextMenu, { capture: true })
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('blur', onBlur)

      return function removeEventListenersFromWindow() {
        window.removeEventListener('click', onClick, { capture: true })
        window.removeEventListener('contextmenu', onContextMenu, {
          capture: true,
        })
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('blur', onBlur)
      }
    },
    [onClick, onContextMenu, onKeyDown, onKeyUp, onMouseMove, onBlur]
  )

  return html`
    <style key="click-to-component-style">
      [data-click-to-component] * {
        pointer-events: auto !important;
      }

      [data-click-to-component-target] {
        cursor: var(--click-to-component-cursor, context-menu) !important;
        outline: auto 1px;
      }

      @supports (outline-color: Highlight) {
        [data-click-to-component-target] {
          outline: var(
            --click-to-component-outline,
            Highlight auto 1px
          ) !important;
        }
      }

      @supports (outline-color: -webkit-focus-ring-color) {
        [data-click-to-component-target] {
          outline: var(
            --click-to-component-outline,
            -webkit-focus-ring-color auto 1px
          ) !important;
        }
      }
    </style>

    <${FloatingPortal} key="click-to-component-portal">
      ${html`<${ContextMenu} key="click-to-component-contextmenu" onClose=${onClose} />`}
    </${FloatingPortal}
  `
}
