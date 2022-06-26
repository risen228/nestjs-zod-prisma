import { z } from 'zod'

const configBoolean = z
  .enum(['true', 'false'])
  .transform((arg) => arg === 'true')

export const configSchema = z.object({
  relationModel: configBoolean.default('true').or(z.literal('default')),
  generateDto: configBoolean.default('true'),
  modelSuffix: z.string().default('Model'),
  dtoSuffix: z.string().default('Dto'),
  modelCase: z.enum(['PascalCase', 'camelCase']).default('PascalCase'),
  dtoCase: z.enum(['PascalCase', 'camelCase']).default('PascalCase'),
  useDecimalJs: configBoolean.default('false'),
  imports: z.string().optional(),
  prismaJsonNullability: configBoolean.default('true'),
})

export type Config = z.infer<typeof configSchema>

export interface PrismaOptions {
  schemaPath: string
  outputPath: string
  clientPath: string
}

export interface Names {
  model: string
  related: string
}
