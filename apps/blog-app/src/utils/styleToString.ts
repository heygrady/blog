// https://stackoverflow.com/a/61410824
export const styleToString = (style: Record<string, string | number>) => {
  return Object.keys(style).reduce(
    (acc, key) =>
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      acc +
      key
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() +
      ':' +
      style[key] +
      ';',
    ''
  )
}
