const express = require("express");
const { cadastrarUsuario, fazerLogin, detalharUsuario, atualizarUsuario } = require("./controladores/usuarios");
const {emailExistente} = require("./intermediarios/validarEmail");
const validacaoDeToken = require("./intermediarios/tokenValido");
const { listarCategorias } = require("./controladores/categorias");
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacao, exibirExtrato } = require("./controladores/transacoes");
const categoriaExistente = require("./intermediarios/categoriaExistente");
const tipoDeTransacao = require("./intermediarios/tipoDeTransacao");
const transacaoExistente = require("./intermediarios/transacaoExistente");
const rotas = express();

rotas.post("/usuario", emailExistente, cadastrarUsuario);
rotas.get("/login", fazerLogin)

rotas.use(validacaoDeToken)

rotas.get("/usuario", detalharUsuario)
rotas.put("/usuario", emailExistente, atualizarUsuario)

rotas.get("/categoria", listarCategorias)

rotas.get("/transacao", listarTransacoes)
rotas.get("/transacao/extrato", exibirExtrato)
rotas.get("/transacao/:id", transacaoExistente, detalharTransacao)
rotas.post("/transacao", categoriaExistente, tipoDeTransacao, cadastrarTransacao)
rotas.put("/transacao/:id", transacaoExistente, categoriaExistente, tipoDeTransacao, atualizarTransacao)
rotas.delete("/transacao/:id", transacaoExistente, deletarTransacao)

module.exports = rotas;
