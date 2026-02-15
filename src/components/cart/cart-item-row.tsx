"use client"

import { Button } from "@/components/ui/button"
import { CartItem } from "@/types/carrinho"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemRowProps {
	item: CartItem
	onRemove?: (id: string) => void
	onDecreaseQty?: (item: CartItem) => void
	onIncreaseQty?: (item: CartItem) => void
}

export function CartItemRow({ item, onRemove, onDecreaseQty, onIncreaseQty }: CartItemRowProps) {
	return (
		<div className="flex gap-4 p-4 border rounded-lg">
			{item.imagem_url && (
				<img src={item.imagem_url} alt={item.nome} className="w-24 h-24 object-cover rounded" />
			)}

			<div className="flex-1">
				<h3 className="font-semibold text-lg">{item.nome}</h3>
				{item.descricao && <p className="text-sm text-muted-foreground">{item.descricao}</p>}
				<p className="font-bold mt-2">R$ {item.preco.toFixed(2)}</p>
			</div>

			<div className="flex flex-col items-end justify-between">
				<Button variant="ghost" size="icon" onClick={() => onRemove?.(item.id)}>
					<Trash2 className="h-4 w-4" />
				</Button>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => onDecreaseQty?.(item)}
					>
						<Minus className="h-4 w-4" />
					</Button>
					<span className="w-8 text-center font-medium">{item.quantidade}</span>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => onIncreaseQty?.(item)}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
