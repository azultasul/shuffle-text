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
const says = {
  1: [
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
  ],
  2: [
    "Hello",
    "안녕하세요",
  ]
}

const hoverTarget = document.querySelector(".shuffle-hover-target")
const initData = {
  textArray: sayAuto,
  playType: 'hover', // 'auto' / 'hover'
  replaceTime: [1500, 100], // [stayTime, replaceTime]
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
  stayTime: 0,
  replaceTime: 0,
  totalReplaceTime: 0,
};

const replaceText = (sayArray) => {
  console.log("replaceText");
  data.playIndex.forEach((text, index) => {
    setTimeout(() => {
      if (initData.playType == 'auto') {
        data.currentSay[text] = `<span>${data.nextText[text]}</span>`
        
        if (index == (data.playIndex.length - 1)) {
          // data.currentSay = 
          // _.go(data.currentSay,
          //   _.filter((el) => el !== '<span class="t--fak"></span>'),
          //   _.filter((el) => el !== '<span class="t--kr"></span>'),
          // )
          data.currentSay = data.currentSay.filter((el) => el !== '<span></span>')
        }
      } else {
        data.currentSay[text] = sayArray[text]  
      }
      insertHtml();
    }, data.replaceTime * (index))
  })
}

const setShortArray = (shortArray, longArray) => {
  console.log("setShortArray");
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
  console.log("getRandomIndex");
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
  console.log("repeatAction");
  getRandomIndex(shortArray.length, longArray.length);
  setShortArray(shortArray, longArray);
  if (initData.playType == 'auto') {
    replaceText();
  }
}

const compareLength = (item) => {
  console.log("compareLength");
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
  console.log("playAutoType -------");
  setTime = setTimeout(() => {
    data.replaceIndex = [];
    data.playIndex = [];
    compareLength(data.say[sayIndex]); // item은 say에서 next item
    sayIndex = sayIndex == data.say.length - 1 ? sayIndex = 0 : sayIndex + 1;
    playAutoType();
  }, data.totalReplaceTime + (data.stayTime));
}
const playHoverType = () => {
  console.log("playHoverType");
  // data.currentSay = _.map(txt => `<span class="">${txt}</span>`, data.say[0].split(''))
  // data.say[0] = _.map(txt => `<span class="">${txt}</span>`, data.say[0].split(''))
  // data.say[1] = _.map(txt => `<span class="">${txt}</span>`, data.say[1].split(''))
  data.currentSay = data.say[0].split('').map(txt => `<span>${txt}</span>`)
  data.say[0] = data.say[0].split('').map(txt => `<span>${txt}</span>`)
  data.say[1] = data.say[1].split('').map(txt => `<span>${txt}</span>`)
  
  if (data.say[0].length < data.say[1].length) {
    repeatAction(data.say[0], data.say[1]);
  } else {
    repeatAction(data.say[1], data.say[0]);
  }
}

const shuffleArray = (array) => {
  console.log("''shuffleArray");
  let currentIndex = array.length;
  let randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const shuffle = (textArray, playType, replaceTime, isRandom, hoverTarget) => {
  if (initData.playType == 'auto') {
    data.say = initData.isDisorder ? shuffleArray(initData.textArray) : initData.textArray;
    // data.txtLength = _.map(item => item.length, data.say);
    data.txtLength = data.say.map(item => item.length);

    data.say[0].split('').forEach(txt => {
      data.currentSay.push(`<span>${txt}</span>`);
    })
    
    if (initData.replaceTime) {
      data.stayTime = initData.replaceTime[0];
      data.replaceTime = initData.replaceTime[1];
    } else {
      data.stayTime = 2000;
      data.replaceTime = 100;
    }
    console.log("data ---", data);
    playAutoType();
  } else if (initData.playType == 'hover') {
    data.say = initData.textArray;
    data.stayTime = 0;
    data.replaceTime = 20;
    playHoverType();
    console.log("data ---", data);

    initData.hoverTarget.addEventListener('mouseenter', e => {
      replaceText(data.say[1]);
    });
    initData.hoverTarget.addEventListener('mouseleave', e => {
      replaceText(data.say[0]);
    });
    // let test = 0
    // initData.hoverTarget.addEventListener('click', e => {
    //   replaceText(data.say[test === 0 ? 1 : 0]);
    //   test = test === 0 ? 1 : 0
    // });
  }
}

const shuffleTarget = document.querySelector(".shuffle-target")
const insertHtml = () => {
  console.log("insertHtml");
  let htmlText = ''
  data.currentSay.forEach(el => {
    htmlText = htmlText + el
  });
  shuffleTarget.innerHTML = htmlText
  // shuffleTargets.forEach((target, index) => {
  //   target.innerHTML = htmlText
  // })
}

const init = () => {
  shuffle();
  insertHtml();
}

init();