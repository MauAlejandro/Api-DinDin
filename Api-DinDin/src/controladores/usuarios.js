const pool = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaDoServidor = require("../acesso_jwt");
const usuarioAtual = require("../funcoes/usuarioAtual");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ menssagem: "todos os compos deven ser prenchidos" });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioNovo = await pool.query(
      "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *",
      [nome, email, senhaCriptografada]
    );

    return res.status(201).json({
      Usuario_novo: {
        id: usuarioNovo.rows[0].id,
        nome,
        email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const fazerLogin = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuarioExistente = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (usuarioExistente.rowCount < 1) {
      return res.status(400).json({ menssagem: "senha ou email invalidos" });
    }

    const senhaCriptografada = usuarioExistente.rows[0].senha;

    const senhaValida = await bcrypt.compare(senha, senhaCriptografada);

    if (!senhaValida) {
      return res.status(400).json({ menssagem: "senha ou email invalidos" });
    }

    const idUsuario = usuarioExistente.rows[0].id;

    const criarToken = jwt.sign({ id: idUsuario }, senhaDoServidor, {
      expiresIn: "2h",
    });

    req.usuario = { id: idUsuario };

    return res
      .status(200)
      .json({ menssagem: "logado", email, token: criarToken });
  } catch (error) {
    return res.status(500).json({ menssagem: error });
  }
};

const detalharUsuario = async (req, res) => {
  const { id } = req.usuario;

  try {
    const {nome, email} = await usuarioAtual(id);

    return res.status(200).json({
      id,
      nome,
      email,
    });
  } catch (error) {
    return res.status(500).json({ menssagem: error });
  }
};


const atualizarUsuario = async (req, res) => {
  const {senha, email, nome} = req.body
  const {id} = req.usuario

  if (!senha || !nome || !email) {
    return res.status(400).json({menssagem: "todos os campos são obrigatorios"})
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const ausuarioatualizado = await pool.query("update usuarios set nome = $1, email = $2, senha = $3 where id = $4 returning *",
    [nome, email, senhaCriptografada, id])

    return res.status(201).json(
      {
        menssagem: "usuario atualizado"
      })
  } catch (error) {
    return res.status(500).json({ menssagem: error });
  }
}

module.exports = { cadastrarUsuario, fazerLogin, detalharUsuario, atualizarUsuario };
