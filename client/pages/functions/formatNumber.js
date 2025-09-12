export  function formatNumber (num)  {
    if(num){
        return num.toLocaleString('es-AR'); 
    } else {
        return "0"
    }
};