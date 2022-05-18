enum Directive {
  Start = '@z.',
  Append = '@z&.',
}

const SLICE_OFFSETS: Record<Directive, number> = {
  [Directive.Start]: 1,
  [Directive.Append]: 3,
}

function hasDirectives(line: string, directives = Object.values(Directive)) {
  return directives.some((directive) => {
    return line.trim().startsWith(directive)
  })
}

function hasNoDirectives(line: string, directives?: Directive[]) {
  return !hasDirectives(line, directives)
}

function extractDirectiveValue(lines: string[], directive: Directive) {
  for (const line of lines) {
    if (hasNoDirectives(line, [directive])) continue
    return line.trim().slice(SLICE_OFFSETS[directive])
  }

  return null
}

export const getJSDocs = (docString?: string) => {
  const lines: string[] = []

  if (docString) {
    const docLines = docString
      .split('\n')
      .filter((line) => hasNoDirectives(line))

    if (docLines.length > 0) {
      lines.push('/**')
      docLines.forEach((line) => lines.push(` * ${line}`))
      lines.push(' */')
    }
  }

  return lines
}

export function findCustomSchema(documentation: string): string | null {
  const lines = documentation.split('\n')
  return extractDirectiveValue(lines, Directive.Start)
}

export function findSchemaAppends(documentation: string): string[] {
  const appends: string[] = []

  for (const line of documentation.split('\n')) {
    const append = extractDirectiveValue([line], Directive.Append)
    if (append) appends.push(append)
  }

  return appends
}
