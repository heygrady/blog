import Typography from 'typography'
// @ts-expect-error
import Wordpress2016 from 'typography-theme-wordpress-2016'

// FIXME: this is different in prod versus dev
export const typography = new Typography(Wordpress2016.default ?? Wordpress2016)

export const googleFont = (): string | null => {
  // Create family + styles string
  let fontsStr = ''
  if (typography.options.googleFonts != null) {
    const fonts = typography.options.googleFonts.map((font) => {
      let str = ''
      str += font.name.split(' ').join('+')
      str += ':'
      str += font.styles.join(',')

      return str
    })
    fontsStr = fonts.join('|')
    if (fontsStr !== '') {
      return fontsStr
    }
  }
  return null
}
