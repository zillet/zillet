function getImages(name) {
  try {
    return require(`@/assets/icons/${name.toLowerCase()}.png`);
  } catch (error) {
    console.log(error);
  }
}

export { getImages };
