/**
 * Calculates CRC16-CCITT checksum for PIX specification
 * @param data - The data string to calculate CRC16 for
 * @returns CRC16 checksum as hexadecimal string
 */
export function calculateCRC16 (data: string): string {
  let crc = 0xFFFF
  const polynomial = 0x1021

  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i)
    crc ^= (byte << 8)

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF
      } else {
        crc = (crc << 1) & 0xFFFF
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Formats an EMV field with ID, length, and value
 * @param id - Field ID (2 digits)
 * @param value - Field value
 * @returns Formatted EMV field string
 */
export function formatEMVField (id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0')
  return `${id}${length}${value}`
}

/**
 * Creates a merchant account information field for PIX
 * @param key - PIX key
 * @param description - Optional description
 * @returns Formatted merchant account information
 */
export function createMerchantAccountInformation (key: string, description?: string): string {
  const gui = formatEMVField('00', 'br.gov.bcb.pix')
  const keyField = formatEMVField('01', key)

  let additionalInfo = ''
  if (typeof description === 'string' && description.trim() !== '') {
    // Limit description to fit within EMV constraints
    const maxLength = 72 // Maximum for infoAdicional field
    const truncatedDescription = description.trim().substring(0, maxLength)
    additionalInfo = formatEMVField('02', truncatedDescription)
  }

  const content = gui + keyField + additionalInfo
  return formatEMVField('26', content)
}

/**
 * Creates additional data field template with transaction ID
 * @param transactionId - Optional transaction ID
 * @returns Formatted additional data field template
 */
export function createAdditionalDataFieldTemplate (transactionId?: string): string {
  if (typeof transactionId !== 'string' || transactionId.trim() === '') {
    return formatEMVField('62', formatEMVField('05', '***'))
  }

  // Validate transaction ID format (only alphanumeric characters)
  const validTransactionId = transactionId.replace(/[^a-zA-Z0-9]/g, '')
  const txid = validTransactionId.substring(0, 25) // Limit to 25 characters

  return formatEMVField('62', formatEMVField('05', txid))
}

function isValidCPF (cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i)
  let firstCheck = (sum * 10) % 11
  if (firstCheck === 10) firstCheck = 0
  if (firstCheck !== parseInt(cpf.charAt(9))) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i)
  let secondCheck = (sum * 10) % 11
  if (secondCheck === 10) secondCheck = 0
  return secondCheck === parseInt(cpf.charAt(10))
}

function isValidCNPJ (cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '')
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false
  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  const digits = cnpj.substring(length)
  let sum = 0
  let pos = length - 7
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false
  length = length + 1
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(digits.charAt(1))
}

/**
 * Validates PIX key based on key type
 * @param key - The PIX key to validate
 * @param keyType - The type of key
 * @returns True if valid, false otherwise
 */
export function validatePIXKey (key: string, keyType: string): boolean {
  switch (keyType) {
    case 'CPF': {
      const cpfRegex = /^(\d{3}\.??\d{3}\.??\d{3}-??\d{2})$/
      if (!cpfRegex.test(key)) return false
      return isValidCPF(key)
    }
    case 'CNPJ': {
      const cnpjRegex = /^(\d{2}\.??\d{3}\.??\d{3}\/??\d{4}-??\d{2})$/
      if (!cnpjRegex.test(key)) return false
      return isValidCNPJ(key)
    }
    case 'PHONE': {
      const phoneRegex = /^(\+55)?\d{10,11}$/
      return phoneRegex.test(key)
    }
    case 'EMAIL': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(key)
    }
    case 'RANDOM': {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      return uuidRegex.test(key)
    }
    default:
      return false
  }
}
