import { PIXGenerator } from './pix-generator'
import { type GeneratePIXOptions } from './types'

describe('PIXGenerator', () => {
  describe('generatePIX', () => {
    it('should generate a valid PIX code with all required fields', () => {
      const options: GeneratePIXOptions = {
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: 'Fulano de Tal',
        merchantCity: 'BRASILIA'
      }

      const result = PIXGenerator.generatePIX(options)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(50)
      expect(result).toMatch(/^00020126/)
      expect(result).toMatch(/6304[0-9A-F]{4}$/i)
    })

    it('should match the example from the documentation', () => {
      // Example from the documentation
      const options: GeneratePIXOptions = {
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: 'Fulano de Tal',
        merchantCity: 'BRASILIA'
      }

      const result = PIXGenerator.generatePIX(options)

      // The expected result from the documentation
      const expected = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D'

      expect(result).toBe(expected)
    })

    it('should include description when provided', () => {
      const options: GeneratePIXOptions = {
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: 'Test Merchant',
        merchantCity: 'SAO PAULO',
        description: 'Payment for services'
      }

      const result = PIXGenerator.generatePIX(options)

      expect(result).toContain('0220Payment for services')
    })

    it('should include transaction ID when provided', () => {
      const options: GeneratePIXOptions = {
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: 'Test Merchant',
        merchantCity: 'SAO PAULO',
        transactionId: 'TX123456'
      }

      const result = PIXGenerator.generatePIX(options)

      expect(result).toContain('0508TX123456')
    })

    it('should validate PIX key formats', () => {
      // Valid CPF
      expect(() => PIXGenerator.generatePIX({
        key: '123.456.789-09',
        keyType: 'CPF',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).not.toThrow()

      // Valid CNPJ
      expect(() => PIXGenerator.generatePIX({
        key: '45.723.174/0001-10',
        keyType: 'CNPJ',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).not.toThrow()

      // Valid phone
      expect(() => PIXGenerator.generatePIX({
        key: '+5511999999999',
        keyType: 'PHONE',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).not.toThrow()

      // Valid email
      expect(() => PIXGenerator.generatePIX({
        key: 'test@example.com',
        keyType: 'EMAIL',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).not.toThrow()
    })

    it('should throw error for invalid key formats', () => {
      // Invalid CPF
      expect(() => PIXGenerator.generatePIX({
        key: '123.456.789-10',
        keyType: 'CPF',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).toThrow('Invalid CPF key format')

      // Invalid CNPJ
      expect(() => PIXGenerator.generatePIX({
        key: '12.345.678/0001-91',
        keyType: 'CNPJ',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).toThrow('Invalid CNPJ key format')

      // Invalid phone
      expect(() => PIXGenerator.generatePIX({
        key: '123',
        keyType: 'PHONE',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).toThrow('Invalid PHONE key format')

      // Invalid email
      expect(() => PIXGenerator.generatePIX({
        key: 'invalid-email',
        keyType: 'EMAIL',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).toThrow('Invalid EMAIL key format')
    })

    it('should throw error for missing required fields', () => {
      expect(() => PIXGenerator.generatePIX({
        key: '',
        keyType: 'RANDOM',
        merchantName: 'Test',
        merchantCity: 'Test'
      })).toThrow('Missing required fields')

      expect(() => PIXGenerator.generatePIX({
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: '',
        merchantCity: 'Test'
      })).toThrow('Missing required fields')
    })

    it('should throw error for merchant name too long', () => {
      expect(() => PIXGenerator.generatePIX({
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: 'This merchant name is way too long and exceeds the limit',
        merchantCity: 'Test'
      })).toThrow('Merchant name must be 25 characters or less')
    })

    it('should throw error for merchant city too long', () => {
      expect(() => PIXGenerator.generatePIX({
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: 'Test',
        merchantCity: 'This city name is way too long and exceeds the limit'
      })).toThrow('Merchant city must be 15 characters or less')
    })
  })

  describe('generateRandomKey', () => {
    it('should generate a valid UUID', () => {
      const key = PIXGenerator.generateRandomKey()

      expect(key).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('should generate different keys on multiple calls', () => {
      const key1 = PIXGenerator.generateRandomKey()
      const key2 = PIXGenerator.generateRandomKey()

      expect(key1).not.toBe(key2)
    })
  })

  describe('validatePIXCode', () => {
    it('should validate a correct PIX code', () => {
      const validPIXCode = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D'

      expect(PIXGenerator.validatePIXCode(validPIXCode)).toBe(true)
    })

    it('should reject invalid PIX codes', () => {
      expect(PIXGenerator.validatePIXCode('')).toBe(false)
      expect(PIXGenerator.validatePIXCode('invalid')).toBe(false)
      expect(PIXGenerator.validatePIXCode('00020126')).toBe(false)
      expect(PIXGenerator.validatePIXCode('00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***6304XXXX')).toBe(false)
    })

    it('should validate generated PIX codes', () => {
      const options: GeneratePIXOptions = {
        key: '123e4567-e12b-12d1-a456-426655440000',
        keyType: 'RANDOM',
        merchantName: 'Test Merchant',
        merchantCity: 'SAO PAULO'
      }

      const generatedPIX = PIXGenerator.generatePIX(options)
      expect(PIXGenerator.validatePIXCode(generatedPIX)).toBe(true)
    })
  })
})
