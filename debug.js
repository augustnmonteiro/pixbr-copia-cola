const { generatePIX } = require('./dist/index.js');

// Test the example from documentation
const options = {
  key: '123e4567-e12b-12d1-a456-426655440000',
  keyType: 'RANDOM',
  merchantName: 'Fulano de Tal',
  merchantCity: 'BRASILIA'
};

console.log('Generating PIX code...');
const result = generatePIX(options);
console.log('Generated:', result);

// Expected from documentation
const expected = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D';
console.log('Expected:', expected);

console.log('Match:', result === expected);

// Test CRC16 calculation - we'll need to extract it from the result
const crc16Match = result.match(/6304([0-9A-F]{4})$/i);
if (crc16Match) {
  console.log('Extracted CRC16:', crc16Match[1]);
  console.log('Expected CRC16: 1D3D');
  console.log('CRC16 Match:', crc16Match[1] === '1D3D');
} 