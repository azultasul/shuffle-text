(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ShuffleText = factory());
})(this, (function () { 'use strict';

  /**
   * ShuffleText 
   * @author Tasul, azultasul@gmail.com
   */

  let settings = {}
  
  const data = {
    say: [],
    txtLength: [],
    currentSay: [],
    nextText: [],
    replaceIndex: [],
    playIndex: [],
    totalReplaceTime: 0,
  };

  function ShuffleText(target, options) {
    settings = {
      shuffleTarget: options.shuffleTarget || null,
      playType: options.playType || null,
      isReplacedRandomly: options.isReplacedRandomly || true,
      isOrderedArray: options.isOrderedArray || false,
      stayTime: options.stayTime || 1500,
      replaceTime: options.replaceTime || 100,
      shuffleTarget: document.querySelector(`${target}`),
    }
    data.say = settings.isOrderedArray ? shuffleArray(options.textArray) : options.textArray;
    data.txtLength = data.say.map(item => item.length);
  
    data.say[0].split('').forEach(txt => {
      data.currentSay.push(`<span>${txt}</span>`);
    })

    insertHtml(settings.shuffleTarget);
    if (settings.playType == 'auto') {
      playAuto();
    }
  }

  let setReplaceTime;
  const replaceText = () => {
    clearTimeout(setReplaceTime)
    data.playIndex.forEach((text, index) => {
      setReplaceTime = setTimeout(() => {
        data.currentSay[text] = `<span>${data.nextText[text]}</span>`
        
        if (index == (data.playIndex.length - 1)) {
          data.currentSay = data.currentSay.filter((el) => el !== '<span></span>')
        }
        insertHtml(settings.shuffleTarget);
      }, settings.replaceTime * (index))
    })
  }

  const setShortArray = (shortArray, longArray) => {
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
    if (settings.isReplacedRandomly) {
      data.playIndex = shuffleArray(data.playIndex);
    }
  }

  const repeatAction = (shortArray, longArray) => {
    getRandomIndex(shortArray.length, longArray.length);
    setShortArray(shortArray, longArray);
    replaceText();
  }

  const compareLength = (item) => {
    data.nextText = item.split('');
    const nextLength = data.nextText.length;
    const currentLength = data.currentSay.length;
    
    if (nextLength < currentLength) {
      repeatAction(data.nextText, data.currentSay);
      data.totalReplaceTime = currentLength * settings.replaceTime;
    } else {
      repeatAction(data.currentSay, data.nextText);
      data.totalReplaceTime = nextLength * settings.replaceTime;
    }
  }

  let setAutoTime;
  let sayIndex = 1;  // next index
  const playAuto = () => {
    clearTimeout(setAutoTime)
    setAutoTime = setTimeout(() => {
      play();
      playAuto();
    }, data.totalReplaceTime + (settings.stayTime));
  }
  const play = () => {
    data.replaceIndex = [];
    data.playIndex = [];
    compareLength(data.say[sayIndex]); // item은 say에서 next item
    sayIndex = sayIndex == data.say.length - 1 ? sayIndex = 0 : sayIndex + 1;
  }

  const shuffleArray = (array) => {
    let currentIndex = array.length;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  const insertHtml = (target) => {
    let htmlText = ''
    data.currentSay.forEach(el => {
      htmlText = htmlText + el
    });
    target.innerHTML = htmlText
  }
  
  ShuffleText.prototype = {
    playAuto,
    play,
    clear: () => {
      clearTimeout(setReplaceTime)
      clearTimeout(setAutoTime)
    }
  }

  return ShuffleText;
}));