const { DataTypes } = require ('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( "note" , {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        detail:{
            type: DataTypes.STRING,
            defaultValue: " detalle sin ingresar ",
            allowNull:false
        },
        typecontact:{
            type: DataTypes.STRING,
            defaultValue: "correo electronico ",
            allowNull:true
         },
        user:{
            type: DataTypes.STRING,
            defaultValue: "usuario sin ingresar",
            allowNull:false
        },
        sucursal:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull:false  
        },
        client:{
            type: DataTypes.INTEGER,
            defaultValue:0,
            allowNull:false
        }
    })
}