import { Produto } from '@/types/produtos'

/**
 * Banco de dados em memória de produtos usado pelo `ProdutosService`.
 * Para desenvolvimento e testes — os dados não são persistidos.
 */
const produtosDB: Produto[] = [
  {
    id: '1',
    nome: "Pirarucu Grelhado ao Tucupi",
    descricao: "Peixe amazônico grelhado no ponto perfeito, acompanhado de tucupi negro artesanal, jambu fresco e farofa crocante. Uma explosão de sabores da Amazônia.",
    preco: 89.90,
    categoria: "Pratos Principais",
    destaque: true,
    imagem: "/produtos/pirarucu.webp"
  },
  {
    id: '2',
    nome: "Açaí Artesanal Premium",
    descricao: "Açaí puro batido na hora, com textura cremosa e aveludada. Acompanha granola caseira, frutas frescas e mel de abelhas amazônicas.",
    preco: 32.90,
    categoria: "Sobremesas",
    destaque: false,
    imagem: "/produtos/acai_puro_natural.webp"
  }
]

/**
 * Serviço simples para operações CRUD sobre produtos em memória.
 *
 * Notas:
 * - Métodos simulam latência com `setTimeout`.
 * - Útil para desenvolvimento / testes locais.
 */
export class ProdutosService {
  /**
   * Retorna todos os produtos.
   * @returns {Promise<Produto[]>} Array com todos os produtos.
   */
  async findAll(): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return produtosDB
  }

  /**
   * Busca produto por `id`.
   * @param {string} id - Identificador do produto.
   * @returns {Promise<Produto|null>} Produto encontrado ou `null` se não existir.
   */
  async findById(id: string): Promise<Produto | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return produtosDB.find(p => p.id === id) || null
  }

  /**
   * Retorna produtos de uma determinada categoria.
   * @param {string} categoria - Nome da categoria para filtro.
   * @returns {Promise<Produto[]>} Array de produtos da categoria.
   */
  async findByCategoria(categoria: string): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return produtosDB.filter(p => p.categoria === categoria)
  }

  /**
   * Retorna produtos marcados como destaque.
   * @returns {Promise<Produto[]>} Array de produtos em destaque.
   */
  async findDestaques(): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return produtosDB.filter(p => p.destaque)
  }

  /**
   * Cria um novo produto e atribui um `id` único.
   * @param {Omit<Produto, 'id'>} produto - Dados do produto (sem `id`).
   * @returns {Promise<Produto>} Produto criado com `id` definido.
   */
  async create(produto: Omit<Produto, 'id'>): Promise<Produto> {
    const novoProduto = {
      ...produto,
      id: String(Math.max(...produtosDB.map(p => Number(p.id) || 0)) + 1)
    }
    produtosDB.push(novoProduto)
    return novoProduto
  }

  /**
   * Atualiza campos do produto especificado por `id`.
   * @param {string} id - Identificador do produto a ser atualizado.
   * @param {Partial<Produto>} produto - Campos a atualizar.
   * @returns {Promise<Produto|null>} Produto atualizado ou `null` se não existir.
   */
  async update(id: string, produto: Partial<Produto>): Promise<Produto | null> {
    const index = produtosDB.findIndex(p => p.id === id)
    if (index === -1) return null
    
    produtosDB[index] = { ...produtosDB[index], ...produto }
    return produtosDB[index]
  }

  /**
   * Remove um produto pelo `id`.
   * @param {string} id - Identificador do produto a remover.
   * @returns {Promise<boolean>} `true` se removido, `false` se não encontrado.
   */
  async delete(id: string): Promise<boolean> {
    const index = produtosDB.findIndex(p => p.id === id)
    if (index === -1) return false
    
    produtosDB.splice(index, 1)
    return true
  }
}
