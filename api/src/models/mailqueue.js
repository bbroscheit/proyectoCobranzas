const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("mailqueue", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    replyTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // tipo de mail: 'estadoCuenta' | 'facturaEmitida' | 'facturaPorVencer' | 'facturaVencida'
    tipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // para deduplicación: id del cliente en su tabla de sucursal
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // fecha de referencia del proceso que generó el mail (para evitar reenvíos en el mismo día)
    referenceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};
