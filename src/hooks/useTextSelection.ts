import { useState, useEffect, useCallback, RefObject } from 'react'

interface SelectionState {
  hasSelection: boolean
  selectedText: string
  selectionStart: number
  selectionEnd: number
  buttonTop: number    // px from top of textarea container
  buttonLeft: number   // px from left of textarea container
}

const EMPTY: SelectionState = {
  hasSelection: false,
  selectedText: '',
  selectionStart: 0,
  selectionEnd: 0,
  buttonTop: 0,
  buttonLeft: 0,
}

/**
 * Measures the pixel position of a character index inside a textarea
 * using a hidden mirror div that replicates the textarea's font/padding.
 */
function getMirrorPosition(
  textarea: HTMLTextAreaElement,
  charIndex: number
): { top: number; left: number } {
  const mirror = document.createElement('div')
  const style = window.getComputedStyle(textarea)

  // Copy all layout-affecting styles
  ;[
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
    'letterSpacing', 'lineHeight', 'textTransform',
    'wordWrap', 'whiteSpace', 'wordBreak',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'boxSizing',
  ].forEach((prop) => {
    mirror.style[prop as any] = style[prop as any]
  })

  mirror.style.position = 'absolute'
  mirror.style.visibility = 'hidden'
  mirror.style.overflow = 'hidden'
  mirror.style.width = textarea.offsetWidth + 'px'
  mirror.style.height = textarea.offsetHeight + 'px'
  mirror.style.top = '0'
  mirror.style.left = '0'
  mirror.style.whiteSpace = 'pre-wrap'
  mirror.style.wordBreak = 'break-word'

  const textBefore = textarea.value.substring(0, charIndex)
  const span = document.createElement('span')
  span.textContent = textBefore || '\u200b'

  // Cursor marker
  const marker = document.createElement('span')
  marker.textContent = '\u200b'
  marker.style.display = 'inline'

  mirror.appendChild(span)
  mirror.appendChild(marker)
  textarea.parentElement?.appendChild(mirror)

  const markerRect = marker.getBoundingClientRect()
  const textareaRect = textarea.getBoundingClientRect()

  const top = markerRect.top - textareaRect.top
  const left = markerRect.left - textareaRect.left

  mirror.remove()
  return { top, left }
}

export function useTextSelection(textareaRef: RefObject<HTMLTextAreaElement>) {
  const [selection, setSelection] = useState<SelectionState>(EMPTY)

  const update = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start === null || end === null || start === end) {
      setSelection(EMPTY)
      return
    }

    const selectedText = textarea.value.substring(start, end)
    if (!selectedText.trim()) {
      setSelection(EMPTY)
      return
    }

    // Position button above the midpoint of the selection
    const midIndex = Math.floor((start + end) / 2)
    const { top, left } = getMirrorPosition(textarea, midIndex)

    // Place the button ~36px above the line
    setSelection({
      hasSelection: true,
      selectedText,
      selectionStart: start,
      selectionEnd: end,
      buttonTop: top - 36,
      buttonLeft: Math.max(0, left - 40),
    })
  }, [textareaRef])

  const clear = useCallback(() => setSelection(EMPTY), [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.addEventListener('mouseup', update)
    textarea.addEventListener('keyup', update)
    textarea.addEventListener('blur', clear)

    return () => {
      textarea.removeEventListener('mouseup', update)
      textarea.removeEventListener('keyup', update)
      textarea.removeEventListener('blur', clear)
    }
  }, [textareaRef, update, clear])

  return selection
}
