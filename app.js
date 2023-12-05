const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks')
const session = require('express-session')
const strategy = require('./auth')
const passport = require('passport')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(strategy);

passport.serializeUser( (usuario, done) => {
    done(null, usuario.id)
});

passport.deserializeUser( (usuario, done) => {
    // obter o usuario do bd
    
    done(null, usuario)
});
 
app.use(fileUpload());

nunjucks.configure('views', {
    autoescape: true,
    express: app
})


app.use(bodyParser.urlencoded({ extended: true }));

app.locals.limparIdentificador = function(texto) {
    // Substituir espaços por underscores e remover caracteres especiais
    return texto.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  };

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(require('./routes'))



module.exports = app