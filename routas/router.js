const express = require('express');
const ldap = require('../ldap');
const search = require('../controllers/search');
const modify = require('../controllers/modify');
const add = require('../controllers/add');
const router = new express.Router();

router.route('/:id?')
  .get(search.connectS);

router.post('/post', function (req, res) {
  var json={
    cn : req.body.cn,
     l : req.body.l
  }
  res.send(modify.connectM(json));
});

router.post('/add', function (req, res) {

  var json={
     SamAccountName:req.body.SamAccountName,
     GiveName:req.body.GiveName,
     Initials:req.body.Initials,
     DisplayName:req.body.DisplayName,
     Description:req.body.Description,
     physicalDeliveryOfficeName:req.body.physicalDeliveryOfficeName,
     mail:req.body.mail,
     StreetAddress:req.body.StreetAddress,
     l:req.body.l,
     st:req.body.st,
     PostalCode:req.body.PostalCode,
     co:req.body.co,
     UserPrincipal:req.body.UserPrincipal,
     ipPhone:req.body.ipPhone,
     Title:req.body.Title,
     Department:req.body.Department,
     Company:req.body.Company,
     Manager: req.body.Manager,
     EmployeeID: req.body.EmployeeID,
     sn:req.body.sn,
     mailNickname:req.body.mailNickname,
     cn:req.body.cn,
     distinguishedName:req.body.distinguishedName,
     objectCategory:req.body.objectCategory,
     instanceType:req.body.instanceType,
     objectClass:req.body.objectClass
  }
  
  res.send(add.connectA(json));
});

module.exports = router;