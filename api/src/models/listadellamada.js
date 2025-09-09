const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("listadellamada", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    clientes: {
      type: DataTypes.JSONB, // JSONB en Postgres
      allowNull: false,
      defaultValue: [], // array vacío por defecto
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
      allowNull: true,
    },
  });
};
