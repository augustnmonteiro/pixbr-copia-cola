# PIX Copia e Cola SDK

A JavaScript/TypeScript SDK for generating PIX (Brazilian payment system) copy-paste codes according to the official Brazilian Central Bank specification.

SDK JavaScript/TypeScript para gerar códigos PIX copia e cola (sistema de pagamento brasileiro) de acordo com a especificação oficial do Banco Central do Brasil.

## Features / Funcionalidades

- ✅ Generate PIX copy-paste codes for all key types (CPF, CNPJ, Phone, Email, Random)
- ✅ Validate PIX key formats
- ✅ Generate random UUID keys
- ✅ Validate generated PIX codes
- ✅ Full TypeScript support
- ✅ Comprehensive test coverage
- ✅ Follows official Brazilian PIX specification

- ✅ Gerar códigos PIX copia e cola para todos os tipos de chave (CPF, CNPJ, Telefone, Email, Aleatória)
- ✅ Validar formatos de chave PIX
- ✅ Gerar chaves UUID aleatórias
- ✅ Validar códigos PIX gerados
- ✅ Suporte completo ao TypeScript
- ✅ Cobertura abrangente de testes
- ✅ Segue a especificação oficial PIX do Banco Central do Brasil

## Installation / Instalação

```bash
npm install @pixbr/copia-cola
```

## Quick Start / Início Rápido

```javascript
import { generatePIX } from '@pixbr/copia-cola';

const pixCode = generatePIX({
  key: '123e4567-e12b-12d1-a456-426655440000',
  keyType: 'RANDOM',
  merchantName: 'Fulano de Tal',
  merchantCity: 'BRASILIA'
});

console.log(pixCode);
// Output: 00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D
```

## API Reference / Referência da API

### `generatePIX(options)`

Generates a PIX copy-paste code according to the Brazilian PIX specification.

Gera um código PIX copia e cola de acordo com a especificação PIX brasileira.

#### Parameters / Parâmetros

- `options` (object):
  - `key` (string, required): The PIX key / A chave PIX
  - `keyType` (string, required): Type of key - `'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'RANDOM'` / Tipo de chave
  - `merchantName` (string, required): Merchant name (max 25 characters) / Nome do comerciante (máx 25 caracteres)
  - `merchantCity` (string, required): Merchant city (max 15 characters) / Cidade do comerciante (máx 15 caracteres)
  - `description` (string, optional): Additional description / Descrição adicional
  - `transactionId` (string, optional): Transaction identifier (max 25 alphanumeric characters) / Identificador da transação (máx 25 caracteres alfanuméricos)

#### Returns / Retorna

- `string`: The PIX copy-paste code that can be used to generate QR codes / O código PIX copia e cola que pode ser usado para gerar códigos QR

## Usage Examples / Exemplos de Uso

### Basic Usage / Uso Básico

```javascript
import { generatePIX } from '@pixbr/copia-cola';

// Generate PIX with random key
// Gerar PIX com chave aleatória
const pixCode = generatePIX({
  key: '123e4567-e12b-12d1-a456-426655440000',
  keyType: 'RANDOM',
  merchantName: 'My Store',
  merchantCity: 'SAO PAULO'
});
```

### With Description / Com Descrição

```javascript
const pixCode = generatePIX({
  key: '123e4567-e12b-12d1-a456-426655440000',
  keyType: 'RANDOM',
  merchantName: 'My Store',
  merchantCity: 'SAO PAULO',
  description: 'Payment for order #12345'
});
```

### With Transaction ID / Com ID da Transação

```javascript
const pixCode = generatePIX({
  key: '123e4567-e12b-12d1-a456-426655440000',
  keyType: 'RANDOM',
  merchantName: 'My Store',
  merchantCity: 'SAO PAULO',
  transactionId: 'TX123456789'
});
```

### Different Key Types / Diferentes Tipos de Chave

```javascript
// CPF
generatePIX({
  key: '123.456.789-09',
  keyType: 'CPF',
  merchantName: 'John Doe',
  merchantCity: 'RIO DE JANEIRO'
});

// CNPJ
generatePIX({
  key: '12.345.678/0001-90',
  keyType: 'CNPJ',
  merchantName: 'Company Ltd',
  merchantCity: 'SAO PAULO'
});

// Phone / Telefone
generatePIX({
  key: '+5511999999999',
  keyType: 'PHONE',
  merchantName: 'John Doe',
  merchantCity: 'BRASILIA'
});

// Email
generatePIX({
  key: 'john@example.com',
  keyType: 'EMAIL',
  merchantName: 'John Doe',
  merchantCity: 'CURITIBA'
});
```

## Key Format Validation / Validação de Formato de Chave

The SDK validates PIX keys according to Brazilian standards:

O SDK valida as chaves PIX de acordo com os padrões brasileiros:

- **CPF**: `XXX.XXX.XXX-XX` or `XXXXXXXXXXX` (11 digits / 11 dígitos)
- **CNPJ**: `XX.XXX.XXX/XXXX-XX` or `XXXXXXXXXXXXXX` (14 digits / 14 dígitos)
- **Phone / Telefone**: `+55XXXXXXXXXXX` or `XXXXXXXXXXX` (10-11 digits / 10-11 dígitos)
- **Email**: Standard email format / Formato padrão de email
- **Random / Aleatória**: UUID format (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`)

## Error Handling / Tratamento de Erros

The SDK throws descriptive errors for invalid inputs:

O SDK lança erros descritivos para entradas inválidas:

```javascript
try {
  const pixCode = generatePIX({
    key: 'invalid-cpf',
    keyType: 'CPF',
    merchantName: 'Test',
    merchantCity: 'Test'
  });
} catch (error) {
  console.error(error.message); // "Invalid CPF key format: invalid-cpf"
}
```

## Development / Desenvolvimento

### Running Tests / Executando Testes

```bash
npm test
```

### Building / Compilando

```bash
npm run build
```

### Linting / Verificação de Código

```bash
npm run lint
```

## Specification Compliance / Conformidade com Especificação

This SDK follows the official Brazilian PIX specification for static QR codes, implementing:

Este SDK segue a especificação oficial PIX brasileira para códigos QR estáticos, implementando:

- EMV QR Code format / Formato EMV QR Code
- CRC16-CCITT checksum calculation / Cálculo de checksum CRC16-CCITT
- Proper field formatting and validation / Formatação e validação adequada de campos
- Support for all PIX key types / Suporte para todos os tipos de chave PIX
- Transaction ID support (EMV 62-05) / Suporte a ID de transação (EMV 62-05)
- Additional description support (EMV 26-02) / Suporte a descrição adicional (EMV 26-02)
