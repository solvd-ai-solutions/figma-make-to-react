import React from 'react'
import * as Icons from '@/generated/icons'

export interface IconProps {
  name: keyof typeof Icons
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const Cmp = Icons[name] as React.ComponentType<{ className?: string }>
  if (!Cmp) return null
  return <Cmp className={className} />
}

