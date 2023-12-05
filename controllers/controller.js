const moment = require('moment/moment')
const bd = require('../database')
const path = require('path')
const listaController = {


//HomePage

  HomePage: (req, res, next) => {
    res.status(200).render('index.html')
 },

//Aba Login
   getLogin: (req,res,next) => {
        res.status(200).render('login.html')
    },

    postLogin: async (req, res, next) => {
        let checkboxValue = req.body.checkboxValue;
        let email = req.body.email_cad;
        let senha = req.body.senha_cad;
    
        try {
            // Verificar se o email já está cadastrado
            const [rows] = await bd.query('SELECT * FROM login WHERE email = ?', [email]);
    
            if (rows.length === 0) {
                // O email não está cadastrado, podemos inserir os dados
                let user = await bd.query('INSERT INTO login (email, senha, tipo) VALUES (?, ?, ?)', [email, senha, checkboxValue]);
                
                let id = user[0].insertId

                req.session.userId = id;
                // Quando o usuário faz login com sucess0

                // Determinar a próxima rota com base no valor de checkboxValue
                if (checkboxValue === 'cliente') {
                    res.redirect('/forms-usuario');
                } else if (checkboxValue === 'profissional') {
                    res.redirect('/forms-profissional');
                }
            } else {
                console.log('Este email já está cadastrado.');
                //res.status(400).json({ message: 'Este email já está cadastrado.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao inserir os dados.' });
        }
    },
    

    postLogin2: async (req,res,next) => {
        let email = req.body.email_user
        let senha = req.body.senha_user

        try {
            const [user] = await bd.query('SELECT * FROM login WHERE email = ? AND senha = ?', [email, senha]);
            if (user.length === 1) {

                let id = user[0].id

                req.session.userId = id;

                if (user[0].tipo === 'cliente') {
                    res.redirect('/inicio');
                } else if (user[0].tipo === 'profissional') {
                  const [bdprofissional] =  await bd.query('SELECT * FROM profissional WHERE id = ?', [user[0].id]);
                    if(bdprofissional[0].tipo === 'nutricionista'){
                        res.redirect('/inicio-nutricionista') 
                    }else {
                        res.redirect('/inicio-personal')
                    }
                    
                }


            } else {
               console.log("User não encontrado")
            }} catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao inserir os dados.' });
            }
     },


     postSenha: async (req, res, next) => {
        console.log(req.body);
        let email = req.body.email;
        let newPassword = req.body.newpassword;
        let reNewPassword = req.body.renewpassword;
    
        try {
            const [user] = await bd.query('SELECT * FROM login WHERE email = ?', [email]);
    
            if (user.length === 1) {
                if (newPassword === reNewPassword) {
                    // Atualize a senha
                    await bd.query('UPDATE login SET senha = ? WHERE email = ?', [newPassword, email]);
                    console.log('Senha atualizada com sucesso!');
                    res.redirect('/login');
                } else {
                    throw new Error('As senhas não coincidem.');
                }
            } else {
                throw new Error('E-mail não encontrado.');
            }
        } catch (error) {
            console.error('Ops... Não foi possível salvar:', error.message);
            // Adicione aqui qualquer lógica adicional que você deseja para manipular o erro.
            // Pode ser útil renderizar uma página de erro ou redirecionar para uma página apropriada.
            res.redirect('/');
        }
    },
    



//forms
    getFormsProfissional: (req,res,next) => {
        res.status(200).render('forms/forms-profissional.html')
    },

    postFormsProfissional: async (req,res,next) => {
        let userId = req.session.userId;
        let tipo = req.body.btnradio
        let nome_profissional = req.body.nome_profissional
        let cpf_profissional = req.body.cpf_profissional
        let certificacao_profissionalenha = req.body.certificacao_profissional

        try {
        const [rows] = await bd.query('SELECT * FROM profissional WHERE cpf = ?', [cpf_profissional]);
    
        if (rows.length === 0) {

            await bd.query('INSERT INTO profissional (id, nome, certificado, tipo, cpf) VALUES (?, ?, ?, ?, ?)', [userId, nome_profissional, certificacao_profissionalenha, tipo, cpf_profissional]);

        
            if(tipo === 'personal'){
                res.redirect('/inicio-personal')
            }else if(tipo === 'nutricionista'){
                res.redirect('/inicio-nutricionista') 
            }
        } else {
            console.log('Este cpf já está cadastrado.');
            //res.status(400).json({ message: 'Este cpf já está cadastrado.' });
        }} catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao inserir os dados.' });
        }
    },

    getFormsUsuario: (req,res,next) => {
        res.status(200).render('forms/forms-usuario.html')
        console.log(req.body)
    },

    postFormsUsuario: async (req,res,next) => {
        console.log(req.body)
        let userId = req.session.userId;
        let nome_user = req.body.nome_user
        let cpf_user = req.body.cpf_user
        let data_user = req.body.data_user

        
        try {
            const [rows] = await bd.query('SELECT * FROM usuario WHERE cpf = ?', [cpf_user]);
        
            if (rows.length === 0) {
    
                await bd.query('INSERT INTO usuario (id, nome, nascimento, cpf) VALUES (?, ?, ?, ?)', [userId, nome_user, data_user, cpf_user]);
    
            
               res.redirect('/inicio')
            } else {
                console.log('Este cpf já está cadastrado.');
                //res.status(400).json({ message: 'Este cpf já está cadastrado.' });
            }} catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao inserir os dados.' });
            }
    },


