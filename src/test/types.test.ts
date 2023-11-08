import { DMMF } from '@prisma/generator-helper'
import { getZodConstructor } from '../types'

describe('types Package', () => {
  test('getZodConstructor', () => {
    const field: DMMF.Field = {
      hasDefaultValue: false,
      isGenerated: false,
      isId: false,
      isList: true,
      isRequired: false,
      isReadOnly: false,
      isUpdatedAt: false,
      isUnique: false,
      kind: 'scalar',
      name: 'nameList',
      type: 'String',
      documentation: [
        '@z.string().min(8).max(64)',
        '@z&.email()',
        'Vasya',
      ].join('\n'),
    }

    const constructor = getZodConstructor(field)

    expect(constructor).toBe('z.string().min(8).max(64).email().nullable()')
  })

  test('append to default type', () => {
    const field: DMMF.Field = {
      hasDefaultValue: false,
      isGenerated: false,
      isId: false,
      isList: true,
      isRequired: false,
      isReadOnly: false,
      isUpdatedAt: false,
      isUnique: false,
      kind: 'scalar',
      name: 'nameList',
      type: 'String',
      documentation: ['Vasya', '@z&.email()'].join('\n'),
    }

    const constructor = getZodConstructor(field)

    expect(constructor).toBe('z.string().email().array().nullable()')
  })

  test('regression - unknown type', () => {
    const field: DMMF.Field = {
      hasDefaultValue: false,
      isGenerated: false,
      isId: false,
      isList: false,
      isRequired: true,
      isUnique: false,
      isReadOnly: false,
      isUpdatedAt: false,
      kind: 'scalar',
      name: 'aField',
      type: 'SomeUnknownType',
    }

    const constructor = getZodConstructor(field)

    expect(constructor).toBe('z.unknown()')
  })
})
