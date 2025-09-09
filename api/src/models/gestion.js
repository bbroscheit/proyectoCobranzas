const { DataTypes } = require ('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( "gestion" , {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        gestion:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull:false
        },
        gestioncompletada:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull:true
         },
        fecha:{
            type: DataTypes.DATE,
            defaultValue: Date.now(),
            allowNull:true
        }

    })
}