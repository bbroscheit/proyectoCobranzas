const SUCURSAL_CONFIG = {
  1: {
    nombre: "BASANI S.A.",
    telefonos: ["xxxxxx"],
    cuentas: [
      "xxxxxx",
    ],
  },
  2: {
    nombre: "Cylius",
    telefonos: ["093999820"],
    cuentas: [
      "Banco Santander: Cuenta corriente en pesos Nº56472, Suc. 09 a nombre de Cylius SA",
      "BROU: Caja de ahorro pesos Nº 001566695-00001 a nombre de Cylius SA",
    ],
  },
  3: {
    nombre: "Baebsa",
    telefonos: ["xxxxxx"],
    cuentas: [
      "xxxxxx",
    ],
  },
  4: {
    nombre: "Baxpa",
    telefonos: ["xxxxxx"],
    cuentas: [
      "xxxxxx",
    ],
  },
  5: {
    nombre: "Ecosistemas Patagónicos",
    telefonos: ["xxxxxx"],
    cuentas: [
      "xxxxxx",
    ],
  },
  6: {
    nombre: "Ecobahia",
    telefonos: ["+54 9 2916 44-8993", "+54 9 291 643-3857"],
    cuentas: [
      "Banco Credicoop — CBU: 1910120255012000196700",
    ],
  },
  7: {
    nombre: "Ecoportatiles",
    telefonos: ["xxxxxx"],
    cuentas: [
      "xxxxxx",
    ],
  },
};

function getConfigSucursal(sucursalId) {
  return SUCURSAL_CONFIG[sucursalId] || SUCURSAL_CONFIG[1];
}

module.exports = { SUCURSAL_CONFIG, getConfigSucursal };