//Aba Usuario
    inicio: async(req,res,next) => {
   
        let userId = req.session.userId;
        const [dietas] = await bd.query('SELECT id FROM dieta WHERE id_usuario = ? ', [ userId]);

        let [forms] = await bd.query('SELECT * FROM formulario WHERE id = ?', [userId]);
            

        let [formsUser] = await bd.query('SELECT * FROM usuario WHERE id = ?', [userId])
    

        // Inicialize um array para armazenar as rotinas
        let rotinas = [];
                
        // Verifique se há dietas antes de fazer a consulta de rotinas
        if (dietas.length > 0) {
            const idsDietas = dietas.map(dieta => dieta.id);
        
            // Consulta SQL para obter as rotinas associadas às dietas
            [rotinas] = await bd.query(`
            SELECT rotina.*, refeicoes.*, alimentos.*
            FROM rotina
            LEFT JOIN refeicoes ON rotina.id = refeicoes.id_rotina
            LEFT JOIN alimentos ON refeicoes.id_alimento = alimentos.id
            WHERE rotina.id_dieta IN (?);
            `, [idsDietas]);
        
        }

        const refeicoesAgrupadas = {};

        // Itera sobre as rotinas e agrupa as informações
        let idx = 1;
        rotinas.forEach(refeicao => {
            const grupo = refeicao.nome_ref
            const horarios = refeicao.horario   
            // Verifica se o grupo já existe nas refeições agrupadas
            if (!refeicoesAgrupadas[grupo]) {
                // Se não existir, cria um novo grupo e adiciona o alimento
                refeicoesAgrupadas[grupo] = {
                    idx: idx,
                    grupo: grupo,
                    horario: horarios
                };
            } 

            idx = idx + 1;
        });
        
        // Converte o objeto em um array de refeições
        let refeicoes = Object.values(refeicoesAgrupadas);



        const [ficha] = await bd.query ("SELECT id FROM ficha WHERE  id_usuario = ? ", [userId])
        const fichaId = ficha[0].id

        let [card] = await bd.query ("SELECT * FROM dia WHERE id_ficha = ?", [fichaId])

        let [dia] = await bd.query(`SELECT d.dia, d.tipo , g.grupo, e.exercicio
        FROM treino as t
        JOIN ficha as f ON t.id_ficha = f.id
        JOIN exercicio as e ON t.id_exercicio = e.id
        JOIN dia as d ON t.id_dia = d.id
        JOIN usuario as u ON t.id_usuario = u.id
        JOIN profissional as p ON t.id_profissional = p.id
        join grupo as g ON e.id_grupo = g.id

        WHERE f.id = ?
        `, [fichaId])
          
          const treinosAgrupadas = {}

          let tipos = []
          card.forEach((dados) => {
            if (tipos.indexOf(dados.tipo) === -1) {
                tipos.push(dados.tipo)
            }
          });

          tipos.forEach((tipo) => {
            treinosAgrupadas[tipo] = {
                tipo: tipo,
                dias: [],
                grupos: {}
            }
          });

          dia.forEach((dados) => {
            if (treinosAgrupadas[dados.tipo].dias.indexOf(dados.dia) === -1) {
                treinosAgrupadas[dados.tipo].dias.push(dados.dia);
            }
          });

          tipos.forEach((tipo) => {
            let grupos = []
            dia.forEach((dados) => {
                if (dados.tipo === tipo) {
                    if (grupos.indexOf(dados.grupo) === -1) {
                        grupos.push(dados.grupo);
                    }
                }
              });
     
            grupos.forEach((grupo) => {
                let exercicios = []
                dia.forEach((dados) => {
                    if (dados.tipo === tipo && dados.grupo === grupo) {
                        if (exercicios.indexOf(dados.exercicio) === -1) {
                            exercicios.push(dados.exercicio);
                        }
                    }
                });
                treinosAgrupadas[tipo].grupos[grupo] = {
                    grupo: grupo,
                    exercicios: exercicios
                }
            });
          });


          console.log(treinosAgrupadas)





        
        res.status(200).render('user/inicio.html', {
            refeicoes: refeicoes,
            forms: forms[0],
            formsUser: formsUser[0],
            treinosAgrupadas
          });

    },

    dietasSemana: async (req,res,next) => {

        let userId = req.session.userId;


        let [forms] = await bd.query('SELECT * FROM formulario WHERE id = ?', [userId]);
            

        let [formsUser] = await bd.query('SELECT * FROM usuario WHERE id = ?', [userId])
    


        const [dietas] = await bd.query('SELECT id FROM dieta WHERE id_usuario = ? ', [ userId]);

        // Inicialize um array para armazenar as rotinas
        let rotinas = [];
        
        // Verifique se há dietas antes de fazer a consulta de rotinas
        if (dietas.length > 0) {
            const idsDietas = dietas.map(dieta => dieta.id);
          
            // Consulta SQL para obter as rotinas associadas às dietas
            [rotinas] = await bd.query(`
              SELECT rotina.*, refeicoes.*, alimentos.*
              FROM rotina
              LEFT JOIN refeicoes ON rotina.id = refeicoes.id_rotina
              LEFT JOIN alimentos ON refeicoes.id_alimento = alimentos.id
              WHERE rotina.id_dieta IN (?);
            `, [idsDietas]);
          
          }

          const refeicoesAgrupadas = {};

          // Itera sobre as rotinas e agrupa as informações
          let idx = 1;
          rotinas.forEach(refeicao => {
              const grupo = refeicao.nome_ref
              const horarios = refeicao.horario   
              const alimento = {
                  nome: refeicao.alimento,
                  quantidade: refeicao.quantidade,
                  proteina: refeicao.proteinas,
                  carboidratos: refeicao.carboidratos,
                  gorduras: refeicao.gorduras,
                  calorias: refeicao.calorias
              };
          
              // Verifica se o grupo já existe nas refeições agrupadas
              if (!refeicoesAgrupadas[grupo]) {
                  // Se não existir, cria um novo grupo e adiciona o alimento
                  refeicoesAgrupadas[grupo] = {
                      idx: idx,
                      grupo: grupo,
                      alimentos: [alimento],
                      horario: horarios
                  };
              } else {
                  // Se o grupo já existir, adiciona o alimento ao grupo existente
                  refeicoesAgrupadas[grupo].alimentos.push(alimento);
              }

              idx = idx + 1;
          });
          
          // Converte o objeto em um array de refeições
          let refeicoes = Object.values(refeicoesAgrupadas);
        

        res.status(200).render('user/dietas-da-semana.html', {
          rotinas: rotinas,
          refeicoes: refeicoes,
          forms: forms[0],
          formsUser: formsUser[0]
        });


    
    },


    feedNutri: async (req,res,next) => {
        console.log(req.body)
       

        try {
            let userId = req.session.userId;
            let novoFeedback = req.body.feed2; 
    
            // Atualizar o valor da coluna feedback na tabela dieta
            await bd.query('UPDATE dieta SET feedback = ? WHERE id_usuario = ? ', [novoFeedback, userId]);
    
            res.redirect('/dietas-da-semana')
        } catch (error) {
            console.error('Erro ao atualizar feedback:', error);
            console.log('Erro ao processar a solicitação.');
        }
        
    },

    feedPersonal: async (req,res,next) => {
        try {
            let userId = req.session.userId;
            let novoFeedback = req.body.feed2; 
    
            console.log (userId)
            console.log (novoFeedback)

        
            // Atualizar o valor da coluna feedback na tabela dieta
            await bd.query('UPDATE ficha SET feedback = ? WHERE id_usuario = ? ', [novoFeedback, userId]);
    
            res.redirect('/treinos-da-semana')
        } catch (error) {
            console.error('Erro ao atualizar feedback:', error);
            console.log('Erro ao processar a solicitação.');
        }
        
    },

    profissionais: async (req, res, next) => {
        try {
            let userId = req.session.userId;
    
            // Consulta SQL para obter os IDs dos profissionais vinculados ao usuário
            let [resultado] = await bd.query('SELECT id_profissional FROM vinculo WHERE id_usuario = ?', [userId]);
            let [forms] = await bd.query('SELECT * FROM formulario WHERE id = ?', [userId]);
            const forms1 = forms[0]

            let [formsUser] = await bd.query('SELECT * FROM usuario WHERE id = ?', [userId])
    
            // Obtém os IDs dos profissionais a partir do resultado da consulta
            const idsProfissionais = resultado.map(vinculo => vinculo.id_profissional);
    
            // Consulta SQL para obter os dados dos profissionais com base nos IDs obtidos
            let [dadosProfissionais] = await bd.query('SELECT * FROM profissional WHERE id IN (?)', [idsProfissionais]);

            let [formsProfissionais] = await bd.query('SELECT * FROM forms_profissional WHERE id IN (?)', [idsProfissionais]);
            
            let [loginProfissionais] = await bd.query('SELECT * FROM login WHERE id IN (?)', [idsProfissionais]);
    


            
            res.status(200).render('user/profissionais.html', {
                profissionais: dadosProfissionais,
                formsProfissionais: formsProfissionais,
                forms: forms1,
                login: loginProfissionais,
                formsUser: formsUser[0]
            });
        } catch (error) {
            console.error('Erro na rota profissionais:', error);
            // Trate o erro conforme necessário
            res.status(500).send('Erro ao processar a solicitação');
        }
    },

    deletarProf: async (req, res) => {
        let alunoId =  req.session.userId;
        let profissionalId = req.params.id;
    


        // Remover o aluno do vínculo
        await bd.query('DELETE FROM vinculo WHERE id_usuario = ? AND id_profissional = ?', [alunoId, profissionalId])

        const [forms] = await bd.query("Select * from profissional where id = ?" , [profissionalId])

       

        if(forms[0].tipo === 'nutricionista'){
            
            await bd.query('DELETE FROM dieta  WHERE id_usuario = ? AND id_profissional = ?', [alunoId, profissionalId]);
        } else if (forms[0].tipo === 'personal'){
           
            await bd.query('DELETE FROM ficha  WHERE id_usuario = ? AND id_profissional = ?', [alunoId, profissionalId]);

        }
    
            res.redirect('/profissionais')
        
    },
    

    progresso: async (req,res,next) => {

     
            const userId = req.session.userId;

            let [forms] = await bd.query('SELECT * FROM formulario WHERE id = ?', [userId]);
            

            let [formsUser] = await bd.query('SELECT * FROM usuario WHERE id = ?', [userId])
    
        
            // Consulta SQL para obter dados da bioimpedância do usuário para uma data específica
            const [bioimpedancia] = await bd.query('SELECT * FROM bioimpedancia WHERE id_usuario = ?', [userId]);
        
            const bioimpedanciaFormatada = bioimpedancia.map(dado => {
                return {
                    ...dado,
                    data_bio: moment(dado.data_bio).format('DD/MM/YYYY')
                };
            });

            
            // Renderiza a página com os dados da bioimpedância
            res.render('user/progresso.html', { 
                bioimpedancia: bioimpedanciaFormatada,
                forms: forms[0],
                formsUser: formsUser[0]
            });
       
    },

    apiBio: async (req, res) => {
        try {
            const userId = req.session.userId;
            const selectedDate = req.query.data; // Obtenha a data da consulta
        
            console.log('Data recebida:', selectedDate);
        
            // Suponha que 'selectedDate' seja a data no formato 'DD/MM/YYYY'.
            const formattedDate = moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD');



            // Consulta SQL para obter dados da bioimpedância do usuário para uma data específica
            const [bioimpedancia2] = await bd.query('SELECT * FROM bioimpedancia WHERE id_usuario = ? AND data_bio = ?', [userId, formattedDate]);
        
            console.log('Dados do banco de dados:', bioimpedancia2[0]);

            const bioimpedancia = bioimpedancia2[0]
        
            const bioimpedanciaFormatada = {
                ...bioimpedancia,
                data_bio: moment(bioimpedancia.data_bio).format('DD/MM/YYYY')
              };
              console.log('Depois de formatar:', bioimpedanciaFormatada);
              
            res.json(bioimpedanciaFormatada)
               
          } catch (error) {
            console.error('Erro ao obter dados de bioimpedância:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
          }
    },

    treinosSemana: async (req,res,next) => {
        let userId = req.session.userId;

        let [forms] = await bd.query('SELECT * FROM formulario WHERE id = ?', [userId]);
            

        let [formsUser] = await bd.query('SELECT * FROM usuario WHERE id = ?', [userId])


        const [ficha] = await bd.query ("SELECT id FROM ficha WHERE  id_usuario = ? ", [userId])
        const fichaId = ficha[0].id

        let [card] = await bd.query ("SELECT * FROM dia WHERE id_ficha = ?", [fichaId])

        let [dia] = await bd.query(`SELECT d.dia, d.tipo , g.grupo, e.exercicio
        FROM treino as t
        JOIN ficha as f ON t.id_ficha = f.id
        JOIN exercicio as e ON t.id_exercicio = e.id
        JOIN dia as d ON t.id_dia = d.id
        JOIN usuario as u ON t.id_usuario = u.id
        JOIN profissional as p ON t.id_profissional = p.id
        join grupo as g ON e.id_grupo = g.id

        WHERE f.id = ?
        `, [fichaId])
          
          const treinosAgrupadas = {}

          let tipos = []
          card.forEach((dados) => {
            if (tipos.indexOf(dados.tipo) === -1) {
                tipos.push(dados.tipo)
            }
          });

          tipos.forEach((tipo) => {
            treinosAgrupadas[tipo] = {
                tipo: tipo,
                dias: [],
                grupos: {}
            }
          });

          dia.forEach((dados) => {
            if (treinosAgrupadas[dados.tipo].dias.indexOf(dados.dia) === -1) {
                treinosAgrupadas[dados.tipo].dias.push(dados.dia);
            }
          });

          tipos.forEach((tipo) => {
            let grupos = []
            dia.forEach((dados) => {
                if (dados.tipo === tipo) {
                    if (grupos.indexOf(dados.grupo) === -1) {
                        grupos.push(dados.grupo);
                    }
                }
              });
     
            grupos.forEach((grupo) => {
                let exercicios = []
                dia.forEach((dados) => {
                    if (dados.tipo === tipo && dados.grupo === grupo) {
                        if (exercicios.indexOf(dados.exercicio) === -1) {
                            exercicios.push(dados.exercicio);
                        }
                    }
                });
                treinosAgrupadas[tipo].grupos[grupo] = {
                    grupo: grupo,
                    exercicios: exercicios
                }
            });
          });


          console.log(treinosAgrupadas)


    
        res.render('user/treinos-semana.html',{
            forms:forms[0],
            formsUser: formsUser[0],
            treinosAgrupadas
        })
    },

    getUserProfile: async (req,res,next) => {
        let userId = req.session.userId;
        let [resultado] = await bd.query('SELECT * FROM formulario WHERE id = ?', [userId])
        const forms = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM usuario WHERE id = ?', [userId])
        const usuario = resultado2[0]

        const idade = calcularIdade(usuario.nascimento);
        const dadosAlunosFormatada = {
            ...usuario,
            idade: idade
        };

        let [resultado3] = await bd.query('SELECT * FROM login WHERE id = ?', [userId])
        const login = resultado3[0]

       res.status(200).render('user/user-profile1.html', {
         itens: forms,
         forms: dadosAlunosFormatada,
         login: login
       })

       function calcularIdade(dataNascimento) {
        const hoje = moment();
        const nascimento = moment(dataNascimento);
        const anos = hoje.diff(nascimento, 'years');
        return anos;
    }
    },

    postUserProfile: async (req,res,next) => {
        let userId = req.session.userId;
        let sexo = req.body.sexo || '';
        let phone = req.body.phone || '';
        let objetivo_treino = req.body.objetivo_treino || '';
        let tempo = req.body.tempo || '';
        let frequencia = req.body.frequencia || '';
        let problemas = req.body.problemas || '';
        let objetivo_dieta = req.body.objetivo_dieta || '';
        let restricoes = req.body.restricoes || '';
        let qnt_refeicoes = req.body.qnt_refeicoes || '';
        let foto_perfil = (req.files && req.files.foto_perfil) ? req.files.foto_perfil : '';



        if (req.files && req.files.foto_perfil) {
            let uploadPath = __dirname + '\\..\\public\\assets\\fotos\\' + foto_perfil.name;
            console.log(uploadPath)

            // Use the mv() method to place the file somewhere on your server
            foto_perfil.mv(uploadPath, function(err) {
                if (err)
                console.log('erro ao salvar foto')
                //return res.status(500).send(err);

            
            });
    }

        const query = `
        INSERT INTO formulario (id, foto, sexo, telefone, objt_treino, temp_treino, freq_treino, problemas, objt_dieta, restricao, ref_dia)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        foto = IF(VALUES(foto) != '', VALUES(foto), foto),
        sexo = IF(VALUES(sexo) != '', VALUES(sexo), sexo),
        telefone = IF(VALUES(telefone) != '', VALUES(telefone), telefone),
        objt_treino = IF(VALUES(objt_treino) != '', VALUES(objt_treino), objt_treino),
        temp_treino = IF(VALUES(temp_treino) != '', VALUES(temp_treino), temp_treino),
        freq_treino = IF(VALUES(freq_treino) != '', VALUES(freq_treino), freq_treino),
        problemas = IF(VALUES(problemas) != '', VALUES(problemas), problemas),
        objt_dieta = IF(VALUES(objt_dieta) != '', VALUES(objt_dieta), objt_dieta),
        restricao = IF(VALUES(restricao) != '', VALUES(restricao), restricao),
        ref_dia = IF(VALUES(ref_dia) != '', VALUES(ref_dia), ref_dia)
    `;

    await bd.query(query, [userId, foto_perfil.name, sexo, phone, objetivo_treino, tempo, frequencia, problemas, objetivo_dieta, restricoes, qnt_refeicoes]);

    

   
    res.redirect('/user-profile')
        

       
    },

    //Aba Personal

    getAlunosPersonal: async (req,res,next) => {
        try {
            let userId = req.session.userId;
    
            let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId]);
            let profissional = resultado2[0];
    
            let [alunos] = await bd.query('SELECT * FROM vinculo WHERE id_profissional = ?', [userId]);
    
            let alunoIds = alunos.map(aluno => aluno.id_usuario);
    
            // Inicializa a lista de dados de alunos como vazia
            let dadosAlunos = [];
            let dadosFormulario = [];

            let dadosAlunosFormatada = [];
            
            // Verifica se há alunos antes de fazer a consulta
            if (alunoIds.length > 0) {
                [dadosAlunos] = await bd.query('SELECT * FROM usuario WHERE id IN (?)', [alunoIds]);
                [dadosFormulario] = await bd.query('SELECT * FROM formulario WHERE id IN (?)', [alunoIds]);

                dadosAlunosFormatada = dadosAlunos.map(dado => {
                    const idade = calcularIdade(dado.nascimento);
                    return {
                        ...dado,
                        idade: idade
                    };
                });
            }
    
            let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId]);
            const forms_profissional = resultado[0];
    
            res.status(200).render('personal/alunos.html', {
                itens: forms_profissional,
                forms: profissional,
                alunos: dadosAlunosFormatada,
                formulario: dadosFormulario
            });
        } catch (error) {
            console.error('Erro na rota getAlunosPersonal:', error);
            // Trate o erro conforme necessário
            res.status(500).send('Erro ao processar a solicitação');
        }

        function calcularIdade(dataNascimento) {
            const hoje = moment();
            const nascimento = moment(dataNascimento);
            const anos = hoje.diff(nascimento, 'years');
            return anos;
        }
    },

    postAlunosPersonal: async (req,res,next) => {
        let userId = req.session.userId;
        let cpf_aluno = req.body.cpf_aluno

        try {
            const [rows] = await bd.query('SELECT * FROM usuario WHERE cpf = ?', [cpf_aluno]);
            
        
            if (rows.length === 1) {
    
                
                await bd.query('INSERT INTO vinculo (id_usuario, id_profissional) VALUES (?, ?)', [rows[0].id, userId]);
                await bd.query('INSERT INTO ficha (id_usuario, id_profissional) VALUES (?, ?)', [rows[0].id, userId]);
    
            
                res.redirect('/alunos-personal')
            } else {
                console.log('Este cpf não está cadastrado.');
                 //res.status(400).json({ message: 'Este cpf não está cadastrado.' });
            } } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao inserir os dados.' });
             }
    },

    feedbacksPersonal: async (req,res,next) => {
        let userId = req.session.userId;
        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

        const [feedbacksComNomes] = await bd.query(`
        SELECT ficha.feedback, usuario.nome, usuario.id AS id_usuario, formulario.*
        FROM ficha
        INNER JOIN usuario ON ficha.id_usuario = usuario.id
        LEFT JOIN formulario ON usuario.id = formulario.id
        WHERE ficha.id_profissional = ? AND ficha.feedback IS NOT NULL
        ORDER BY ficha.id DESC
      `, [userId]);

       res.status(200).render('personal/feedbacks.html', {
         itens: forms_profissional,
         forms: profissional,
         feedbacksComNomes
       })
    },

    inicioPersonal: async (req,res,next) => {
        let userId = req.session.userId;
        let alunoId = req.params.id


        let [userNovos] = await bd.query(` Select * from usuario where id=?` ,[alunoId])
        const userNovo = userNovos[0]

        let [logins] = await bd.query(` Select * from login where id=?` ,[alunoId])
        const login = logins[0]

        let [userForms] = await bd.query(` Select * from formulario where id=?` ,[alunoId])
        const userForm = userForms[0]


        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

    
        const [ultimosFeedbacks] = await 
        bd.query(`SELECT ficha.feedback, usuario.nome, usuario.id AS id_usuario, formulario.*
        FROM ficha
        INNER JOIN usuario ON ficha.id_usuario = usuario.id
        LEFT JOIN formulario ON usuario.id = formulario.id
        WHERE ficha.id_profissional = ? AND ficha.feedback IS NOT NULL
        ORDER BY ficha.id DESC LIMIT 3`, [userId]);

        const [alunosSemFicha] = await bd.query(`
        SELECT u.nome, f.foto
        FROM ficha d
        JOIN usuario u ON d.id_usuario = u.id
        LEFT JOIN treino r ON d.id_usuario = r.id_usuario
        LEFT JOIN formulario f ON u.id = f.id
        WHERE d.id_profissional = ?
            AND r.id_usuario IS NULL
        `, [userId]);
    
       res.status(200).render('personal/inicio-personal.html', {
         usuario: userNovo,
         itens: forms_profissional,
         forms: profissional,
         formsu: userForm,
         login: login,
         ultimosFeedbacks,
         alunosSemFicha
       });
    },

    getPerfilAlunosPersonal: async  (req,res,next) => {
        let userId = req.session.userId;
        let alunoId = req.params.id


        let [userNovos] = await bd.query(` Select * from usuario where id=?` ,[alunoId])
        const userNovo = userNovos[0]

        const idade = calcularIdade(userNovo.nascimento);
        const dadosAlunosFormatada = {
            ...userNovo,
            idade: idade
        };

        let [logins] = await bd.query(` Select * from login where id=?` ,[alunoId])
        const login = logins[0]

        let [userForms] = await bd.query(` Select * from formulario where id=?` ,[alunoId])
        const userForm = userForms[0]


        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

        const [ficha] = await bd.query ("SELECT id FROM ficha WHERE  id_usuario = ? AND id_profissional = ?", [alunoId, userId])
        const fichaId = ficha[0].id

        let [card] = await bd.query ("SELECT * FROM dia WHERE id_ficha = ?", [fichaId])

        let [dia] = await bd.query(`SELECT d.dia, d.tipo , g.grupo, e.exercicio
        FROM treino as t
        JOIN ficha as f ON t.id_ficha = f.id
        JOIN exercicio as e ON t.id_exercicio = e.id
        JOIN dia as d ON t.id_dia = d.id
        JOIN usuario as u ON t.id_usuario = u.id
        JOIN profissional as p ON t.id_profissional = p.id
        join grupo as g ON e.id_grupo = g.id

        WHERE f.id = ?
        `, [fichaId])
          
          const treinosAgrupadas = {}

          let tipos = []
          card.forEach((dados) => {
            if (tipos.indexOf(dados.tipo) === -1) {
                tipos.push(dados.tipo)
            }
          });

          tipos.forEach((tipo) => {
            treinosAgrupadas[tipo] = {
                tipo: tipo,
                dias: [],
                grupos: {}
            }
          });

          dia.forEach((dados) => {
            if (treinosAgrupadas[dados.tipo].dias.indexOf(dados.dia) === -1) {
                treinosAgrupadas[dados.tipo].dias.push(dados.dia);
            }
          });

          tipos.forEach((tipo) => {
            let grupos = []
            dia.forEach((dados) => {
                if (dados.tipo === tipo) {
                    if (grupos.indexOf(dados.grupo) === -1) {
                        grupos.push(dados.grupo);
                    }
                }
              });
     
            grupos.forEach((grupo) => {
                let exercicios = []
                dia.forEach((dados) => {
                    if (dados.tipo === tipo && dados.grupo === grupo) {
                        if (exercicios.indexOf(dados.exercicio) === -1) {
                            exercicios.push(dados.exercicio);
                        }
                    }
                });
                treinosAgrupadas[tipo].grupos[grupo] = {
                    grupo: grupo,
                    exercicios: exercicios
                }
            });
          });


          console.log(treinosAgrupadas)
          
    
          
          
        const [exercicios] = await bd.query(`
        SELECT exercicio.*, grupo.grupo
        FROM exercicio
        JOIN grupo ON exercicio.id_grupo = grupo.id
        WHERE exercicio.id_profissional = ?; 
        `, [userId]);

    
        const fichaAgrupada = {};

         // Itera sobre os grupos e agrupa as informações
          let idx = 1;
         exercicios.forEach(grupo => {
             const grupoProf = grupo.grupo
             const treino = {
                exercicio: grupo.exercicio
             };
            
             // Verifica se o grupo já existe nas refeições agrupadas
             if (!fichaAgrupada[grupoProf]) {
                 // Se não existir, cria um novo grupo e adiciona o alimento
                    fichaAgrupada[grupoProf] = {
                     idx: idx,
                     grupo: grupoProf,
                     treinos: [treino],
                 };
                
             } else {
                 // Se o grupo já existir, adiciona o alimento ao grupo existente
                 fichaAgrupada[grupoProf].treinos.push(treino);
             }

             idx = idx + 1;
         });
         
         // Converte o objeto em um array de refeições
         let fichaProf = Object.values(fichaAgrupada);
        
         const [fichaFeed] = await bd.query('SELECT feedback FROM ficha WHERE id_usuario = ? AND id_profissional = ?', [alunoId, userId]);
         const feed = fichaFeed[0]


        // Consulta SQL para obter dados da bioimpedância do usuário para uma data específica
        const [bioimpedancia] = await bd.query('SELECT * FROM bioimpedancia WHERE id_usuario = ? AND id_profissional', [alunoId, userId]);
                
        const bioimpedanciaFormatada = bioimpedancia.map(dado => {
            return {
                ...dado,
                data_bio: moment(dado.data_bio).format('DD/MM/YYYY')
            };
        });



        res.status(200).render('personal/perfil-alunos.html', {
            usuario: dadosAlunosFormatada,
            itens: forms_profissional,
            forms: profissional,
            formsu: userForm,
            login: login,
            treinosAgrupadas,
            fichaProf,
            feed,
            bioimpedancia: bioimpedanciaFormatada
          });
  
         function calcularIdade(dataNascimento) {
          const hoje = moment();
          const nascimento = moment(dataNascimento);
          const anos = hoje.diff(nascimento, 'years');
          return anos;
      }
    },

    postPerfilAlunosPersonal: async (req,res,next) => {
        let alunoId = req.params.id
        let userId = req.session.userId
         let data_bio = req.body.data_bio
         let g_ideal = req.body.g_ideal
         let g_atual = req.body.g_atual
         let massa_magra = req.body.massa_magra
         let massa_gorda = req.body.massa_gorda
         let peso = req.body.peso
         let altura = req.body.altura
         let tx = req.body.tx
         let ab = req.body.ab
         let cx = req.body.cx
         let torax = req.body.torax
         let abdomem = req.body.abdomem
         let cintura = req.body.cintura
         let quadril =  req.body.quadril
         let ombro= req.body.ombro
         let pantu_d = req.body.pantu_d
         let pantu_e = req.body.pantu_e
         let braco_d = req.body.braco_d
         let braco_e = req.body.braco_e
         let ante_braco_d = req.body.ante_braco_d
         let ante_braco_e = req.body.ante_braco_e
         let coxa_d = req.body.coxa_d
         let coxa_e = req.body.coxa_e
 
 
 
         await bd.query('INSERT INTO bioimpedancia (g_ideal ,g_atual, massa_magra ,massa_gorda ,peso ,altura ,tx ,ab ,cx ,torax ,abdomem ,cintura ,quadril ,ombro ,pantu_esq ,pantu_dir ,braco_esq ,braco_dir ,ante_esq ,ante_dir ,coxa_esq ,coxa_dir ,data_bio ,id_usuario ,id_profissional) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?)',[g_ideal,g_atual,massa_magra,massa_gorda,peso,altura,tx,ab,cx,torax,abdomem,cintura,quadril,ombro,pantu_e,pantu_d,braco_e,braco_d,ante_braco_e,ante_braco_d,coxa_e,coxa_d,data_bio, alunoId, userId])
           
             
             
            
         res.redirect('/perfil-alunos-personal/' + alunoId)
     },


    apiBioPersonal: async (req, res) => {
        try {
            const userId = req.session.userId;
            const selectedDate = req.query.data; // Obtenha a data da consulta
           const alunoId = req.params.id

      
            console.log('Data recebida:', selectedDate);
        
            // Suponha que 'selectedDate' seja a data no formato 'DD/MM/YYYY'.
            const formattedDate = moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD');


            // Consulta SQL para obter dados da bioimpedância do usuário para uma data específica
            const [bioimpedancia2] = await bd.query('SELECT * FROM bioimpedancia WHERE id_usuario = ? AND data_bio = ?', [alunoId, formattedDate]);
        
            console.log('Dados do banco de dados:', bioimpedancia2[0]);

            const bioimpedancia = bioimpedancia2[0]
        
            const bioimpedanciaFormatada = {
                ...bioimpedancia,
                data_bio: moment(bioimpedancia.data_bio).format('DD/MM/YYYY')
              };
              console.log('Depois de formatar:', bioimpedanciaFormatada);
              
            res.json(bioimpedanciaFormatada)
               
          } catch (error) {
            console.error('Erro ao obter dados de bioimpedância:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
          }
    },

    postDia: async (req,res,next) => {
        let userId = req.session.userId;
        let alunoId = req.params.id
        console.log(req.body)
       
        let diasSelecionados  = req.body.DiaSemana
        let tipo = req.body.tipo

        const [ficha] = await bd.query ("SELECT id FROM ficha WHERE  id_usuario = ? AND id_profissional = ?", [alunoId, userId])
        const fichaId = ficha[0].id



        diasSelecionados.forEach(dia => {
            // Insere um novo registro na tabela dia para cada dia selecionado
            const query = 'INSERT INTO dia (dia, id_ficha, tipo) VALUES (?, ?, ?)';
            const values = [dia, fichaId,  tipo];
        
            bd.query(query, values, (err, result) => {
              if (err) {
                console.error('Erro ao inserir registro:', err);
               return;
              }
            });
          });


        res.redirect('/perfil-alunos-personal/' + alunoId)
      },

      postDeletFicha: async (req,res,next) => {
        let userId = req.session.userId;
        let alunoId = req.params.id
        let tipo = req.params.tipo
       const [ficha] = await bd.query ("SELECT id FROM ficha WHERE  id_usuario = ? AND id_profissional = ?", [alunoId, userId])
       const fichaId = ficha[0].id
       try {
        // Lógica para excluir o alimento do banco de dados usando o ID
        await bd.query('DELETE FROM dia WHERE tipo = ? AND id_ficha = ?', [tipo, fichaId]);

        res.redirect('/perfil-alunos-personal/' + alunoId);
    } catch (error) {
        console.error('Erro ao excluir alimento:', error);
        //res.status(500).json({ message: 'Erro ao excluir alimento.' });
    }
    
      },

      postAddTreino: async (req,res,next) => {
        let userId = req.session.userId;
        let alunoId = req.params.id
        let tipo = req.params.tipo
       let grupo = req.body.grupo

       const [ficha] = await bd.query ("SELECT id FROM ficha WHERE  id_usuario = ? AND id_profissional = ?", [alunoId, userId])
       const fichaId = ficha[0].id
      
       const [grupoIds] = await bd.query ("SELECT id FROM grupo WHERE grupo = ? ", [grupo])
       const grupoId = grupoIds[0].id

       const [exerciciosRows] = await bd.query("SELECT id FROM exercicio WHERE id_grupo = ? AND id_profissional = ?", [grupoId, userId]);
       const exercicios = exerciciosRows.map(exercicio => exercicio.id);
       
       const [diasRows] = await bd.query("SELECT id FROM dia WHERE tipo = ?", [tipo]);
       const dias = diasRows.map(dia => dia.id);
       
       console.log("IDs dos exercícios:", exercicios);
       console.log("IDs dos dias:", dias);
       
       for (const diaId of dias) {
           console.log(`Salvando exercícios para o dia com ID ${diaId}`);
           
           for (const exercicioId of exercicios) {
               // Aqui você pode realizar a lógica de salvar os exercícios para cada dia
              
               // Exemplo de como você poderia realizar um INSERT no banco de dados
                await bd.query("INSERT INTO treino (id_ficha, id_exercicio, id_dia, id_usuario, id_profissional) VALUES (?, ?, ?, ?,?)", [ fichaId, exercicioId, diaId, alunoId, userId]);
           }
       }
       
        res.redirect('/perfil-alunos-personal/' + alunoId)
      },

    getPerfilPersonal: async (req,res,next) => {
        let userId = req.session.userId;
        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

        let [resultado3] = await bd.query('SELECT * FROM login WHERE id = ?', [userId])
        const login = resultado3[0]

       res.status(200).render('personal/perfil.html', {
         itens: forms_profissional,
         forms: profissional,
         login: login
       })
    },

    postPerfilPersonal: async (req,res,next) => {
        let userId = req.session.userId;
        let about = req.body.about || ''; 
        let phone = req.body.phone || '';
        let whatsapp = req.body.whatsapp || '';
        let instagram = req.body.instagram || '';
        let linkedin = req.body.linkedin || '';
        let foto_perfil = (req.files && req.files.foto_perfil) ? req.files.foto_perfil : '';



        if (req.files && req.files.foto_perfil) {
            let uploadPath = __dirname + '\\..\\public\\assets\\fotos\\' + foto_perfil.name;
            console.log(uploadPath)

            // Use the mv() method to place the file somewhere on your server
            foto_perfil.mv(uploadPath, function(err) {
                if (err)
                console.log('erro ao salvar foto')
                //return res.status(500).send(err);

            
            });
    }

            const query = `
            INSERT INTO forms_profissional (id, sobre, telefone, whatsapp, insta, linkedIn, foto)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            sobre = IF(VALUES(sobre) != ' ', VALUES(sobre), sobre),
            telefone = IF(VALUES(telefone) != ' ', VALUES(telefone), telefone),
            whatsapp = IF(VALUES(whatsapp) != ' ', VALUES(whatsapp), whatsapp),
            insta = IF(VALUES(insta) != ' ', VALUES(insta), insta),
            linkedIn = IF(VALUES(linkedIn) != ' ', VALUES(linkedIn), linkedIn),
            foto = IF(VALUES(foto) != ' ', VALUES(foto), foto)
        `;

        await bd.query(query, [userId, about, phone, whatsapp, instagram, linkedin, foto_perfil.name]);
        

       
      res.redirect('/perfil-personal')

    },

    getTreinos: async (req,res,next) => {
        let userId = req.session.userId;

        const [exercicios] = await bd.query(`
        SELECT exercicio.*, grupo.grupo
        FROM exercicio
        JOIN grupo ON exercicio.id_grupo = grupo.id
        WHERE exercicio.id_profissional = ?; 
        `, [userId]);

    
        const treinosAgrupadas = {};

         // Itera sobre os grupos e agrupa as informações
          let idx = 1;
         exercicios.forEach(grupo => {
             const grupoProf = grupo.grupo
             const treino = {
                exercicio: grupo.exercicio
             };
            
             // Verifica se o grupo já existe nas refeições agrupadas
             if (!treinosAgrupadas[grupoProf]) {
                 // Se não existir, cria um novo grupo e adiciona o alimento
                    treinosAgrupadas[grupoProf] = {
                     idx: idx,
                     grupo: grupoProf,
                     treinos: [treino],
                 };
                
             } else {
                 // Se o grupo já existir, adiciona o alimento ao grupo existente
                 treinosAgrupadas[grupoProf].treinos.push(treino);
             }

             idx = idx + 1;
         });
         
         // Converte o objeto em um array de refeições
         let treinoProf = Object.values(treinosAgrupadas);

        

         const [GrupoBanco] = await bd.query('SELECT * FROM grupo');

         let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

    
        res.status(200).render('personal/treinos.html', {
           treinoProf,
           GrupoBanco,
           itens: forms_profissional,
           forms: profissional,
          })
    },

    postTreinos: async (req, res) => {
     
     let userId = req.session.userId;
     const grupoMuscular = req.body.grupoMuscular; // Obtém o valor selecionado no campo select
     const exercicio = req.body.exercicio; // Obtém o valor digitado no campo de texto
 

     const [queryGrupo] = await bd.query('SELECT id FROM grupo WHERE grupo = ?', [grupoMuscular])
     const idGrupo = queryGrupo[0].id;

    await bd.query('INSERT INTO exercicio (exercicio, id_grupo, id_profissional) VALUES (?, ?, ?)', [exercicio, idGrupo, userId])
     

     res.redirect('/treinos')
    },

    deletarAlunoPersonal: async (req, res) => {
        let alunoId = req.body.alunoId;
        let profissionalId = req.session.userId;
    
        // Remover o aluno do vínculo
        await bd.query('DELETE FROM vinculo WHERE id_usuario = ? AND id_profissional = ?', [alunoId, profissionalId])

        await bd.query('DELETE FROM ficha  WHERE id_usuario = ? AND id_profissional = ?', [alunoId, profissionalId]);
    
            res.redirect('/alunos-personal')
        
    },

    deletarTreino: async (req, res, next) => {
        console.log(req.body)
        const exercicio = req.body.btn

        try {
            // Lógica para excluir o alimento do banco de dados usando o ID
            await bd.query('DELETE FROM exercicio WHERE exercicio = ?', [exercicio]);
    
            res.redirect('/treinos')
        } catch (error) {
            console.error('Erro ao excluir alimento:', error);
            //res.status(500).json({ message: 'Erro ao excluir alimento.' });
        }

       
    },


    //Aba Nutricionista

    getAlunosNutricionista: async (req, res, next) => {
        try {
            let userId = req.session.userId;
    
            let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId]);
            let profissional = resultado2[0];
    
            let [alunos] = await bd.query('SELECT * FROM vinculo WHERE id_profissional = ?', [userId]);
    
            let alunoIds = alunos.map(aluno => aluno.id_usuario);
    
            // Inicializa a lista de dados de alunos como vazia
            let dadosAlunos = [];
            let dadosFormulario = [];

            let dadosAlunosFormatada = [];
            
            // Verifica se há alunos antes de fazer a consulta
            if (alunoIds.length > 0) {
                [dadosAlunos] = await bd.query('SELECT * FROM usuario WHERE id IN (?)', [alunoIds]);
                [dadosFormulario] = await bd.query('SELECT * FROM formulario WHERE id IN (?)', [alunoIds]);

                dadosAlunosFormatada = dadosAlunos.map(dado => {
                    const idade = calcularIdade(dado.nascimento);
                    return {
                        ...dado,
                        idade: idade
                    };
                });
            }
    
            let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId]);
            const forms_profissional = resultado[0];
    
            res.status(200).render('nutricionista/alunos.html', {
                itens: forms_profissional,
                forms: profissional,
                alunos: dadosAlunosFormatada,
                formulario: dadosFormulario
            });
        } catch (error) {
            console.error('Erro na rota getAlunosNutricionista:', error);
            // Trate o erro conforme necessário
            res.status(500).send('Erro ao processar a solicitação');
        }

        function calcularIdade(dataNascimento) {
            const hoje = moment();
            const nascimento = moment(dataNascimento);
            const anos = hoje.diff(nascimento, 'years');
            return anos;
        }
    },
    

    postAlunosNutricionista: async (req,res,next) => {
        let userId = req.session.userId;
        let cpf_aluno = req.body.cpf_aluno

        try {
            const [rows] = await bd.query('SELECT * FROM usuario WHERE cpf = ?', [cpf_aluno]);
            
        
            if (rows.length === 1) {
    
                
                await bd.query('INSERT INTO vinculo (id_usuario, id_profissional) VALUES (?, ?)', [rows[0].id, userId]);
                await bd.query('INSERT INTO dieta (id_usuario, id_profissional) VALUES (?, ?)', [rows[0].id, userId]);
    
            
                res.redirect('/alunos-nutricionista')
            } else {
                console.log('Este cpf não está cadastrado.');
                 //res.status(400).json({ message: 'Este cpf não está cadastrado.' });
            } } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao inserir os dados.' });
             }


    },

    feedbacksNutricionista: async (req,res,next) => {
        let userId = req.session.userId;
        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

        const [feedbacksComNomes] = await bd.query(`
        SELECT dieta.feedback, usuario.nome, usuario.id AS id_usuario, formulario.*
        FROM dieta
        INNER JOIN usuario ON dieta.id_usuario = usuario.id
        LEFT JOIN formulario ON usuario.id = formulario.id
        WHERE dieta.id_profissional = ? AND dieta.feedback IS NOT NULL
        ORDER BY dieta.id DESC
      `, [userId]);

        

       res.status(200).render('nutricionista/feedbacks.html', {
         itens: forms_profissional,
         forms: profissional,
         feedbacksComNomes,

       })
    },

    inicioNutricionista: async (req,res,next) => {
        let userId = req.session.userId;
        let alunoId = req.params.id


        let [userNovos] = await bd.query(` Select * from usuario where id=?` ,[alunoId])
        const userNovo = userNovos[0]

        let [logins] = await bd.query(` Select * from login where id=?` ,[alunoId])
        const login = logins[0]

        let [userForms] = await bd.query(` Select * from formulario where id=?` ,[alunoId])
        const userForm = userForms[0]


        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

         // Consulta SQL para obter os últimos 3 feedbacks com nomes
        const [ultimosFeedbacks] = await 
        bd.query(`SELECT dieta.feedback, usuario.nome, usuario.id AS id_usuario, formulario.*
        FROM dieta
        INNER JOIN usuario ON dieta.id_usuario = usuario.id
        LEFT JOIN formulario ON usuario.id = formulario.id
        WHERE dieta.id_profissional = ? AND dieta.feedback IS NOT NULL
        ORDER BY dieta.id DESC LIMIT 3`, [userId]);


        const [alunosSemDietas] = await bd.query(`
        SELECT u.nome, f.foto
        FROM dieta d
        JOIN usuario u ON d.id_usuario = u.id
        LEFT JOIN refeicoes r ON d.id_usuario = r.id_usuario
        LEFT JOIN formulario f ON u.id = f.id
        WHERE d.id_profissional = ?
            AND r.id_usuario IS NULL
        `, [userId]);

    
       res.status(200).render('nutricionista/inicio-nutricionista.html', {
         usuario: userNovo,
         itens: forms_profissional,
         forms: profissional,
         formsu: userForm,
         login: login,
         ultimosFeedbacks,
         alunosSemDietas
       });

      

     
    },

    getPerfilNutricionista: async (req,res,next) => {
        let userId = req.session.userId;
        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

        let [logins] = await bd.query(` Select * from login where id=?` ,[userId])
        const login = logins[0]


       res.status(200).render('nutricionista/perfil.html', {
         itens: forms_profissional,
         forms: profissional,
         login: login
       })

    },

    postPerfilNutricionista: async (req,res,next) => {
        let userId = req.session.userId;
        let about = req.body.about || ''; 
        let phone = req.body.phone || '';
        let whatsapp = req.body.whatsapp || '';
        let instagram = req.body.instagram || '';
        let linkedin = req.body.linkedin || '';
        let foto_perfil = (req.files && req.files.foto_perfil) ? req.files.foto_perfil : '';



        if (req.files && req.files.foto_perfil) {
            let uploadPath = __dirname + '\\..\\public\\assets\\fotos\\' + foto_perfil.name;
            console.log(uploadPath)

            // Use the mv() method to place the file somewhere on your server
            foto_perfil.mv(uploadPath, function(err) {
                if (err)
                console.log('erro ao salvar foto')
                //return res.status(500).send(err);

            
            });
    }


        const query = `
            INSERT INTO forms_profissional (id, sobre, telefone, whatsapp, insta, linkedIn, foto)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            sobre = IF(VALUES(sobre) != ' ', VALUES(sobre), sobre),
            telefone = IF(VALUES(telefone) != ' ', VALUES(telefone), telefone),
            whatsapp = IF(VALUES(whatsapp) != ' ', VALUES(whatsapp), whatsapp),
            insta = IF(VALUES(insta) != ' ', VALUES(insta), insta),
            linkedIn = IF(VALUES(linkedIn) != ' ', VALUES(linkedIn), linkedIn),
            foto = IF(VALUES(foto) != ' ', VALUES(foto), foto)
        `;

        await bd.query(query, [userId, about, phone, whatsapp, instagram, linkedin, foto_perfil.name]);

       
       
      res.redirect('/perfil-nutricionista')


    },

    getPerfilAlunosNutricionista: async (req,res,next) => {
      
        let userId = req.session.userId;
        let alunoId = req.params.id


        let [userNovos] = await bd.query(` Select * from usuario where id=?` ,[alunoId])
        const userNovo = userNovos[0]

        const idade = calcularIdade(userNovo.nascimento);
        const dadosAlunosFormatada = {
            ...userNovo,
            idade: idade
        };

        let [logins] = await bd.query(` Select * from login where id=?` ,[alunoId])
        const login = logins[0]

        let [userForms] = await bd.query(` Select * from formulario where id=?` ,[alunoId])
        const userForm = userForms[0]


        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

        const [alimentos] = await bd.query('SELECT * FROM alimentos WHERE profissional_id= ?',[userId]);

        const [dietas] = await bd.query('SELECT id FROM dieta WHERE id_usuario = ? AND id_profissional = ?', [alunoId, userId]);

        // Inicialize um array para armazenar as rotinas
        let rotinas = [];
        
        // Verifique se há dietas antes de fazer a consulta de rotinas
        if (dietas.length > 0) {
            const idsDietas = dietas.map(dieta => dieta.id);
          
            // Consulta SQL para obter as rotinas associadas às dietas
            [rotinas] = await bd.query(`
              SELECT rotina.*, refeicoes.*, alimentos.*
              FROM rotina
              LEFT JOIN refeicoes ON rotina.id = refeicoes.id_rotina
              LEFT JOIN alimentos ON refeicoes.id_alimento = alimentos.id
              WHERE rotina.id_dieta IN (?);
            `, [idsDietas]);
          
          }

          const refeicoesAgrupadas = {};

          // Itera sobre as rotinas e agrupa as informações
          let idx = 1;
          rotinas.forEach(refeicao => {
              const grupo = refeicao.nome_ref
              const horarios = refeicao.horario         
              
              const alimento = {
                  nome: refeicao.alimento,
                  quantidade: refeicao.quantidade,
                  proteina: refeicao.proteinas,
                  carboidratos: refeicao.carboidratos,
                  gorduras: refeicao.gorduras,
                  calorias: refeicao.calorias
              };
          
              // Verifica se o grupo já existe nas refeições agrupadas
              if (!refeicoesAgrupadas[grupo]) {
                  // Se não existir, cria um novo grupo e adiciona o alimento
                  refeicoesAgrupadas[grupo] = {
                      idx: idx,
                      grupo: grupo,
                      horario: horarios,
                      alimentos: [alimento],
                  };
              } else {
                  // Se o grupo já existir, adiciona o alimento ao grupo existente
                  refeicoesAgrupadas[grupo].alimentos.push(alimento);

              }

              idx = idx + 1;
          });
          
          // Converte o objeto em um array de refeições
          let refeicoes = Object.values(refeicoesAgrupadas);


          const [dietasFeed] = await bd.query('SELECT feedback FROM dieta WHERE id_usuario = ? AND id_profissional = ?', [alunoId, userId]);
          const feed = dietasFeed[0]

           // Consulta SQL para obter dados da bioimpedância do usuário para uma data específica
        const [bioimpedancia] = await bd.query('SELECT * FROM bioimpedancia WHERE id_usuario = ? AND id_profissional', [alunoId, userId]);
                
        const bioimpedanciaFormatada = bioimpedancia.map(dado => {
            return {
                ...dado,
                data_bio: moment(dado.data_bio).format('DD/MM/YYYY')
            };
        });

    
        res.status(200).render('nutricionista/perfil-alunos.html', {
          usuario: dadosAlunosFormatada,
          itens: forms_profissional,
          forms: profissional,
          formsu: userForm,
          login: login,
          alimentos: alimentos,
          rotinas: rotinas,
          refeicoes: refeicoes,
          feed: feed,
          bioimpedancia: bioimpedanciaFormatada
        });

       function calcularIdade(dataNascimento) {
        const hoje = moment();
        const nascimento = moment(dataNascimento);
        const anos = hoje.diff(nascimento, 'years');
        return anos;
    }
        
    },

    postPerfilAlunosNutricionista: async (req,res,next) => {
       let alunoId = req.params.id
       let userId = req.session.userId
        let data_bio = req.body.data_bio
        let g_ideal = req.body.g_ideal
        let g_atual = req.body.g_atual
        let massa_magra = req.body.massa_magra
        let massa_gorda = req.body.massa_gorda
        let peso = req.body.peso
        let altura = req.body.altura
        let tx = req.body.tx
        let ab = req.body.ab
        let cx = req.body.cx
        let torax = req.body.torax
        let abdomem = req.body.abdomem
        let cintura = req.body.cintura
        let quadril =  req.body.quadril
        let ombro= req.body.ombro
        let pantu_d = req.body.pantu_d
        let pantu_e = req.body.pantu_e
        let braco_d = req.body.braco_d
        let braco_e = req.body.braco_e
        let ante_braco_d = req.body.ante_braco_d
        let ante_braco_e = req.body.ante_braco_e
        let coxa_d = req.body.coxa_d
        let coxa_e = req.body.coxa_e



        await bd.query('INSERT INTO bioimpedancia (g_ideal ,g_atual, massa_magra ,massa_gorda ,peso ,altura ,tx ,ab ,cx ,torax ,abdomem ,cintura ,quadril ,ombro ,pantu_esq ,pantu_dir ,braco_esq ,braco_dir ,ante_esq ,ante_dir ,coxa_esq ,coxa_dir ,data_bio ,id_usuario ,id_profissional) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?)',[g_ideal,g_atual,massa_magra,massa_gorda,peso,altura,tx,ab,cx,torax,abdomem,cintura,quadril,ombro,pantu_e,pantu_d,braco_e,braco_d,ante_braco_e,ante_braco_d,coxa_e,coxa_d,data_bio, alunoId, userId])
          
            
            
           
        res.redirect('/perfil-alunos-nutricionista/' + alunoId)
    },

    apiBioNutri: async (req, res) => {
        try {
            const userId = req.session.userId;
            const selectedDate = req.query.data; // Obtenha a data da consulta
           const alunoId = req.params.id

      
            console.log('Data recebida:', selectedDate);
        
            // Suponha que 'selectedDate' seja a data no formato 'DD/MM/YYYY'.
            const formattedDate = moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD');


            // Consulta SQL para obter dados da bioimpedância do usuário para uma data específica
            const [bioimpedancia2] = await bd.query('SELECT * FROM bioimpedancia WHERE id_usuario = ? AND data_bio = ?', [alunoId, formattedDate]);
        
            console.log('Dados do banco de dados:', bioimpedancia2[0]);

            const bioimpedancia = bioimpedancia2[0]
        
            const bioimpedanciaFormatada = {
                ...bioimpedancia,
                data_bio: moment(bioimpedancia.data_bio).format('DD/MM/YYYY')
              };
              console.log('Depois de formatar:', bioimpedanciaFormatada);
              
            res.json(bioimpedanciaFormatada)
               
          } catch (error) {
            console.error('Erro ao obter dados de bioimpedância:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
          }
    },


    getDietas: async (req,res,next) => {
        let userId = req.session.userId;
        let [resultado] = await bd.query('SELECT * FROM forms_profissional WHERE id = ?', [userId])
        const forms_profissional = resultado[0]
      
        const [alimentos] = await bd.query('SELECT * FROM alimentos WHERE profissional_id = ?', [userId]);
        const alimento = alimentos;

        let [resultado2] = await bd.query('SELECT * FROM profissional WHERE id = ?', [userId])
        const profissional = resultado2[0]

        
        


       res.status(200).render('nutricionista/dietas.html', {  
         itens: forms_profissional,
         forms: profissional,
         alimentos: alimento
       })
    },

    postDietas: async (req,res,next) => {
       let userId = req.session.userId;
       let alimento = req.body.alimento
       let proteinas = req.body.proteinas
       let gordura = req.body.gordura
       let carboidratos = req.body.carboidratos
       let calorias = req.body.calorias

       try {
        const [rows] = await bd.query('SELECT * FROM alimentos WHERE alimento = ?', [alimento]);
    
        if (rows.length === 0) {

            await bd.query('INSERT INTO alimentos (alimento, proteinas, gorduras, carboidratos, calorias, profissional_id) VALUES (?, ?, ?, ?, ?, ?)', [alimento, proteinas, gordura, carboidratos, calorias, userId]);

        
            res.redirect('/dietas')
        } else {
            console.log('Este alimento já está cadastrado.');
            //res.status(400).json({ message: 'Este alimento já está cadastrado.' });
        }} catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao inserir os dados.' });
        }

    },

    postRotina: async (req,res,next) => {
       let userId = req.session.userId;
       let alunoId = req.params.id
       let ref = req.body.ref
       let hora_ref = req.body.hora_ref

       const [dietas] = await bd.query('SELECT id FROM dieta WHERE id_usuario = ? AND id_profissional = ?', [alunoId, userId]);
       
       const idDieta = dietas[0].id;
       
       await bd.query('INSERT INTO rotina (nome_ref, horario, id_dieta, id_usuario) VALUES (?, ? , ?, ?)', [ref,hora_ref, idDieta, alunoId ]);
    
       res.redirect('/perfil-alunos-nutricionista/' + alunoId)
     },

     postRef: async (req,res,next) => {
        console.log(req.body)
        let userId = req.session.userId;
        let alunoId = req.params.id
     

        const rotina = req.body.rotina;
        let formAlimento = req.body.alimentos_lista
        let formQuantidade = req.body.quantidade


        const alimentosSelecionados =  []
        const quantidades =  []; 

        for(let i = 0; i<formAlimento.length; i++){
           if(Number(formQuantidade[i]) > 0) {
            alimentosSelecionados.push(formAlimento[i])
            quantidades.push(Number(formQuantidade[i]))
           }
        }

        const [bdRotina] = await bd.query('SELECT id, id_dieta FROM rotina WHERE  nome_ref = ? and id_usuario = ?', [rotina, alunoId]);
       

        const idRotina = bdRotina[0].id;
        const idDieta = bdRotina[0].id_dieta;
        
       

       // Exibe apenas os alimentos selecionados com suas quantidades
        for (let i = 0; i < alimentosSelecionados.length; i++) {
            const alimentoSelecionado = alimentosSelecionados[i];
            const quantidade = quantidades[i] !== undefined ? quantidades[i] : ''; // Se for undefined, atribui uma string vazia

           
            

                const [alimento] = await bd.query('SELECT * FROM alimentos WHERE TRIM(alimento) = ? ', [alimentoSelecionado.trim()]);
               
               
                const idAlimento = alimento[0].id;
               
                
    
                await bd.query('INSERT INTO refeicoes (quantidade, id_dieta, id_alimento, id_rotina, id_usuario) VALUES (?, ?, ?, ?, ?)', [ quantidade, idDieta, idAlimento, idRotina, Number(alunoId)]);
            }


    
       
        res.redirect('/perfil-alunos-nutricionista/' + alunoId)
      },

      deletarRef: async (req, res) => {
       console.log(req.body)
       let alunoId = req.params.id
        
       res.redirect('/perfil-alunos-nutricionista/' + alunoId)
    },
      


    deletarAlimento: async (req, res) => {
        const alimentoId = req.body.alimentoId;

        try {
            // Lógica para excluir o alimento do banco de dados usando o ID
            await bd.query('DELETE FROM alimentos WHERE id = ?', [alimentoId]);
    
            res.redirect('/dietas');
        } catch (error) {
            console.error('Erro ao excluir alimento:', error);
            //res.status(500).json({ message: 'Erro ao excluir alimento.' });
        }
    },

    deletarAluno: async (req, res) => {
        try {
            let alunoId = req.body.alunoId;
            let profissionalId = req.session.userId;
    
            // 1. Remover registros da tabela `refeicoes`
            await bd.query('DELETE FROM refeicoes WHERE id_rotina IN (SELECT id FROM rotina WHERE id_dieta IN (SELECT id FROM dieta WHERE id_usuario = ? AND id_profissional = ?))', [alunoId, profissionalId]);
    
            // 2. Remover registros da tabela `rotina`
            await bd.query('DELETE FROM rotina WHERE id_dieta IN (SELECT id FROM dieta WHERE id_usuario = ? AND id_profissional = ?)', [alunoId, profissionalId]);
    
            // 3. Remover registros da tabela `dieta`
            await bd.query('DELETE FROM dieta WHERE id_usuario = ? AND id_profissional = ?', [alunoId, profissionalId]);
    
            // 4. Remover o aluno do vínculo
            await bd.query('DELETE FROM vinculo WHERE id_usuario = ? AND id_profissional = ?', [alunoId, profissionalId]);
    
            res.redirect('/alunos-nutricionista');
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
            res.status(500).send('Erro ao processar a solicitação.');
        }
    },
    
    
    
 
    
}




module.exports = listaController