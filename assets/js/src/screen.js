// static methos cant access the 'this'
// so we dont will set the Util in our constructor
const util = Util;

const CONTENT_ID = 'content';
const BTN_PLAY_ID = 'play';
const SHOW_CARDS_ID = 'show-cards';
const MESSAGE_ID = 'message';
const INVISIBLE_CLASS = 'invisible';
const LOADING_ID = 'loading';
const COUNT_DOWN_ID = 'count-down';

const MESSAGES = {
  success: {
    text: 'Correct combination!',
    class: 'alert-success'
  },
  error: {
    text: 'Wrong combination!',
    class: 'alert-danger'
  }
}

class Screen {
  static getHtmlCode(item) {
    return `      
    <div class="col-md-3">
      <div class="card" onclick="window.checkSelection('${item.id}', '${item.name}')">
        <img src="${item.img}" name="${item.name}" class="card-img-top" alt="Hero ${item.name}">
      </div>
    </div>
    `;
  }

  static setUpCheckSelectionButton(fnOnClick) {
    window.checkSelection = fnOnClick;
  }

  static changeHtmlContent(htmlCode) {
    const content = document.getElementById(CONTENT_ID);
    content.innerHTML = htmlCode;
  }

  static createStringHtml(items) {
    // For each item of list will execute the getHtmlCode function
    // finally will become all of this in a unique string 
    // will change Array to String
    return items.map(item => this.getHtmlCode(item)).join('');
  }

  static updateImages(items) {
    const htmlCode = this.createStringHtml(items);
    this.changeHtmlContent(htmlCode);
  }

  static setUpPlayButton(fnOnClick) {
    const btnPlay = document.getElementById(BTN_PLAY_ID);
    btnPlay.onclick = fnOnClick;
  }

  static showHeroes(heroName, image) {
    const htmlElements = document.getElementsByName(heroName);
    // for each element found on screen, we will change the image
    // to the his initial image
    // using forEach, for each item inside of () we set the value of image
    htmlElements.forEach(item => (item.src = image));
  }

  static async showMessage(success = true) {
    const element = document.getElementById(MESSAGE_ID);
    if (success) {
      element.classList.remove(MESSAGES.error.class);
      element.classList.add(MESSAGES.success.class);
      element.innerHTML = MESSAGES.success.text;
    } else {
      element.classList.remove(MESSAGES.success.class);
      element.classList.add(MESSAGES.error.class);
      element.innerHTML = MESSAGES.error.text;
    }
    element.classList.remove(INVISIBLE_CLASS);
    
    await util.timeout(1000);
    element.classList.add(INVISIBLE_CLASS);
  }

  static showLoading(show = true) {
    const loading = document.getElementById(LOADING_ID);
    if (show) {
      loading.classList.remove(INVISIBLE_CLASS);
      return;
    }

    loading.classList.add(INVISIBLE_CLASS);
  }

  static startsCountDown() {
    let countTo = 3;
    const countDownElement = document.getElementById(COUNT_DOWN_ID);
    // will swap the text beginning $$count seconds and
    // where is the $$count will add a value
    const identifierInText = '$$count';
    const defaultText = `Starts in ${identifierInText} seconds...`;
    // create method to update the text each 1 second
    const updateText = () => 
    (countDownElement.innerHTML = defaultText.replace(identifierInText, countTo--));

    updateText();
    // each 1 second, will call update text method
    // these function will swap the $$count for `countTo`
    // and returns the intervalId
    const intervalId = setInterval(updateText, 1000);
    return intervalId;
  }

  static clearCountDown(intervalId) {
    clearInterval(intervalId);
    // leave without text
    document.getElementById(COUNT_DOWN_ID).innerHTML = ''
  }

  static setUpShowCardsButton(fnOnClick) {
    const btnShowCards = document.getElementById(SHOW_CARDS_ID);
    btnShowCards.onclick = fnOnClick;
  }
}