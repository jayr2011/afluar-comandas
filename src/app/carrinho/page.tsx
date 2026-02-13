"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"

export default function CarrinhoPage() {
  // Descomente quando integrar com Zustand
  // const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  
  // Dados temporários para exemplo
  const items = []
  const totalPrice = 0

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Carrinho</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Seu carrinho está vazio
          </p>
          <Button asChild>
            <a href="/cardapio">Ver Cardápio</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Carrinho</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg"
            >
              {/* Imagem do produto */}
              {item.imagem_url && (
                <img
                  src={item.imagem_url}
                  alt={item.nome}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              
              {/* Detalhes */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.nome}</h3>
                {item.descricao && (
                  <p className="text-sm text-muted-foreground">
                    {item.descricao}
                  </p>
                )}
                <p className="font-bold mt-2">
                  R$ {item.preco.toFixed(2)}
                </p>
              </div>

              {/* Controles de quantidade */}
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    // onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantidade}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    // onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-4">Resumo</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>R$ 5,00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {(totalPrice + 5).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full mb-2" size="lg">
              Finalizar Pedido
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              // onClick={clearCart}
            >
              Limpar Carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
