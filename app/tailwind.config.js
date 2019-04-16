module.exports = {
  important: true,
  theme: {
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif']
    },
    extend: {
      colors: {
        transparent: 'transparent',
        black: '#22292F',
        'grey-darkest': '#3d4852',
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
        'grey-lightest': '#f8fafc',
        white: '#ffffff',
        red: '#d82b5d',
        'red-dark': '#CC1F1A',
        yellow: '#e6a23c',
        'yellow-dark': '#F2D024',
        green: '#38c172',
        'green-dark': '#1F9D55',
        'teal-darkest': '#0d3331',
        'teal-darker': '#20504f',
        'teal-dark': '#38a89d',
        teal: '#4dc0b5',
        'teal-light': '#64d5ca',
        'teal-lighter': '#a0f0ed',
        'teal-lightest': '#e8fffe'
      },
      width: {
        '72': '20rem'
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px'
      },
      backgroundColors: {
        modal: 'rgba(0, 0, 0, 0.5)'
      },
      maxWidth: {
        xs: '20rem',
        msm: '25rem',
        sm: '30rem',
        md: '40rem',
        lg: '50rem',
        xl: '60rem',
        '2xl': '70rem',
        '3xl': '80rem',
        '4xl': '90rem',
        '5xl': '100rem',
        full: '100%'
      },
      margin: {
        '96': '24rem',
        '128': '32rem'
      },
      shadows: {
        md: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
        lg: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
        none: 'none'
      },
      zIndex: {
        '1000': 1000
      }
    }
  },
  variants: {
    opacity: ['responsive', 'hover']
  }
};
