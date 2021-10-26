module.exports = {
  future: {
    removeDeprecatedGapUtilities: true
  },
  purge: {
    // enabled: process.env.PURGE_CSS === 'production' ? true : false,
    enabled: false,
    content: ['./src/**/*.js', './src/**/**/*.js']
  },
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        blue: {
          medium: '#005c98'
        },
        black: {
          light: '#262626',
          faded: '#00000059'
        },
        gray: {
          base: '#616161',
          background: '#fafafa',
          primary: '#dbdbdb'
        },
        yellow: {
          primary: 'rgb(255,196,0)',
          light: 'rgb(255, 250, 235)'
        }
      }
    }
  },
  variants: {
    extend: {
      display: ['group-hover']
    }
  }
};
