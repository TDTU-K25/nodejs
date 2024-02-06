
const express = require('express');
const users = require('../models/account');
const { login, register, getAllUser  } = require('../controllers/account');
const { getConversation, getMessages, getAllConversationOfUser, createConversation } = require('../controllers/conversation');
const { getMessageFile } = require('../controllers/message');

function route(app) {
 
    app.get('/login', (req, res) => { res.render('login'); });
    app.post('/login', login);
    app.get('/register', (req, res) => { res.render('register'); });
    app.post('/register', (req, res, next) => { next(); },register);
    app.post('/get-all-conversation-user', getAllConversationOfUser)
    app.get('/conversation/:id', getConversation)
    app.post('/get-file-download', getMessageFile)
    app.post('/get-messages', getMessages)
    app.post('/get-all-user', getAllUser)
    app.post('/create-conversation', createConversation)
    
    app.get('/', (req, res) => { res.render('index'); });
}

module.exports = route;