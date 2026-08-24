import { createContext, useContext, type ReactNode } from 'react'

export interface MuninTamaguiTokens {
  interactive: string
  interactiveHover: string
  border: string
  surface: string
  surfaceInset: string
  textPrimary: string
  textSecondary: string
  success: string
  warning: string
}

export const defaultTokens: MuninTamaguiTokens = {
  interactive: '$interactive',
  interactiveHover: '$interactiveHover',
  border: '$border',
  surface: '$surface',
  surfaceInset: '$surfaceInset',
  textPrimary: '$textPrimary',
  textSecondary: '$textSecondary',
  success: '$success',
  warning: '$warning',
}

const MuninTokensContext = createContext<MuninTamaguiTokens>(defaultTokens)

export function MuninProvider({ tokens, children }: { tokens?: Partial<MuninTamaguiTokens>; children: ReactNode }) {
  const merged = { ...defaultTokens, ...tokens }
  return <MuninTokensContext.Provider value={merged}>{children}</MuninTokensContext.Provider>
}

export function useMuninTokens(): MuninTamaguiTokens {
  return useContext(MuninTokensContext)
}
