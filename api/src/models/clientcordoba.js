const { DataTypes } = require ('sequelize');

module.exports = ( sequelize ) => {
    sequelize.define( "clientcordoba" , {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING,
            defaultValue: " nombre de usuario sin definir ",
            allowNull:false
        },
        gestor:{
            type: DataTypes.STRING,
            defaultValue: " gestor sin ingresar ",
            allowNull:true
         },
        contacto1:{
            type: DataTypes.STRING,
            defaultValue: " nombre de usuario sin definir ",
            allowNull:true
        },
        // contacto2:{
        //     type: DataTypes.STRING,
        //     defaultValue: " nombre de usuario sin definir ",
        //     allowNull:false
        // },
        email:{
            type: DataTypes.STRING,
            defaultValue: " sin definir",
            allowNull:false
        },
        // phonenumber:{
        //     type: DataTypes.INTEGER,
        //     defaultValue: " nombre de usuario sin definir ",
        //     allowNull:false
        // },
        nuevo:{
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull:false
        }
  
    })
}