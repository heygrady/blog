// https://stackoverflow.com/a/61410824
export const styleToString = (
  style: Record<string, string | number>
): string => {
  return Object.keys(style).reduce(
    (acc, key) =>
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
