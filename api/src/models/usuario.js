const { DataTypes } = require ('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( "usuario" , {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        username:{
            type: DataTypes.STRING,
            defaultValue: "usuario sin ingresar",
            allowNull:false
        },
        password:{
            type: DataTypes.STRING,
            defaultValue: "usuario sin ingresar",
            allowNull:true
         },
        firstname:{
            type: DataTypes.STRING,
            defaultValue: "usuario sin ingresar",
            allowNull:true
         },
        lastname:{
            type: DataTypes.STRING,
            defaultValue: "usuario sin ingresar",
            allowNull:true
        },
        sucursal:{
            type: DataTypes.INTEGER,
            defaultValue:0,
            allowNull:true
        },
        isdelete:{
            type: DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:true
        }

    })
}