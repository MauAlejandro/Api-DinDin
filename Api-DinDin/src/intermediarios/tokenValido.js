const jwt = require("jsonwebtoken");
const senhaDoServidor = require("../acesso_jwt");
const pool = require("../conexao");

const validacaoDeToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization == "Bearer") {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, senhaDoServidor);

    const usuario = await pool.query("select * from usuarios where id = $1", [
      id,
    ]);

    if (usuario.rowCount < 1) {
      return res.status(401).json({
        mensagem:
          "Para acessar este recurso um token de autenticação válido deve ser enviado.",
      });
    }

    req.usuario = usuario.rows[0];

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ menssagem: error });
  }
};

module.exports = validacaoDeToken;
