import { findCustomSchema, getJSDocs } from '../docs'

describe('docs Package', () => {
  test('computeModifiers', () => {
    expect(findCustomSchema('@z.string().url()')).toEqual('z.string().url()')
    expect(findCustomSchema('    @z.string().url()')).toEqual(
      'z.string().url()'
    )
    expect(findCustomSchema('@z.string().url()    ')).toEqual(
      'z.string().url()'
    )
    expect(findCustomSchema('   @z.string().url()   ')).toEqual(
      'z.string().url()'
    )
    expect(findCustomSchema('Yuuki')).toEqual(null)
  })

  test('getJSDocs', () => {
    const docLines = getJSDocs(
      [
        'This is something',
        'How about something else',
        '@something',
        '@example ur mom',
      ].join('\n')
    )

    expect(docLines.length).toBe(6)
    expect(docLines).toStrictEqual([
      '/**',
      ' * This is something',
      ' * How about something else',
      ' * @something',
      ' * @example ur mom',
      ' */',
    ])
  })
})
