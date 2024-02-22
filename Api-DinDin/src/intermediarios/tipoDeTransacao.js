const tipoDeTransacao = (req, res, next) => {
  const { tipo } = req.body;

  if (tipo === "entrada" || tipo === "saida") {
    next();
  } else {
    return res.status(400).json({ menssagen: "tipo de transação invalido" });
  }
};

module.exports = tipoDeTransacao;
