/*
  Opción 3 
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
*/
var ldap = require('ldapjs');
var path = require('path');
var assert = require('assert');
var config = require('../config/ldap');
var fs = require('fs');
var client = ldap.createClient({
  url: 'ldaps://10.228.193.134:636',
  tlsOptions: {
    ca: [ fs.readFileSync(path.resolve('../LDAP-master/config/CPRIIUATACDY01.cer') )],
    rejectUnauthorized:false  
  }, 
/*
    //opción 1
  tlsOptions: {
    rejectUnauthorized: false
  },
    //opción 2
  tlsOptions:{
   key: fs.readFileSync('client-private-key.pem'),
   cert: fs.readFileSync('client-certificate.pem'),
   ca: [ fs.readFileSync('../server/server-certificate.pem') ]
  },
*/
  
  reconnect: true
});
client.on('error', function(err) {
    console.warn( err);
});

/*
Opción 4
    var opts = {
        ca: [fs.readFileSync('./server/ldap.pem')],
        reconnect: true,
        rejectUnauthorized: false // for self-signed
    };

    var client = LDAP.createClient({
        url: 'ldaps://10.228.193.134:636',
        tlsOptions: opts
    });

    var controls = client.controls;

    client.starttls(opts, controls, function(err, res) {
        assert.ifError(err);
        client.bind(dn, password, function (err) {
            assert.ifError(err);
        });
    log.info("StartTTLS connection established.")
    });

*/ 

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
    SamAccountName:               req.SamAccountName,
    GivenName:                    req.GivenName,
    Initials:                     req.Initials,
    DisplayName:                  req.DisplayName,
    Description:                  req.Description,
    //physicalDeliveryOfficeName:   req.physicalDeliveryOfficeName,
    mail:                         req.mail,
    //StreetAddress:                req.StreetAddress,
    l:                            req.l,
    //st:                           req.st,
    //PostalCode:                   req.PostalCode,
    //co:                           req.co,
    //UserPrincipal:                req.UserPrincipal,
    //ipPhone:                      req.ipPhone,
    //Title:                        req.Title,
    //Department:                   req.Department,
    //Company:                      req.Company,
    //Manager:                      req.Manager,
    //EmployeeID:                   req.EmployeeID,
    //sn:                           req.sn,
    mailNickname:                 req.mailNickname,
    cn:                           req.cn,
    distinguishedName:            req.distinguishedName,
    objectCategory:               req.objectCategory,
    //instanceType:                 req.instanceType,
    objectClass:                  ["top","person","organizationalPerson","user"]
  };
  console.log(entry);
 await client.add(req.dn, entry, function(err) {
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