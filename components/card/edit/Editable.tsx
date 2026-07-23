'use client'

import { useRef } from 'react'
import { useEdit } from './EditContext'

// Click-to-edit text, rendered INLINE on the real page. On the public page (no
// EditProvider) it's a plain element — zero overhead, identical output. In the
// builder it becomes contentEditable: click → type → blur saves. This is the
// "no forms, edit on the page" primitive.
export function Editable({
  blockId,
  field,
  value,
  as: Tag = 'span',
  placeholder,
  className = '',
  style,
  multiline = false,
}: {
  blockId: string
  field: string
  value: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div'
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  multiline?: boolean
}) {
  const { editing, onText } = useEdit()
  const ref = useRef<HTMLElement | null>(null)

  if (!editing) {
    // Public render: plain, exactly as before. Empty optional fields render
    // nothing (no stray empty element on the live page).
    if (!value) return null
    return <Tag className={className} style={style}>{value}</Tag>
  }

  const commit = () => {
    const text = ref.current?.innerText ?? ''
    if (text !== value) onText(blockId, field, text.trim())
  }

  return (
    <Tag
      // @ts-expect-error – ref type across the union of tags is fine at runtime
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={commit}
      onKeyDown={e => {
        // single-line fields commit on Enter; multiline allows newlines
        if (!multiline && e.key === 'Enter') {
          e.preventDefault()
          ;(e.target as HTMLElement).blur()
        }
      }}
      style={style}
      className={`ww-editable ${!value ? 'ww-editable-empty' : ''} ${className}`}
    >
      {value}
    </Tag>
  )
}
