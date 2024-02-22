const pool = require("../conexao");

const transacaoExistente = async (req, res, next) => {
  const idUsuario = req.usuario.id;
  const { id } = req.params;

  try {
    const transacaoEscolhda = await pool.query(
      "select * from transacoes where usuario_id = $1 and id = $2",
      [idUsuario, id]
    );

    if (transacaoEscolhda.rows.length < 1) {
      return res.status(200).json({ mensagem: "Transação não encontrada." });
    }

    req.transacao = transacaoEscolhda.rows

    next()
  } catch (error) {
    return res.status(500).json({ menssagem: error.message });
  }
};


module.exports = transacaoExistente