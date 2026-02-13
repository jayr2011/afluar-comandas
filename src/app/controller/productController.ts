import { ProdutosService } from '@/services/productsService'
import { Produto } from '@/types/produtos'
/**
 * Controller responsável por orquestrar operações de produtos entre a camada
 * de rota (API) e o serviço `ProdutosService`.
 *
 * Este controller provê métodos assíncronos que retornam um objeto padrão
 * { success: boolean; data?: T; error?: string } para facilitar o tratamento
 * de respostas nas rotas HTTP.
 */
const produtosService = new ProdutosService()

export class ProdutosController {
  /**
   * Lista todos os produtos.
   * @returns {Promise<{ success: boolean; data?: Produto[]; error?: string }>} Resultado com array de produtos em `data`.
   */
  async listarProdutos(): Promise<{ success: boolean; data?: Produto[]; error?: string }> {
    try {
      const produtos = await produtosService.findAll()      
      return { success: true, data: produtos }
    } catch (error) {
      console.error('Erro ao listar produtos:', error)
      return { success: false, error: 'Erro ao buscar produtos' }
    }
  }

  async obterProduto(id: number): Promise<{ success: boolean; data?: Produto; error?: string }> {
    /**
     * Obtém um produto por `id`.
     * @param {number} id - Identificador do produto.
     * @returns {Promise<{ success: boolean; data?: Produto; error?: string }>} Resultado com o produto em `data` ou erro.
     */
    try {
      const produto = await produtosService.findById(id)
      
      if (!produto) {
        return { success: false, error: 'Produto não encontrado' }
      }
      
      return { success: true, data: produto }
    } catch (error) {
      console.error('Erro ao obter produto:', error)
      return { success: false, error: 'Erro ao buscar produto' }
    }
  }

  async listarPorCategoria(categoria: string): Promise<{ success: boolean; data?: Produto[]; error?: string }> {
    /**
     * Lista produtos filtrando por categoria.
     * @param {string} categoria - Nome da categoria a filtrar.
     * @returns {Promise<{ success: boolean; data?: Produto[]; error?: string }>} Resultado com produtos da categoria.
     */
    try {
      const produtos = await produtosService.findByCategoria(categoria)
      return { success: true, data: produtos }
    } catch (error) {
      console.error('Erro ao listar por categoria:', error)
      return { success: false, error: 'Erro ao buscar produtos' }
    }
  }

  async listarDestaques(): Promise<{ success: boolean; data?: Produto[]; error?: string }> {
    /**
     * Lista produtos marcados como destaque.
     * @returns {Promise<{ success: boolean; data?: Produto[]; error?: string }>} Resultado com produtos em destaque.
     */
    try {
      const produtos = await produtosService.findDestaques()
      return { success: true, data: produtos }
    } catch (error) {
      console.error('Erro ao listar destaques:', error)
      return { success: false, error: 'Erro ao buscar destaques' }
    }
  }

  private validarProduto(produto: any): string | null {
    /**
     * Valida os campos essenciais de um produto antes de criação/atualização.
     * Retorna uma mensagem de erro quando inválido, ou `null` quando válido.
     * @param {any} produto - Objeto com os campos do produto a validar.
     * @returns {string | null}
     */
    if (!produto.nome || produto.nome.trim().length < 3) {
      return 'Nome do produto deve ter pelo menos 3 caracteres'
    }
    if (!produto.preco || produto.preco <= 0) {
      return 'Preço deve ser maior que zero'
    }
    if (!produto.categoria) {
      return 'Categoria é obrigatória'
    }
    return null
  }

  async criarProduto(produto: Omit<Produto, 'id'>): Promise<{ success: boolean; data?: Produto; error?: string }> {
    /**
     * Cria um novo produto após validação.
     * @param {Omit<Produto, 'id'>} produto - Dados do produto sem o campo `id`.
     * @returns {Promise<{ success: boolean; data?: Produto; error?: string }>} Resultado com o produto criado em `data`.
     */
    try {
      const erro = this.validarProduto(produto)
      if (erro) {
        return { success: false, error: erro }
      }

      const novoProduto = await produtosService.create(produto)
      return { success: true, data: novoProduto }
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      return { success: false, error: 'Erro ao criar produto' }
    }
  }
}
