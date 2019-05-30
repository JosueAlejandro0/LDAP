var ldap = require('ldapjs');
var assert = require('assert');
var config = require('../config/ldap');
var client = ldap.createClient({
  url: 'ldap://10.228.193.134:389',
  reconnect: true
});
client.on('error', function(err) {
    console.warn(err);
});

async function connectM(req){
    await client.bind(config.credentialsUser.user,config.credentialsUser.pass, function(err) {
        assert.ifError(err);
         modify(req);
    });
  }
  module.exports.connectM = connectM;
    
  async function modify(req){
  try{
    var change = new ldap.Change({
      operation: 'replace',
      modification: {
        l:`${req.l}`
      }
    });
    await client.modify(`CN=${req.cn},OU=Users,OU=GeneralUsers,OU=Regionales,DC=dssatuat,DC=sat,DC=gob,DC=mx`, change, function(err) {
      assert.ifError(err);
      disconnect();
      });         
   }catch (err) {
          console.log(err);
        } 
  }

  function disconnect(){
    client.unbind(  function(err,res) {
      if(err){
        console.error(" close  connection FAILED: %j", 'dn: ' + err.dn + '\n code: ' + err.code + '\n message: ' + err.message);
      } else {
        console.log("  close connection WORKED: %j"+ res   );
      }
    });
  }