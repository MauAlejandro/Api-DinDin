const pool = require("../conexao");

const listarCategorias = async (req, res) => {
  try {
    const listarCategorias = await pool.query("select * from categorias");

    return res.status(200).json(listarCategorias.rows);
  } catch (error) {
    return res.status(500).json({ menssagem: error });
  }
};

module.exports = {listarCategorias}