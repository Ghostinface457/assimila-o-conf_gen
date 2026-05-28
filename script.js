/* ============================================
   ASSIMILAÇÃO RPG — GERADOR DE CONFLITO
   script.js
   ============================================ */

// ── HELPERS ──────────────────────────────────

function qs(sel, ctx) {
  return (ctx || document).querySelector(sel);
}

function qsa(sel, ctx) {
  return [...(ctx || document).querySelectorAll(sel)];
}

function toast(msg) {
  const el = qs('#toast');

  if (!el) return;

  el.textContent = msg;
  el.classList.add('on');

  setTimeout(() => {
    el.classList.remove('on');
  }, 2600);
}

/** Gera HTML dos símbolos */
function dadosHtml(simbolos = [], tipo = '', stackMin = 7) {

  let pasta = '';

  switch (tipo) {

    case 'condic':
      pasta = 'assets/condic/';
      break;

    case 'ativ':
      pasta = 'assets/ativ/';
      break;

    case 'objp':
      pasta = 'assets/objp/';
      break;

    case 'objs':
      pasta = 'assets/objs/';
      break;

    default:
      pasta = 'assets/';
  }

  let out = '';

  simbolos.forEach(item => {

    const quantidade = parseInt(item.quantidade) || 0;
    const simbolo = item.simbolo;

    if (quantidade <= 0) return;

    // STACK PERSONALIZÁVEL
    if (quantidade >= stackMin) {

      out += `
        <span class="simbolo-stack">

          <span class="simbolo-numero" id="cabeca">
            ${quantidade}x
          </span>

          <span class="dado-icon-wrapper">

            <img
              src="${pasta}${simbolo}.png"
              class="dado-icon"
              alt="${simbolo}"
              onerror="this.remove()">

          </span>

        </span>
      `;

    } else {

      for (let i = 0; i < quantidade; i++) {

        out += `
          <span class="dado-icon-wrapper">

            <img
              src="${pasta}${simbolo}.png"
              class="dado-icon"
              alt="${simbolo}"
              onerror="this.remove()">

          </span>
        `;
      }

    }

  });

  return out;
}

// ── SUBSTITUIR SÍMBOLOS INLINE ──────────────

function substituirSimbolos(texto, tipo = '') {

  if (!texto) return '';

  return texto.replace(/<([^>]+)>/g, (match, conteudo) => {

    let [nomeSimbolo, quantidade] = conteudo.split('*');

    quantidade = parseInt(quantidade) || 1;

    let arquivo = nomeSimbolo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    arquivo = arquivo
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");

    let pasta = '';

    switch(tipo) {

      case 'condic':
        pasta = 'assets/condic/';
        break;

      case 'ativ':
        pasta = 'assets/ativ/';
        break;

      case 'objp':
        pasta = 'assets/objp/';
        break;

      case 'objs':
        pasta = 'assets/objs/';
        break;

      default:
        pasta = 'assets/';
    }

    const caminho = `${pasta}${arquivo}.png`;

    let simbolos = '';

    for (let i = 0; i < quantidade; i++) {

      simbolos += `
        <span class="simbolo-wrapper">

          <img
            src="${caminho}"
            class="simbolo-inline"
            alt="${nomeSimbolo}"
            onerror="this.remove()">

        </span>
      `;
    }

    return simbolos;
  });
}

// ── LINHAS DE SÍMBOLO ───────────────────────

function addLinhaSimbolo(botao, tipo = 'ativ') {

  const wrapper = botao.parentElement.querySelector('.multi-simbolos');

  const linha = document.createElement('div');

  linha.className = 'simbolo-linha';

  linha.innerHTML = `

    <input
      type="number"
      class="${tipo}-qtd"
      min="0"
      max="20"
      value="1"
      style="width:70px;text-align:center">

    <select class="${tipo}-simbolo">

      <option value="adaptacao">
        Adaptação
      </option>

      <option value="pressao">
        Pressão
      </option>

      <option value="sucesso" selected>
        Sucesso
      </option>

    </select>

    <button
      type="button"
      class="btn-remove"
      onclick="this.parentElement.remove()">

      ✕
    </button>
  `;

  wrapper.appendChild(linha);
}

// ── CONDICIONANTES ──────────────────────────

