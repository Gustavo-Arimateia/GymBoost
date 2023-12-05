const db = require('../database')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM login WHERE email = ?', [email])
    .then((resultado) => {
        // Se não tiver usuario, então cadastrar

        // Obtém o usuário
        let usuario = null;

        // Autenticar
        return cb(null, usuario);
    })
    .catch((erro) => {
        cb(erro)
    });

});

module.exports = strategy;