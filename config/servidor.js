var fs		 = require('fs');
module.exports = {
    PORT: process.env.PORT || 5000,
    credentialsServer:{
      //ca: fs.readFileSync(__dirname+"/ssl/certificate.ca", 'utf8'), //la certification authority o CA
	    //key: fs.readFileSync(__dirname+"/ssl/midominio.com.key", 'utf8'), //la clave SSL, que es el primer archivo que generamos ;)
	    //cert: fs.readFileSync(__dirname+"/ssl/certificate.crt", 'utf8') //el certificado
    }
};