function addCondicionante(titulo = '', desc = '') {

  const lista = qs('#lista-condic');

  const item = document.createElement('div');

  item.className = 'f-item';

  item.innerHTML = `

    <div class="f-item-header">

      <span class="f-item-label">
        Condicionante
      </span>

      <button
        class="btn-remove"
        onclick="this.closest('.f-item').remove()">

        ✕ Remover
      </button>

    </div>

    <div class="f-group">

      <label>Título</label>

      <input
        type="text"
        class="cond-titulo"
        placeholder="Ex: LOCAL FECHADO"
        value="${titulo}">

    </div>

    <div class="f-group">

      <label>Descrição</label>

      <textarea
        class="cond-desc"
        placeholder="Efeito do condicionante...">${desc}</textarea>

    </div>
  `;

  lista.appendChild(item);
}

// ── ATIVAÇÕES ───────────────────────────────

function addAtivacao(nome = '', desc = '', dados = 3) {

  const lista = qs('#lista-ativ');

  const item = document.createElement('div');

  item.className = 'f-item';

  item.innerHTML = `

    <div class="f-item-header">

      <span class="f-item-label">
        Ativação
      </span>

      <button
        class="btn-remove"
        onclick="this.closest('.f-item').remove()">

        ✕ Remover
      </button>

    </div>

    <div class="f-group">

      <label>Nome da Ativação</label>

      <input
        type="text"
        class="ativ-nome"
        placeholder="Ex: NÉVOA TÓXICA"
        value="${nome}">

    </div>

    <div class="f-group">

      <label>Descrição / Efeito</label>

      <textarea
        class="ativ-desc"
        placeholder="O que acontece ao ser ativada...">${desc}</textarea>

    </div>

    <div class="f-group">

      <label>Custos de Ativação</label>

      <div class="multi-simbolos">

        <div class="simbolo-linha">

          <input
            type="number"
            class="ativ-qtd"
            min="0"
            max="20"
            value="${dados}"
            style="width:70px;text-align:center">

          <select class="ativ-simbolo">

            <option value="adaptacao">
              Adaptação
            </option>

            <option value="pressao" selected>
              Pressão
            </option>

            <option value="sucesso">
              Sucesso
            </option>

          </select>

        </div>

      </div>

      <button
        type="button"
        class="btn-add-simbolo"
        onclick="addLinhaSimbolo(this, 'ativ')">

        + Adicionar Símbolo
      </button>

    </div>
  `;

  lista.appendChild(item);
}

// ── OBJETIVOS ───────────────────────────────

function addObjetivo(tipo, nome = '', desc = '', recomp = 5) {

  const listaId =
    tipo === 'principal'
      ? '#lista-objp'
      : '#lista-objs';

  const lista = qs(listaId);

  const item = document.createElement('div');

  item.className = 'f-item';

  item.innerHTML = `

    <div class="f-item-header">

      <span class="f-item-label">
        Objetivo ${tipo === 'principal' ? 'Principal' : 'Secundário'}
      </span>

      <button
        class="btn-remove"
        onclick="this.closest('.f-item').remove()">

        ✕ Remover
      </button>

    </div>

    <div class="f-group">

      <label>Nome do Objetivo</label>

      <input
        type="text"
        class="obj-nome"
        placeholder="Ex: CONTER VAZAMENTO"
        value="${nome}">

    </div>

    <div class="f-group">

      <label>Descrição / Condição</label>

      <textarea
        class="obj-desc"
        placeholder="Como completar este objetivo...">${desc}</textarea>

    </div>

    <div class="f-group">

      <label>Custos / Sucessos</label>

      <div class="multi-simbolos">

        <div class="simbolo-linha">

          <input
            type="number"
            class="obj-qtd"
            min="0"
            max="20"
            value="${recomp}"
            style="width:70px;text-align:center">

          <select class="obj-simbolo">

            <option value="adaptacao">
              Adaptação
            </option>

            <option value="pressao">
              Pressão
            </option>

            <option value="sucesso" selected>
              Sucesso
            </option>

          </select>

        </div>

      </div>

      <button
        type="button"
        class="btn-add-simbolo"
        onclick="addLinhaSimbolo(this, 'obj')">

        + Adicionar Símbolo
      </button>

    </div>
  `;

  lista.appendChild(item);
}

