import { PIXGenerator } from './pix-generator'
import type { GeneratePIXOptions } from './types'

export type { GeneratePIXOptions } from './types'

/**
 * Main function to generate PIX copy-paste code
 * @param options - Configuration options for PIX generation
 * @returns The PIX copy-paste code string
 */
export function generatePIX (options: GeneratePIXOptions): string {
  return PIXGenerator.generatePIX(options)
}
