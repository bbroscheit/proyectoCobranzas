const { Usuario } = require('../../bd');

const loginUser = async ( username, password ) => {
    console.log("estoy en loginUser" , username, password)
    let modifiedUsername = username.charAt(0).toUpperCase() + username.slice(1)
    
    try {
        let user = await Usuario.findOne({
            where:{ isdelete:false , username:modifiedUsername, password:password}, 
            
        });
       
        return user;
    } catch (e) {
        console.log("Error en controllers/getUser.js" , e.message)
    }
}



module.exports = loginUser;