export type PIXKeyType = 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'RANDOM'

export interface GeneratePIXOptions {
  key: string
  keyType: PIXKeyType
  merchantName: string
  merchantCity: string
  description?: string
  amount?: number
  transactionId?: string
}

export interface PIXPayload {
  payloadFormatIndicator: string
  merchantAccountInformation: string
  merchantCategoryCode: string
  transactionCurrency: string
  countryCode: string
  merchantName: string
  merchantCity: string
  additionalDataFieldTemplate?: string
  crc16: string
}
