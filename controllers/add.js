var ldap = require('ldapjs');
var assert = require('assert');
var config = require('../config/ldap');
var fs = require('fs');
let entries = [];
var client = ldap.createClient({
  url: 'ldap://10.228.193.134:389',
  /*tlsOptions: {
    rejectUnauthorized: false
},
tlsOptions:{
  key: fs.readFileSync('client-private-key.pem'),
  cert: fs.readFileSync('client-certificate.pem'),
  ca: [ fs.readFileSync('../server/server-certificate.pem') ]
}
*/
  
  reconnect: true
});

async function connectA(req, res){
  await client.bind(config.credentialsUser.user,config.credentialsUser.pass, function(err) {
      assert.ifError(err);    
      add(req); 
  });
       
}
module.exports.connectA = connectA;

async function add(req,res){
    try{
    var entry = {
    SamAccountName:req.SamAccountName,
     GiveName:                     req.GiveName,
     Initials:                     req.Initials,
     DisplayName:                  req.DisplayName,
     Description:                  req.Description,
     physicalDeliveryOfficeName:   req.physicalDeliveryOfficeName,
     mail:                         req.mail,
     StreetAddress:                req.StreetAddress,
     l:                            req.l,
     st:                           req.st,
     PostalCode:                   req.PostalCode,
     co:                           req.co,
     UserPrincipal:                req.UserPrincipal,
     ipPhone:                      req.ipPhone,
     Title:                        req.Title,
     Department:                   req.Department,
     Company:                      req.Company,
     Manager:                      req.Manager,
     EmployeeID:                   req.EmployeeID,
     sn:                           req.sn,
     mailNickname:                 req.mailNickname,
     cn:                           req.cn,
     distinguishedName:            req.distinguishedName,
     objectCategory:               req.objectCategory,
     instanceType:                 req.instanceType,
     objectClass:                  req.objectClass
  };
 await client.add('cn=foo, o=example', entry, function(err) {
    assert.ifError(err);
    disconnect();
  });

}catch (err) {
    console.log(err);
  }
}


function disconnect(){
  client.unbind(  function(err,res) {
    if (err) {
      console.error(" close  connection FAILED: %j", 'dn: ' + err.dn + '\n code: ' + err.code + '\n message: ' + err.message);
    } else {
      console.log("  close connection WORKED: %j"+ res   );
    }
  });
}
