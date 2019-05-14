module.exports = {
  important: true,
  theme: {
    screens: {
      mobile: { max: '767px' },
      tablet: { min: '768px', max: '1023px' },
      'small-desktop': { min: '1023px', max: '1279px' },
      desktop: { min: '1280px' }
    },
    extend: {
      colors: {
        transparent: 'transparent',
        black: '#22292F',
        white: '#ffffff',
        primary: '#4dc0b5'
      },
      backgroundColors: {
        modal: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }
};
