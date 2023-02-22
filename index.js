const sayAuto = [
  "Hello",
  "Yo!",
  "¡Hola!",
  "’Sup!",
  "G’day",
  "Aloha",
  "Salut",
  "Ciao",
  "안녕하세요",
  "こんにちは",
]
const sayHover = [
  "Hello",
  "안녕하세요",
]

const hoverTarget = document.querySelector(".shuffle-hover-target")
const initData = { // 사용자 설정
  textArray: sayHover,
  playType: 'hover', // 'auto' / 'hover'
  stayTime: 1500, 
  replaceTime: 100, 
  isDisorder: true, // true / false
  isRandom: true, // true / false
  hoverTarget: hoverTarget
}

const data = {
  say: [],
  txtLength: [],
  currentSay: [],
  nextText: [],
  replaceIndex: [],
  playIndex: [],
  stayTime: 1500,
  replaceTime: 100,
  totalReplaceTime: 0,
};

const replaceText = (sayArray) => {
  // console.log("replaceText");
  data.playIndex.forEach((text, index) => {
    setTimeout(() => {
      data.currentSay[text] = `<span>${data.nextText[text]}</span>`
      
      if (index == (data.playIndex.length - 1)) {
        data.currentSay = data.currentSay.filter((el) => el !== '<span></span>')
      }
      insertHtml();
    }, data.replaceTime * (index))
  })
}

const setShortArray = (shortArray, longArray) => {
  // console.log("setShortArray");
  let shortI = 0
  let i
  for (i = 0; i < longArray.length; i++) {
    if (data.replaceIndex[shortI] !== i) {
      shortArray.splice(i, 0, '');
    } else {
      shortI++
    }
  }
}

const getRandomIndex = (short, long) => {
  // console.log("getRandomIndex");
  // replace Index
  let check
  let replaceI
  let lastReplaceI = -1;
  let i
  for (i = 0; i < short; i++) {
    check = long - (short - i) - (lastReplaceI + 1)
    replaceI = Math.floor(Math.random() * check);
    lastReplaceI = (lastReplaceI + 1) + replaceI;
    data.replaceIndex.push(lastReplaceI);
  }

  // play Index
  let j
  for (j = 0; j < long; j++) {
    data.playIndex.push(j);
  }
  if (initData.isRandom) {
    data.playIndex = shuffleArray(data.playIndex);
  }
}

const repeatAction = (shortArray, longArray) => {
  // console.log("repeatAction");
  getRandomIndex(shortArray.length, longArray.length);
  setShortArray(shortArray, longArray);
  replaceText();
}

const compareLength = (item) => {
  // console.log("compareLength");
  data.nextText = item.split('');
  const nextLength = data.nextText.length;
  const currentLength = data.currentSay.length;
  
  if (nextLength < currentLength) {
    repeatAction(data.nextText, data.currentSay);
    data.totalReplaceTime = currentLength * data.replaceTime;
  } else {
    repeatAction(data.currentSay, data.nextText);
    data.totalReplaceTime = nextLength * data.replaceTime;
  }
}

let setTime;
let sayIndex = 1;  // next index
const playAutoType = () => {
  // console.log("playAutoType -------");
  setTime = setTimeout(() => {
    play();
    playAutoType();
  }, data.totalReplaceTime + (data.stayTime));
}
const play = () => {
  data.replaceIndex = [];
  data.playIndex = [];
  compareLength(data.say[sayIndex]); // item은 say에서 next item
  sayIndex = sayIndex == data.say.length - 1 ? sayIndex = 0 : sayIndex + 1;
}

const shuffleArray = (array) => {
  // console.log("''shuffleArray");
  let currentIndex = array.length;
  let randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const shuffleTarget = document.querySelector(".shuffle-target")
const insertHtml = () => {
  console.log("insertHtml");
  let htmlText = ''
  data.currentSay.forEach(el => {
    htmlText = htmlText + el
  });
  shuffleTarget.innerHTML = htmlText
}

const init = (textArray, playType, replaceTime, isRandom, hoverTarget) => {
  data.say = initData.isDisorder ? shuffleArray(initData.textArray) : initData.textArray;
  data.txtLength = data.say.map(item => item.length);

  data.say[0].split('').forEach(txt => {
    data.currentSay.push(`<span>${txt}</span>`);
  })
  
  if (initData.replaceTime) {
    data.stayTime = initData.stayTime;
    data.replaceTime = initData.replaceTime;
  } else {
    data.stayTime = 2000;
    data.replaceTime = 100;
  }
  // console.log("data ---", data);

  if (initData.playType == 'auto') {
    playAutoType();
  } else if (initData.playType == 'hover') {
    initData.hoverTarget.addEventListener('mouseenter', e => {
      console.log("mouseenter");
      e.preventDefault();
      play();
    });
    initData.hoverTarget.addEventListener('mouseleave', e => {
      console.log("mouseleave");
      e.preventDefault();
      play();
    });

    initData.hoverTarget.addEventListener('click', e => {
      e.preventDefault();
      play();
    });
  }
  insertHtml();
}

init();