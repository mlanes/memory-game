function onLoad() {
  const dependecies = {
    screen: Screen, // Screen is a global class
    util: Util
  }
  // starts memory game
  const memoryGame = new MemoryGame(dependecies);
  memoryGame.init();
}
window.onload = onLoad;