import type { DMMF } from '@prisma/generator-helper'
import { findCustomSchema, findSchemaAppends } from './docs'

const mapScalarType: Record<string, string> = {
  String: 'z.string()',
  Int: 'z.number().int()',
  BigInt: 'z.bigint()',
  DateTime: 'z.date()',
  Float: 'z.number()',
  Decimal: 'z.number()',
  Json: 'z.json()',
  Boolean: 'z.boolean()',
  Bytes: 'z.instanceOf(Buffer)',
}

export const getZodConstructor = (
  field: DMMF.Field,
  getRelatedModelName = (
    name: string | DMMF.SchemaEnum | DMMF.OutputType | DMMF.SchemaArg
  ) => name.toString()
) => {
  let schema: string

  if (
    field.kind === 'scalar' &&
    typeof field.type === 'string' &&
    Object.prototype.hasOwnProperty.call(mapScalarType, field.type)
  ) {
    schema = mapScalarType[field.type]
  } else if (field.kind === 'enum') {
    schema = `z.nativeEnum(${field.type})`
  } else if (field.kind === 'object') {
    schema = getRelatedModelName(field.type)
  } else {
    schema = 'z.unknown()'
  }

  let isCustom = false

  if (field.documentation) {
    const custom = findCustomSchema(field.documentation)
    const appends = findSchemaAppends(field.documentation)

    if (custom) {
      isCustom = true
      schema = custom
    }

    for (const append of appends) {
      schema += append
    }
  }

  if (field.isList && !isCustom) {
    schema += '.array()'
  }

  if (!field.isRequired && field.type !== 'Json') {
    schema += '.nullable()'
  }

  return schema
}
