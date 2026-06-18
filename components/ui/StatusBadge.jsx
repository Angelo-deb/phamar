'use client'
import { drugStatus, STATUS_MAP } from '../../lib/data'

export default function StatusBadge({ d }) {
  const s = drugStatus(d)
  const { label, cls } = STATUS_MAP[s]
  return <span className={cls}>{label}</span>
}
