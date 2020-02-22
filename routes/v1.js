'use strict ';


/**
 * DEPENDENCIES
 */
const express = require('express');
const sajaRoute = express.Router();

const jwt = require('jsonwebtoken');


const User = require('../auth/users.js');
const basicMiddleware = require('../auth/basic-auth.js');
const oauthMiddleware = require('../auth/oauth.js');
const bearerAuth = require('../auth/bearer.js');
const acl = require('../auth/acl.js');
const categories = require('../models/categories/categories.js');
const products = require('../models/products/products.js');


sajaRoute.post('/signup', signup);

/**
 * sign in route => the user should add name and pass
 */
sajaRoute.post('/signin', basicMiddleware, signin);

sajaRoute.get('/oauth',oauthMiddleware, oauth);

sajaRoute.get('/user', bearerAuth, (req, res) => {
  res.status(200).json(req.user);
});



function getModel(req, res, next) {
  let model = req.params.model; // dynamic model
  switch (model) {
  case 'products':
    req.model = products;
    next();
    return;
  case 'categories':
    req.model = categories;
    // products and categories come from the requires up above
    next();
    return;
  default:
    next('model not found'); // if we pass smth in the next, if u wrote ur error middleware correctly, it moves it to the error hanling 
    return;
  }
}
sajaRoute.param('model', getModel);
sajaRoute.get('/:model', handleGetAll);
sajaRoute.get('/:model/:id', handleGetOne);
sajaRoute.post('/:model',bearerAuth, acl('create'), handlePost);
sajaRoute.put('/:model/:id',bearerAuth, acl('update'), handlePut);
sajaRoute.patch('/:model/:id',bearerAuth, acl('update'), handlePut);
sajaRoute.delete('/:model/:id', bearerAuth, acl('delete'), handleDelete);

/**
 * Signup function
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function signup(req, res, next) {
  let user = new User(req.body);
  user.save()
    .then((dbuser) => {
      console.log('hashedpass inside sign up', dbuser.pass);
      let user = {
        id: dbuser._id,
      };
      return jwt.sign(user, 'ser123');
    })
    .then((token) => {
      console.log('sign-up token :', token);
      res.status(200).send('successfully sign-up ');
    });
}




/**
 * Sign in function
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
function signin(req, res, next) {
  console.log(req.token);
  // res.status(200).send('successfully sign-in, your token is:  ')
  res.status(200).json(req.token);
    
}


function oauth(req, res) {
  console.log('token => ', req.token);
  res.status(200).json('you successfully signed with githab');
}





 
  


function handleGetAll(req, res, next) {
  // console.log('*************', req.model);
    
  req.model.get()
    .then(results => {
      // console.log(id)
      // console.log(req.model)
      let count = results.length;
      res.json({ count, results });
    }).catch(next);
}
  
function handleGetOne(req, res, next) {
  let id = req.params.id;
  req.model.get(id)
    .then(record => {
      res.json(record);
    }).catch(next);
}
  
function handlePost(req, res, next) {
  req.model.create(req.body)
    .then(results => {
      res.json(results);
    }).catch(next);
}
  
function handlePut(req, res, next) {
  let id = req.params.id;
  // console.log(id)
  // console.log(req.body)
  req.model.update(id, req.body)
    .then(data => {
      res.json(data);
    }).catch(next);
}
  
function handleDelete(req, res, next) {
  let mess = 'item deleted';
  let id = req.params.id;
  // console.log(id)
  // console.log(req.model)
  req.model.delete(id)
    .then(() => {
      res.json(mess);
    }).catch(next);
}

module.exports = sajaRoute;
