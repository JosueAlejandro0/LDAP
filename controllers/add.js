var ldap = require('ldapjs');
var path = require('path');
var assert = require('assert');
var config = require('../config/ldap');
var fs = require('fs');
var memberof = [
"CN=Domain Users,CN=Users,DC=dssatuat,DC=sat,DC=gob,DC=mx",
"CN=uann11,OU=SATCPN,OU=Distribucion,OU=Grupos,DC=dssatuat,DC=sat,DC=gob,DC=mx",
"CN=SAT_Genero_Mujer,OU=Distribucion,OU=Grupos,DC=dssatuat,DC=sat,DC=gob,DC=mx",
"CN=SAT_Genero_Hombre,OU=Distribucion,OU=Grupos,DC=dssatuat,DC=sat,DC=gob,DC=mx"];    

var client = ldap.createClient({
  url: 'ldaps://10.228.193.134:636',
  tlsOptions: {
    ca: [ fs.readFileSync(path.resolve('../LDAP-master/config/CPRIIUATACDY01.cer') )],
    rejectUnauthorized:false},
    reconnect: true
});
client.on('error', function(err) {
});

async function connectA(req, res){
  await client.bind(config.credentialsUser.user,config.credentialsUser.pass, function(err) {
      assert.ifError(err);    
      add(req); 
  });
}
module.exports.connectA = connectA;

async function add(req){
    try{
    var entry = {
    SamAccountName:               req.SamAccountName,
    GivenName:                    req.GivenName,
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
    objectClass:                  ["top","person","organizationalPerson","user"]
  };

 await client.add(req.dn, entry, function(err) {
    assert.ifError(err);    
    memberof.forEach(function(groupDn){    
      var change = new ldap.Change({
      operation: 'add',
      modification: {
        member:[req.dn]
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

});
}catch (err) {
    console.log(err);
  }
}

