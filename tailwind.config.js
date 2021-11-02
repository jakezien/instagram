module.exports = {
  // mode: 'jit',
  future: {
    removeDeprecatedGapUtilities: true
  },
  purge: ['./src/*.js', './src/**/*.js', './src/**/**/*.js'],
    // enabled: process.env.PURGE_CSS === 'production' ? true : false,
    // enabled: false,
    // content: ['./src/**/*.js', './src/**/**/*.js']
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
      },
      height: {
        "screen/2": "50vh",
        "screen-50": "50vh",
        "screen-70": "70vh",
        "screen/3": "calc(100vh / 3)",
        "screen/4": "calc(100vh / 4)",
        "screen/5": "calc(100vh / 5)",
        "screen/5": "calc(100vh / 5)"
      },
      maxHeight: {
        "maxPhotoHeight": "42.5rem"
      }
    }
    
  },
  variants: {
    extend: {
      display: ['group-hover'],
      opacity: ['disabled'],
      cursor: ['disabled']
    }
  }
} 