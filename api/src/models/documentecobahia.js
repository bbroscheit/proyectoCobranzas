const { DataTypes } = require ('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( "documentecobahia" , {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        numerodocumento:{
            type: DataTypes.STRING,
            defaultValue: " nombre de usuario sin definir ",
            allowNull:false
        },
        fechadocumento:{
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
            allowNull:true
         },
        fechavencimiento:{
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
            allowNull:true
        },
        numerocliente:{
            type: DataTypes.INTEGER,
            defaultValue: "00000000",
            allowNull:false
        },
        montopendiente:{
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
            allowNull:false
        },
        montooriginal:{
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
            allowNull:false
        },
        tipodocumento:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull:false
        },
        clientId: {   // 👈 este es el foreign key
            type: DataTypes.INTEGER,
            allowNull: false
        }
            
    })
}