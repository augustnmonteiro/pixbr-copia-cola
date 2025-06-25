import { type GeneratePIXOptions, type PIXPayload } from './types'
import {
  calculateCRC16,
  formatEMVField,
  createMerchantAccountInformation,
  createAdditionalDataFieldTemplate,
  validatePIXKey
} from './utils'

/**
 * PIX Generator namespace for creating PIX copy-paste codes
 */
export const PIXGenerator = {
  /**
   * Generates a random UUID for PIX keys
   * @returns A valid UUID string
   */
  generateRandomKey (): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },

  /**
   * Generates a PIX copy-paste code according to Brazilian PIX specification
   * @param options - Configuration options for PIX generation
   * @returns The PIX copy-paste code string
   */
  generatePIX (options: GeneratePIXOptions): string {
    // Validate required fields
    if (
      typeof options.key !== 'string' || options.key.trim() === '' ||
      typeof options.keyType !== 'string' || options.keyType.trim() === '' ||
      typeof options.merchantName !== 'string' || options.merchantName.trim() === '' ||
      typeof options.merchantCity !== 'string' || options.merchantCity.trim() === ''
    ) {
      throw new Error('Missing required fields: key, keyType, merchantName, and merchantCity are required')
    }

    // Validate PIX key format
    if (!validatePIXKey(options.key, options.keyType)) {
      throw new Error(`Invalid ${options.keyType} key format: ${options.key}`)
    }

    // Validate merchant name length (max 25 characters)
    if (typeof options.merchantName !== 'string' || options.merchantName.length > 25) {
      throw new Error('Merchant name must be 25 characters or less')
    }

    // Validate merchant city length (max 15 characters)
    if (typeof options.merchantCity !== 'string' || options.merchantCity.length > 15) {
      throw new Error('Merchant city must be 15 characters or less')
    }

    // Build the PIX payload
    const payload = PIXGenerator.buildPIXPayload(options)

    // Generate the final EMV QR Code string
    return PIXGenerator.buildEMVString(payload)
  },

  /**
   * Builds the PIX payload structure
   * @param options - PIX generation options
   * @returns PIX payload object
   */
  buildPIXPayload (options: GeneratePIXOptions): PIXPayload {
    return {
      payloadFormatIndicator: formatEMVField('00', '01'), // Static QR Code
      merchantAccountInformation: createMerchantAccountInformation(options.key, options.description),
      merchantCategoryCode: formatEMVField('52', '0000'), // MCC not specified
      transactionCurrency: formatEMVField('53', '986'), // BRL (Brazilian Real)
      countryCode: formatEMVField('58', 'BR'), // Brazil
      merchantName: formatEMVField('59', options.merchantName),
      merchantCity: formatEMVField('60', options.merchantCity),
      additionalDataFieldTemplate: createAdditionalDataFieldTemplate(options.transactionId),
      crc16: '' // Will be calculated later
    }
  },

  /**
   * Builds the complete EMV QR Code string
   * @param payload - PIX payload object
   * @returns Complete EMV QR Code string
   */
  buildEMVString (payload: PIXPayload): string {
    // Build the main payload without CRC16
    const mainPayload =
      payload.payloadFormatIndicator +
      payload.merchantAccountInformation +
      payload.merchantCategoryCode +
      payload.transactionCurrency +
      payload.countryCode +
      payload.merchantName +
      payload.merchantCity +
      (payload.additionalDataFieldTemplate ?? '')

    // Per BR Code spec, CRC16 is calculated over the payload + '6304'
    const payloadForCRC = mainPayload + '6304'
    const crc16 = calculateCRC16(payloadForCRC)

    // Return complete EMV string with CRC16 field
    return mainPayload + formatEMVField('63', crc16)
  },

  /**
   * Validates if a PIX copy-paste code is valid
   * @param pixCode - The PIX code to validate
   * @returns True if valid, false otherwise
   */
  validatePIXCode (pixCode: string): boolean {
    try {
      // Basic format validation
      if (typeof pixCode !== 'string' || pixCode.length < 50) {
        return false
      }

      // Check if it starts with the expected format
      if (!pixCode.startsWith('000201')) {
        return false
      }

      // Check if it ends with CRC16 (4 hex characters after 6304)
      const crc16Match = pixCode.match(/6304([0-9A-F]{4})$/i)
      if (!crc16Match) {
        return false
      }

      // Extract the main payload (everything up to and including '6304')
      const crcIndex = pixCode.length - 8
      const mainPayload = pixCode.substring(0, crcIndex + 4) // include '6304'
      const expectedCRC16 = crc16Match[1]

      // Calculate expected CRC16
      const calculatedCRC16 = calculateCRC16(mainPayload)

      return expectedCRC16.toUpperCase() === calculatedCRC16.toUpperCase()
    } catch (error) {
      return false
    }
  }
}
