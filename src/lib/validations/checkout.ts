import { z } from 'zod'

export const checkoutFormSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .transform(s => s.trim()),
  whatsapp: z
    .string()
    .regex(/^[\d\s\-\(\)]{10,20}$/, 'WhatsApp inválido')
    .transform(s => s.replace(/\D/g, ''))
    .refine(n => n.length >= 10 && n.length <= 11, 'WhatsApp deve ter 10 ou 11 dígitos'),
  rua: z
    .string()
    .min(3, 'Endereço muito curto')
    .max(200, 'Endereço muito longo')
    .transform(s => s.trim()),
  numero: z
    .string()
    .min(1, 'Número obrigatório')
    .max(20, 'Número inválido')
    .transform(s => s.trim()),
  bairro: z
    .string()
    .min(2, 'Bairro muito curto')
    .max(100, 'Bairro muito longo')
    .transform(s => s.trim()),
  complemento: z
    .string()
    .max(100, 'Complemento muito longo')
    .transform(s => s.trim() || undefined)
    .optional(),
})

/** Schema para validar no cliente - trim antes de validar para contar só caracteres úteis */
export const checkoutFormClientSchema = z.object({
  nome: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo')),
  whatsapp: z
    .string()
    .transform(s => s.trim())
    .pipe(
      z
        .string()
        .regex(/^[\d\s\-\(\)]{10,20}$/, 'WhatsApp inválido')
        .refine(
          s => s.replace(/\D/g, '').length >= 10 && s.replace(/\D/g, '').length <= 11,
          'WhatsApp deve ter 10 ou 11 dígitos'
        )
    ),
  rua: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string().min(3, 'Endereço muito curto').max(200, 'Endereço muito longo')),
  numero: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string().min(1, 'Número obrigatório').max(20, 'Número inválido')),
  bairro: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string().min(2, 'Bairro muito curto').max(100, 'Bairro muito longo')),
  complemento: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string().max(100, 'Complemento muito longo')),
})

export type CheckoutFormErrors = Partial<
  Record<keyof z.infer<typeof checkoutFormClientSchema>, string>
>
