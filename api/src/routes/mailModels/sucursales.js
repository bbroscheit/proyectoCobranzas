const NOMBRES_SUCURSAL = {
  1: 'BASANI S.A.',
  2: 'Cylius',
  3: 'Baebsa',
  4: 'Baxpa',
  5: 'Ecosistemas Patagónicos',
  6: 'Ecobahia',
  7: 'Ecoportatiles',
};

function getNombreSucursal(sucursal) {
  return NOMBRES_SUCURSAL[sucursal] || 'BASANI S.A.';
}

module.exports = { NOMBRES_SUCURSAL, getNombreSucursal };
