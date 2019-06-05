var ldap = require('ldapjs');
var assert = require('assert');
var config = require('../config/ldap');

let entries = [];

var client = ldap.createClient({
  url: 'ldap://10.228.193.134:389',
  reconnect: true
});

client.on('error', function(err) {
    console.warn( err);
});

async function connectS(req, res){
await client.bind(config.credentialsUser.user,config.credentialsUser.pass, function(err) {
    assert.ifError(err);
    search(req).then(response=>{
    res.send(response);
    disconnect();
    }) ;
});
}
module.exports.connectS = connectS;

function search(req){
 return new Promise(function(resolve,reject){
  try{
    var data=req.params.id;
    var opts = {
      filter: `(sAmaccountName=${data})`,
      scope: 'sub',
      attributes: ['SamAccountName','GivenName','Initials',
      'DisplayName','Description','physicalDeliveryOfficeName','mail','StreetAddress','l','st','PostalCode','co','UserPrincipal','ipPhone','Title','Department','Company','Manager','EmployeeID','sn','mailNickname','cn','distinguishedName','objectCategory','instanceType','objectClass'   ]
    };
    
      
     client.search('OU=Regionales,DC=dssatuat,DC=sat,DC=gob,DC=mx', opts, function(err, res) {
        assert.ifError(err);    
        res.on('searchEntry', function(entry) {
          //console.log('entry: ' + JSON.stringify(entry.object));
          entries=[];
          entries.push(entry.object);         
          resolve(entries);
        });
        res.on('searchReference', function(referral) {
          console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
          console.error('error: ' + err.message);
          reject();
        });
        res.on('end', function(result) {
          //console.log('status: ' + result.status);
        });
    
      });
    }catch (err) {
        console.log(err);
    }
    
 }); 
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