// ── GERAÇÃO DO CARD ─────────────────────────

function gerarCard() {

  const nome =
    (qs('#inp-nome').value.trim() || 'SEM NOME')
      .toUpperCase();

  const desc =
    qs('#inp-desc').value.trim();

  const difQ =
  parseInt(qs('#inp-dif-q').value) || 0;

  const difC =
  parseInt(qs('#inp-dif-c').value) || 0;

  const difD12 =
  parseInt(qs('#inp-dif-d12').value) || 0;

  // CONDICIONANTES

  const condBlocos = qsa('#lista-condic .f-item')
    .map(el => ({

      titulo:
        qs('.cond-titulo', el).value.trim(),

      desc:
        qs('.cond-desc', el).value.trim()

    }))
    .filter(c => c.titulo || c.desc);

  // ATIVAÇÕES

  const ativBlocos = qsa('#lista-ativ .f-item')
    .map(el => ({

      nome:
        qs('.ativ-nome', el).value.trim(),

      desc:
        qs('.ativ-desc', el).value.trim(),

      simbolos:
        qsa('.simbolo-linha', el).map(linha => ({

          quantidade:
            parseInt(qs('.ativ-qtd', linha).value) || 0,

          simbolo:
            qs('.ativ-simbolo', linha).value

        }))

    }))
    .filter(a => a.nome);

  // OBJ PRINCIPAIS

  const objPBlocos = qsa('#lista-objp .f-item')
    .map(el => ({

      nome:
        qs('.obj-nome', el).value.trim(),

      desc:
        qs('.obj-desc', el).value.trim(),

      simbolos:
        qsa('.simbolo-linha', el).map(linha => ({

          quantidade:
            parseInt(qs('.obj-qtd', linha).value) || 0,

          simbolo:
            qs('.obj-simbolo', linha).value

        }))

    }))
    .filter(o => o.nome);

  // OBJ SECUNDÁRIOS

  const objSBlocos = qsa('#lista-objs .f-item')
    .map(el => ({

      nome:
        qs('.obj-nome', el).value.trim(),

      desc:
        qs('.obj-desc', el).value.trim(),

      simbolos:
        qsa('.simbolo-linha', el).map(linha => ({

          quantidade:
            parseInt(qs('.obj-qtd', linha).value) || 0,

          simbolo:
            qs('.obj-simbolo', linha).value

        }))

    }))
    .filter(o => o.nome);

  // HTML

  let html = '';

  const difHtml =
  dadosHtml(
    [{ quantidade: difQ, simbolo: 'square-solid' }],
    '',
    3
  ) +

  dadosHtml(
    [{ quantidade: difC, simbolo: 'diamond-solid' }],
    '',
    3
  ) +

  dadosHtml(
    [{ quantidade: difD12, simbolo: 'pentagon-solid' }],
    '',
    3
  );

  html += `

    <div class="c-header">

      <div class="c-header-tag">
        Conflito
      </div>

      <div class="c-header-title">
        <span>${nome}</span>
      </div>

      <div class="c-header-diff">
        ${difHtml}
      </div>

    </div>
  `;

  // DESCRIÇÃO

  if (desc) {

    html += `
      <div class="c-descricao">
        ${substituirSimbolos(desc)}
      </div>
    `;
  }

  // CONDICIONANTES

  if (condBlocos.length) {

    html += `
      <div class="c-secao">

        <div class="c-rotulo condic">
          <span>Condicionantes</span>
        </div>

        <div class="c-conteudo">
    `;

    condBlocos.forEach(c => {

      html += `
        <div class="c-cond-bloco">
      `;

      if (c.titulo) {

        html += `
          <div class="c-cond-titulo">
            ${c.titulo.toUpperCase()}
          </div>
        `;
      }

      if (c.desc) {

        html += `
          <div class="c-cond-desc">
            ${substituirSimbolos(c.desc, 'condic')}
          </div>
        `;
      }

      html += `</div>`;
    });

    html += `
        </div>
      </div>
    `;
  }

  // ATIVAÇÕES

  if (ativBlocos.length) {

    html += `
      <div class="c-secao">

        <div class="c-rotulo ativ">
          <span>Ativações do Conflito</span>
        </div>

        <div class="c-conteudo">
    `;

    ativBlocos.forEach(a => {

      const sym = dadosHtml(a.simbolos, 'ativ');

      html += `

        <div class="c-ativ-linha">

          <div class="c-ativ-dados">
            ${sym}
          </div>

          <div class="c-ativ-texto">

            ${a.nome
              ? `<strong>— ${a.nome.toUpperCase()}</strong><br>`
              : ''}

            ${substituirSimbolos(a.desc, 'ativ')}

          </div>

        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  // OBJ PRINCIPAIS

  if (objPBlocos.length) {

    html += `
      <div class="c-secao">

        <div class="c-rotulo objp">
          <span>Objetivos Principais</span>
        </div>

        <div class="c-conteudo">
    `;

    objPBlocos.forEach(o => {

      const rec = dadosHtml(o.simbolos, 'objp');

      html += `

        <div class="c-obj-linha">

          <div class="c-obj-nome-linha">

            <span class="c-obj-nome">
              ${o.nome.toUpperCase()}
            </span>

            ${o.simbolos.length
              ? `<span>—</span><span class="c-obj-dados">${rec}</span>`
              : ''}

          </div>

          ${o.desc
            ? `<div class="c-obj-desc">${substituirSimbolos(o.desc, 'objp')}</div>`
            : ''}

        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  // OBJ SECUNDÁRIOS

  if (objSBlocos.length) {

    html += `
      <div class="c-secao">

        <div class="c-rotulo objs">
          <span>Objetivos Secundários</span>
        </div>

        <div class="c-conteudo">
    `;

    objSBlocos.forEach(o => {

      const rec = dadosHtml(o.simbolos, 'objs');

      html += `

        <div class="c-obj-linha">

          <div class="c-obj-nome-linha">

            <span class="c-obj-nome">
              ${o.nome.toUpperCase()}
            </span>

            ${o.simbolos.length
              ? `<span>—</span><span class="c-obj-dados">${rec}</span>`
              : ''}

          </div>

          ${o.desc
            ? `<div class="c-obj-desc">${substituirSimbolos(o.desc, 'objs')}</div>`
            : ''}

        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  // RODAPÉ

  html += `

    <div class="c-rodape">

      <span>Assimilação RPG</span>

      <span>Cena de Conflito</span>

    </div>
  `;

  const card = qs('#card-conflito');

  const vazio = qs('#preview-empty');

  card.innerHTML = html;

  card.style.display = 'block';

  if (vazio) {
    vazio.style.display = 'none';
  }
}
// ── EXPORTAR / IMPORTAR JSON ───────────────

function coletarDadosConflito() {

  return {

    nome:
      qs('#inp-nome').value.trim(),

    desc:
      qs('#inp-desc').value.trim(),

    difQ:
      parseInt(qs('#inp-dif-q').value) || 0,

    difC:
      parseInt(qs('#inp-dif-c').value) || 0,

    difD12:
      parseInt(qs('#inp-dif-d12').value) || 0,

    condicionantes:
      qsa('#lista-condic .f-item')
        .map(el => ({

          titulo:
            qs('.cond-titulo', el).value.trim(),

          desc:
            qs('.cond-desc', el).value.trim()

        })),

    ativacoes:
      qsa('#lista-ativ .f-item')
        .map(el => ({

          nome:
            qs('.ativ-nome', el).value.trim(),

          desc:
            qs('.ativ-desc', el).value.trim(),

          simbolos:
            qsa('.simbolo-linha', el).map(linha => ({

              quantidade:
                parseInt(qs('.ativ-qtd', linha).value) || 0,

              simbolo:
                qs('.ativ-simbolo', linha).value

            }))

        })),

    objetivosPrincipais:
      qsa('#lista-objp .f-item')
        .map(el => ({

          nome:
            qs('.obj-nome', el).value.trim(),

          desc:
            qs('.obj-desc', el).value.trim(),

          simbolos:
            qsa('.simbolo-linha', el).map(linha => ({

              quantidade:
                parseInt(qs('.obj-qtd', linha).value) || 0,

              simbolo:
                qs('.obj-simbolo', linha).value

            }))

        })),

    objetivosSecundarios:
      qsa('#lista-objs .f-item')
        .map(el => ({

          nome:
            qs('.obj-nome', el).value.trim(),

          desc:
            qs('.obj-desc', el).value.trim(),

          simbolos:
            qsa('.simbolo-linha', el).map(linha => ({

              quantidade:
                parseInt(qs('.obj-qtd', linha).value) || 0,

              simbolo:
                qs('.obj-simbolo', linha).value

            }))

        }))
  };
}

function exportarJSON() {

  const dados = coletarDadosConflito();

  const json =
    JSON.stringify(dados, null, 2);

  const blob =
    new Blob([json], { type: 'application/json' });

  const url =
    URL.createObjectURL(blob);

  const nome =
    dados.nome || 'conflito';

  const a =
    document.createElement('a');

  a.href = url;

  a.download =
    `${nome.replace(/\s+/g, '_').toLowerCase()}.json`;

  a.click();

  URL.revokeObjectURL(url);

  toast('JSON exportado!');
}

function limparCampos() {

  qs('#lista-condic').innerHTML = '';
  qs('#lista-ativ').innerHTML = '';
  qs('#lista-objp').innerHTML = '';
  qs('#lista-objs').innerHTML = '';
}

function importarJSON(event) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = e => {

    try {

      const dados =
        JSON.parse(e.target.result);

      qs('#inp-nome').value =
        dados.nome || '';

      qs('#inp-desc').value =
        dados.desc || '';

      qs('#inp-dif-q').value =
        dados.difQ || 0;

      qs('#inp-dif-c').value =
        dados.difC || 0;

      qs('#inp-dif-d12').value =
        dados.difD12 || 0;

      limparCampos();

      (dados.condicionantes || [])
        .forEach(c => {

          addCondicionante(
            c.titulo,
            c.desc
          );
        });

      (dados.ativacoes || [])
        .forEach(a => {

          addAtivacao(
            a.nome,
            a.desc,
            0
          );

          const ultimo =
            qsa('#lista-ativ .f-item').pop();

          const wrapper =
            qs('.multi-simbolos', ultimo);

          wrapper.innerHTML = '';

          (a.simbolos || [])
            .forEach(s => {

              const linha =
                document.createElement('div');

              linha.className =
                'simbolo-linha';

              linha.innerHTML = `

                <input
                  type="number"
                  class="ativ-qtd"
                  min="0"
                  max="20"
                  value="${s.quantidade}"
                  style="width:70px;text-align:center">

                <select class="ativ-simbolo">

                  <option value="adaptacao">
                    Adaptação
                  </option>

                  <option value="pressao">
                    Pressão
                  </option>

                  <option value="sucesso">
                    Sucesso
                  </option>

                </select>

                <button
                  type="button"
                  class="btn-remove"
                  onclick="this.parentElement.remove()">

                  ✕
                </button>
              `;

              qs('select', linha).value =
                s.simbolo;

              wrapper.appendChild(linha);
            });
        });

      (dados.objetivosPrincipais || [])
        .forEach(o => {

          addObjetivo(
            'principal',
            o.nome,
            o.desc,
            0
          );

          const ultimo =
            qsa('#lista-objp .f-item').pop();

          const wrapper =
            qs('.multi-simbolos', ultimo);

          wrapper.innerHTML = '';

          (o.simbolos || [])
            .forEach(s => {

              const linha =
                document.createElement('div');

              linha.className =
                'simbolo-linha';

              linha.innerHTML = `

                <input
                  type="number"
                  class="obj-qtd"
                  min="0"
                  max="20"
                  value="${s.quantidade}"
                  style="width:70px;text-align:center">

                <select class="obj-simbolo">

                  <option value="adaptacao">
                    Adaptação
                  </option>

                  <option value="pressao">
                    Pressão
                  </option>

                  <option value="sucesso">
                    Sucesso
                  </option>

                </select>

                <button
                  type="button"
                  class="btn-remove"
                  onclick="this.parentElement.remove()">

                  ✕
                </button>
              `;

              qs('select', linha).value =
                s.simbolo;

              wrapper.appendChild(linha);
            });
        });

      (dados.objetivosSecundarios || [])
        .forEach(o => {

          addObjetivo(
            'secundario',
            o.nome,
            o.desc,
            0
          );

          const ultimo =
            qsa('#lista-objs .f-item').pop();

          const wrapper =
            qs('.multi-simbolos', ultimo);

          wrapper.innerHTML = '';

          (o.simbolos || [])
            .forEach(s => {

              const linha =
                document.createElement('div');

              linha.className =
                'simbolo-linha';

              linha.innerHTML = `

                <input
                  type="number"
                  class="obj-qtd"
                  min="0"
                  max="20"
                  value="${s.quantidade}"
                  style="width:70px;text-align:center">

                <select class="obj-simbolo">

                  <option value="adaptacao">
                    Adaptação
                  </option>

                  <option value="pressao">
                    Pressão
                  </option>

                  <option value="sucesso">
                    Sucesso
                  </option>

                </select>

                <button
                  type="button"
                  class="btn-remove"
                  onclick="this.parentElement.remove()">

                  ✕
                </button>
              `;

              qs('select', linha).value =
                s.simbolo;

              wrapper.appendChild(linha);
            });
        });

      gerarCard();

      toast('JSON importado!');

    } catch(err) {

      console.error(err);

      toast('Arquivo JSON inválido.');
    }
  };

  reader.readAsText(file);
}

// ── EXPORTAR TEXTO ──────────────────────────

function exportarTexto() {
  toast('Exportação de texto temporariamente simplificada.');
}

// ── EXPORTAR IMAGEM ─────────────────────────

function exportarImagem() {

  const card = qs('#card-conflito');

  if (!card || card.style.display === 'none') {

    toast('Gere um conflito primeiro!');

    return;
  }

  if (typeof html2canvas === 'undefined') {

    toast('html2canvas não carregado.');

    return;
  }

  toast('Gerando imagem…');

  html2canvas(card, {

    scale: 2.5,
    backgroundColor: '#E8D5A3',
    useCORS: true,
    logging: false,
    imageTimeout: 0,

  })
  .then(canvas => {

    const nome =
      qs('#inp-nome').value.trim() || 'conflito';

    canvas.toBlob(blob => {

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download =
        `${nome.replace(/\s+/g, '_').toLowerCase()}_conflito.png`;

      a.click();

      URL.revokeObjectURL(url);

      toast('Imagem exportada!');

    }, 'image/png');

  })
  .catch(err => {

    console.error(err);

    toast('Erro ao gerar imagem.');
  });
}

// ── EXEMPLOS ────────────────────────────────

function carregarExemplos() {

  qs('#inp-nome').value =
    'Laboratório Contaminado';

  qs('#inp-desc').value =
    'Um antigo laboratório está tomado por vazamentos e fumaça tóxica.';

  qs('#inp-dif-q').value = 2;
  qs('#inp-dif-c').value = 1;
  qs('#inp-dif-d12').value = 1;

  addCondicionante(
    'LOCAL FECHADO',
    'Qualquer ação envolvendo corrida precisa de <pressao>.'
  );

  addAtivacao(
    'NÉVOA TÓXICA',
    'Causa dano contínuo.',
    4
  );

  addObjetivo(
    'principal',
    'CONTER VAZAMENTO',
    'Impedir propagação.',
    10
  );

  addObjetivo(
    'secundario',
    'OBTER DADOS',
    'Recuperar pesquisas.',
    5
  );
}

// ── INIT ────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  qs('#btn-add-condic')
    .addEventListener('click', () => addCondicionante());

  qs('#btn-add-ativ')
    .addEventListener('click', () => addAtivacao());

  qs('#btn-add-objp')
    .addEventListener('click', () => addObjetivo('principal'));

  qs('#btn-add-objs')
    .addEventListener('click', () => addObjetivo('secundario'));

  qs('#btn-gerar')
    .addEventListener('click', gerarCard);

  qs('#btn-exp-img')
    .addEventListener('click', exportarImagem);
    qs('#btn-exp-json')
    .addEventListener('click', exportarJSON);

  qs('#btn-imp-json')
    .addEventListener('click', () => {

      qs('#inp-import-json').click();
    });

  qs('#inp-import-json')
    .addEventListener('change', importarJSON);

  carregarExemplos();

  setTimeout(gerarCard, 80);
});