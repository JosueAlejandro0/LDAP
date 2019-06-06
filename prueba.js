var ldap = require('ldapjs');
var path = require('path');
var assert = require('assert');
var config = require('./config/ldap');
var fs = require('fs');
var client = ldap.createClient({
    url: 'ldaps://10.228.193.134:636',
    tlsOptions: {
      ca: [ fs.readFileSync(path.resolve('../LDAP-master/config/CPRIIUATACDY01.cer') )],
      rejectUnauthorized:false  
    }, 
    reconnect: true
  });
  
client.on('error', function(err) {
    console.warn( err);
});

async function connectA(req, res){
    await client.bind(config.credentialsUser.user,config.credentialsUser.pass, function(err) {
        assert.ifError(err);    
        modifyadd(); 
    });
  }
async function modifyadd(req){
    try{
  var memberof = ["CN=Domain Users,CN=Users,DC=dssatuat,DC=sat,DC=gob,DC=mx",
    "CN=uann11,OU=SATCPN,OU=Distribucion,OU=Grupos,DC=dssatuat,DC=sat,DC=gob,DC=mx",
    "CN=SAT_Genero_Mujer,OU=Distribucion,OU=Grupos,DC=dssatuat,DC=sat,DC=gob,DC=mx",
    "CN=SAT_Genero_Hombre,OU=Distribucion,OU=Grupos,DC=dssatuat,DC=sat,DC=gob,DC=mx"];    
  dn = "CN=LDAPREG,OU=Users,OU=GeneralUsers,OU=Regionales,DC=dssatuat,DC=sat,DC=gob,DC=mx";
    memberof.forEach(function(groupDn){    
        var change = new ldap.Change({
        operation: 'add',
        modification: {
          member:[dn]
        }
      });
      client.modify(groupDn, change, function(err, res) {

        if (err) {
            console.error("Looks like group add FAILED: %j", err);
          } else {
            console.log("Looks like group add WORKED: %j", res);
          }
        });
    });
           console.log("fin :v")
     }catch (err) {
            console.log(err);
          } 
    }
  
  

    connectA();
 
