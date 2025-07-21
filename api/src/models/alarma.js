const { DataTypes } = require ('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( "alarma" , {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        detail:{
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull:false
        },
        usuario:{
            type: DataTypes.STRING,
            defaultValue: " nombre de usuario sin definir ",
            allowNull:true
        },
        fecha:{
            type: DataTypes.DATE,
            defaultValue: Date.now(),
            allowNull:true
        },
        estado:{
            type: DataTypes.STRING,
            defaultValue: "pendiente",
            allowNull:true
        },        
    })
}