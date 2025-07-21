const { DataTypes } = require ('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( "tarea" , {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        tareastotales:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull:false
        },
        tareascompletadas:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull:true
         },
        usuario:{
            type: DataTypes.STRING,
            defaultValue: "usuario sin ingresar",
            allowNull:true
        },
        fecha:{
            type: DataTypes.DATE,
            defaultValue: Date.now(),
            allowNull:true
        }

    })
}