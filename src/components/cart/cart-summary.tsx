"use client"

import { Button } from "@/components/ui/button"

interface CartSummaryProps {
	subtotal: number
	deliveryFee?: number
	checkoutLabel?: string
	clearLabel?: string
	onCheckout?: () => void
	onClear?: () => void
	isCheckoutDisabled?: boolean
}

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value)

export function CartSummary({
	subtotal,
	deliveryFee = 5,
	checkoutLabel = "Finalizar Pedido",
	clearLabel = "Limpar Carrinho",
	onCheckout,
	onClear,
	isCheckoutDisabled = false,
}: CartSummaryProps) {
	const total = subtotal + deliveryFee

	return (
		<div className="border rounded-lg p-6 sticky top-20 bg-background">
			<h2 className="text-2xl font-bold mb-4">Resumo</h2>

			<div className="space-y-2 mb-4">
				<div className="flex justify-between">
					<span>Subtotal</span>
					<span>{formatCurrency(subtotal)}</span>
				</div>
				<div className="flex justify-between">
					<span>Taxa de entrega</span>
					<span>{formatCurrency(deliveryFee)}</span>
				</div>
				<div className="border-t pt-2 flex justify-between font-bold text-lg">
					<span>Total</span>
					<span>{formatCurrency(total)}</span>
				</div>
			</div>

			<Button className="w-full mb-2" size="lg" onClick={onCheckout} disabled={isCheckoutDisabled}>
				{checkoutLabel}
			</Button>

			<Button variant="outline" className="w-full" onClick={onClear}>
				{clearLabel}
			</Button>
		</div>
	)
}
