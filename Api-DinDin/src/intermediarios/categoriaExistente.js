const pool = require("../conexao")

const categoriaExistente = async(req, res, next) => {
    const {categoria_id} = req.body

    try {
      const resultado = await pool.query(
      "select * from categorias where id = $1",
      [categoria_id]
    );
  
    if (resultado.rowCount < 1) {
        return res.status(404).json({menssagem: "Não há categoria relacionadas ou id informado"})
    }
      
    next()
    } catch (error) {
    console.log(error);
    return res.status(500).json({ menssagem: error.message });
    }
}

module.exports = categoriaExistente