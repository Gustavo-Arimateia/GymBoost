const express = require('express')
const listaController = require('../controllers/controller')
const passport = require('passport')

const router = express.Router()

//HomePage

router.get('/', listaController.HomePage)

//login
router.post('/login', listaController.postLogin)
router.post('/login2', listaController.postLogin2)
router.get('/login', listaController.getLogin)
router.post('/senha', listaController.postSenha)


//forms
router.get('/forms-profissional', listaController.getFormsProfissional)
router.post('/forms-profissional', listaController.postFormsProfissional)
router.get('/forms-usuario', listaController.getFormsUsuario)
router.post('/forms-usuario', listaController.postFormsUsuario)
//usuario
router.get('/inicio', listaController.inicio)
router.get('/dietas-da-semana', listaController.dietasSemana)
router.get('/profissionais', listaController.profissionais)
router.get('/progresso', listaController.progresso)
router.get('/api/bioimpedancia', listaController.apiBio)



router.post('/feedNutri', listaController.feedNutri)
router.post('/feedPersonal', listaController.feedPersonal)


router.get('/treinos-da-semana', listaController.treinosSemana)
router.get('/user-profile', listaController.getUserProfile)
router.post('/user-profile', listaController.postUserProfile)

router.post('/deletar-profissional/:id', listaController.deletarProf)



//personal
router.get('/alunos-personal', listaController.getAlunosPersonal)
router.post('/alunos-personal', listaController.postAlunosPersonal)
router.get('/feedbacks-personal', listaController.feedbacksPersonal)
router.get('/inicio-personal', listaController.inicioPersonal)
router.get('/perfil-alunos-personal/:id', listaController.getPerfilAlunosPersonal)
router.post('/perfil-alunos-personal/:id', listaController.postPerfilAlunosPersonal)


router.get('/perfil-personal', listaController.getPerfilPersonal)
router.post('/perfil-personal', listaController.postPerfilPersonal)
router.get('/treinos', listaController.getTreinos)
router.post('/treinos', listaController.postTreinos)

router.post('/dia/:id', listaController.postDia)
router.post('/deletarFicha/:tipo/:id', listaController.postDeletFicha)
router.post('/adicionarTreino/:tipo/:id', listaController.postAddTreino)

router.get('/apiPersonal/:id/bioimpedancia', listaController.apiBioPersonal)



router.post('/deletar-treino', listaController.deletarTreino)

router.post('/deletar-aluno-personal', listaController.deletarAlunoPersonal)

//nutricionista
router.get('/alunos-nutricionista', listaController.getAlunosNutricionista)
router.post('/alunos-nutricionista', listaController.postAlunosNutricionista)
router.get('/feedbacks-nutricionista', listaController.feedbacksNutricionista)
router.get('/inicio-nutricionista', listaController.inicioNutricionista)
router.get('/perfil-nutricionista', listaController. getPerfilNutricionista)
router.post('/perfil-nutricionista', listaController. postPerfilNutricionista)
router.get('/perfil-alunos-nutricionista/:id', listaController.getPerfilAlunosNutricionista)
router.post('/perfil-alunos-nutricionista/:id', listaController.postPerfilAlunosNutricionista)
router.get('/dietas', listaController.getDietas)
router.post('/dietas', listaController.postDietas)

router.post('/rotina/:id', listaController.postRotina)
router.post('/refeicoes/:id', listaController.postRef)
router.post('/deletar-ref/:id', listaController.deletarRef)


router.get('/apiNutri/:id/bioimpedancia', listaController.apiBioNutri)


router.post('/deletar-alimento', listaController.deletarAlimento)
router.post('/deletar-aluno', listaController.deletarAluno)


module.exports = router
