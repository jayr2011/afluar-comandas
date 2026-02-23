import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createCategoryAction, deleteCategoryAction, getAdminCategories } from '../actions'

export default async function BlogCategoriasPage() {
  const categories = await getAdminCategories()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategoryAction} className="grid gap-3 md:grid-cols-4">
            <Input name="name" placeholder="Nome da categoria" required />
            <Input name="description" placeholder="Descrição (opcional)" />
            <Input name="color" placeholder="#22c55e" defaultValue="#22c55e" />
            <Button type="submit">Adicionar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias cadastradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
          ) : (
            categories.map(category => {
              const deleteAction = deleteCategoryAction.bind(null, category.id)

              return (
                <div
                  key={category.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">/{category.slug}</p>
                  </div>
                  <form action={deleteAction}>
                    <Button type="submit" variant="destructive" size="sm">
                      Excluir
                    </Button>
                  </form>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
