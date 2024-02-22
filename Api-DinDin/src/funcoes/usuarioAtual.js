const pool = require("../conexao");

const usuarioAtual = async (id) => {
  const resultado = await pool.query("select * from usuarios where id = $1", 
  [id]);

  
  return resultado.rows[0];
};

module.exports = usuarioAtual
