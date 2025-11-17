import prettierrc from '../../.prettierrc.mjs'

export default {
  'prettier/prettier': [
    'error',
    prettierrc,
    {
      usePrettierrc: false,
    },
  ],
}
