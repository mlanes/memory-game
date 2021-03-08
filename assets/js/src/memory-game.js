const PATH = './assets/img/';
const HEROES_PATH = `${PATH}heroes/`;

class MemoryGame {
  constructor({screen, util}) {
    this.screen = screen;
    this.util = util;

    // path of file, always relative
    // to index.html
    this.initialHeroes = [
      { img: `${HEROES_PATH}spider-man.png`, name: 'Spider-Man' },
      { img: `${HEROES_PATH}thor.png`, name: 'Thor' },
      { img: `${HEROES_PATH}iron-man.png`, name: 'Iron Man' },
      { img: `${HEROES_PATH}captain-america.png`, name: 'Captain America' },
    ];

    this.defaultIcon = `${PATH}default.jpg`;
    this.hiddenHeroes = [];
    this.selectedHeroes = [];
  }

  // to use the property 'this', we can't use 'static'
  init() {
    // will get all the methos of Screen class
    // put all heroes on the screen
    this.screen.updateImages(this.initialHeroes);
    // it forces the screen to use the memory game THIS
    this.screen.setUpPlayButton(this.play.bind(this));
    this.screen.setUpCheckSelectionButton(this.checkSelection.bind(this));
    this.screen.setUpShowCardsButton(this.showHiddenHeroes.bind(this));
  }

  async shuffle() {
    const copies = this.initialHeroes
    // duplicate items
    .concat(this.initialHeroes)
    // get each item and create random id
    .map(item => {
      return Object.assign({}, item, { id: Math.random() / 0.5 });
    })
    // ordenate
    .sort(() => Math.random() - 0.5);

    this.screen.updateImages(copies);
    this.screen.showLoading();

    const intervalId = this.screen.startsCountDown();

    // wait 3 second to refresh the screen
    await this.util.timeout(3000);
    this.screen.clearCountDown(intervalId);
    this.hideHeroes(copies);
    this.screen.showLoading(false);
  }

  hideHeroes(heroes) {
    // lets change image of all existent heroes
    // for the default icon
    const hiddenHeroes = heroes.map(({name, id}) => ({
      id,
      name,
      img: this.defaultIcon
    }));
    // we update the sceen with the hidden heroes
    this.screen.updateImages(hiddenHeroes);
    // save the heroes to work after with them
    this.hiddenHeroes = hiddenHeroes;
  }

  showHeroes(heroName) {
    // search for that hero for the name in out initialHeroes
    // get just his image
    const { img: image } = this.initialHeroes.find(({name}) => heroName === name);
    this.screen.showHeroes(heroName, image);
  }

  checkSelection(id, name) {
    const item = { id, name };
    // verify quantity of selected heroes
    // take a decision if was chose right or wrong
    const selectedHeroes = this.selectedHeroes.length;
    switch (selectedHeroes) {
      case 0:
        // add the choice on list, waiting for next clicked item
        this.selectedHeroes.push(item);
        break;
      case 1:
        // if number of selected heroes is 1, means 
        // that user can choose just one item more
        // we will take the first item from list
        const [ firstOption ] = this.selectedHeroes;
        // clean values to not select more than 2 items
        this.selectedHeroes = [];
        // verify if name and id of items is the same
        if (firstOption.name === item.name && firstOption.id !== item.id) {
          this.showHeroes(item.name);
          this.screen.showMessage();
          return;
        }

        this.screen.showMessage(false);
        break;
    }
  }

  showHiddenHeroes() {
    // Lets take all heroes of screen and put your correct value
    const hiddenHeroes = this.hiddenHeroes;
    for (const hero of hiddenHeroes) {
      const { img } = this.initialHeroes.find(item => item.name === hero.name);
      hero.img = img;
    }
    this.screen.updateImages(hiddenHeroes);
  }

  play() {
    this.shuffle();
  }
}