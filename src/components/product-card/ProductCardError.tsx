import { ShoppingCart } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductCardErrorProps {
  title?: string
  message?: string
  children?: React.ReactNode
  className?: string
}

export function ProductCardError({
  title = "Ops!",
  message = "Não foi possível carregar os produtos. Tente novamente mais tarde.",
  children,
  className,
}: ProductCardErrorProps) {
  return (
    <Card className={cn("max-w-2xl mx-auto", className)}>
      <CardHeader>
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <CardTitle className="text-center text-2xl">{title}</CardTitle>
        <CardDescription className="text-center text-base">
          {message}
        </CardDescription>
      </CardHeader>
      {children && (
        <CardContent className="flex justify-center">
          {children}
        </CardContent>
      )}
    </Card>
  )
}
