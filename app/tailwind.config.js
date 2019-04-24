module.exports = {
  important: true,
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        black: '#22292F',
        white: '#ffffff',
        primary: '#4dc0b5'
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
