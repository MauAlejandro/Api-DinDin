const pool = require("../conexao");

const emailExistente = async (req, res, next) => {
  const { email } = req.body;
  try {
    const emailExistente = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (emailExistente.rowCount > 0) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    next()
  } catch (error) {
    return res.status(500).json({ menssagem: error });
  }
};

module.exports = { emailExistente };
