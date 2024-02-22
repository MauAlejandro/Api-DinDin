const pool = require("../conexao");

const listarTransacoes = async (req, res) => {
  const { id } = req.usuario;
  const { filtro } = req.query;
  try {
    if (filtro) {
      let resultado = [];

      for (let categoria of filtro) {
        const categoriaId = await pool.query(
          "select id from categorias where descricao ilike $1",
          [categoria]
        );

        const transacoesPorCategoria = await pool.query(
          "select * from transacoes where usuario_id = $1 and categoria_id = $2",
          [id, categoriaId.rows[0].id]
        );

        if (transacoesPorCategoria.rows[0] === undefined) {
          resultado = resultado;
        } else {
          resultado.push(transacoesPorCategoria.rows);
        }
      }

      return res.status(200).json(resultado);
    }

    const transacoesDoUsuario = await pool.query(
      "select * from transacoes where usuario_id = $1",
      [id]
    );

    if (transacoesDoUsuario.rows.length === 0) {
      return res
        .status(200)
        .json({ menssagen: "Não há transações para listar" });
    }

    return res.status(200).json(transacoesDoUsuario.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ menssagem: error.message });
  }
};

const detalharTransacao = async (req, res) => {
  try {
    const resultado = req.transacao;

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ menssagem: error.message });
  }
};

const cadastrarTransacao = async (req, res) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;
  const usuario_id = req.usuario.id;

  if (!tipo || !descricao || !valor || !data || !categoria_id) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser informados.",
    });
  }

  try {
    const categoriaNome = await pool.query(
      "select descricao from categorias where id = $1",
      [categoria_id]
    );

    const categoria_nome = categoriaNome.rows[0].descricao;
    console.log(categoria_nome);

    const transacaoCadastrada = await pool.query(
      "insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)values ($1, $2, $3, $4, $5, $6) returning id",
      [tipo, descricao, valor, data, categoria_id, usuario_id]
    );

    const id = transacaoCadastrada.rows[0].id;

    return res.status(201).json({
      id,
      tipo,
      descricao,
      valor,
      data,
      usuario_id,
      categoria_id,
      categoria_nome,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ menssagem: error.message });
  }
};

const atualizarTransacao = async (req, res) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;
  const transacaoId = req.params.id;
  const usuarioId = req.usuario.id;

  if (!tipo || !descricao || !valor || !data || !categoria_id) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser informados.",
    });
  }

  try {
    await pool.query(
      "update transacoes set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5 where id = $6 and usuario_id = $7",
      [tipo, descricao, valor, data, categoria_id, transacaoId, usuarioId]
    );

    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ menssagem: error.message });
  }
};

const deletarTransacao = async (req, res) => {
  const transacaoId = req.params.id;
  const usuarioId = req.usuario.id;

  try {
    const transacaodeletada = await pool.query(
      "delete from transacoes where id = $1 and usuario_id = $2",
      [transacaoId, usuarioId]
    );

    return res.status(200).json({ mensagem: "transacao deletada" });
  } catch (error) {
    return res.status(500).json({ menssagem: error.message });
  }
};

const exibirExtrato = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const somaTransacoes = await pool.query(
      `
    SELECT 
    SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS total_saidas,
    SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS total_entradas
    FROM transacoes WHERE usuario_id = $1;`,
      [usuarioId]
    );

    const totalDaSoma = somaTransacoes.rows[0];

    if (totalDaSoma.total_saidas === null) {
      totalDaSoma.total_saidas = "0";
    }

    if (totalDaSoma.total_entradas === null) {
      totalDaSoma.total_entradas = "0";
    }

    return res.status(200).json(totalDaSoma);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ menssagem: error.message });
  }
};

module.exports = {
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  deletarTransacao,
  exibirExtrato,
};
