;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ShuffleText = factory());
})(this, (function () { 'use strict';

  /**
   * ShuffleText 1.0
   * @author Tasul, azultasul@gmail.com
  */

  const ShuffleText = (function() {

    function ShuffleText(target, options) {
      const _ = this;

      _.data = {
        say: [],
        txtLength: [],
        currentSay: [],
        nextText: [],
        replaceIndex: [],
        playIndex: [],
        totalReplaceTime: 0,
        setAutoTimeout: null,
        setReplaceTimeout: null,
        sayIndex: 1,
      }
      _.settings = {
        textArray: options.textArray || [],
        isAuto: options.isAuto || false,
        isReplacedRandomly: options.isReplacedRandomly || false,
        isDisorderedArray: options.isDisorderedArray || false,
        stayTime: options.stayTime || 1500,
        replaceTime: options.replaceTime || 100,
        shuffleTarget: document.querySelector(`${target}`),
      }
      _.data.say = _.settings.isDisorderedArray ? _.shuffleArray(_.settings.textArray) : _.settings.textArray;
      _.data.txtLength = _.data.say.map(item => item.length);
    
      _.data.say[0].split('').forEach(txt => {
        _.data.currentSay.push(`<span>${txt}</span>`);
      })
  
      _.insertHtml();
      if (_.settings.isAuto) {
        _.playAuto();
      }
    }

    return ShuffleText;
  }());
  
  ShuffleText.prototype.replaceText = function() {
    const _ = this;
    clearTimeout(_.setReplaceTimeout)
    _.data.playIndex.forEach((text, index) => {
      _.setReplaceTimeout = setTimeout(() => {
        _.data.currentSay[text] = `<span>${_.data.nextText[text]}</span>`
        
        if (index == (_.data.playIndex.length - 1)) {
          _.data.currentSay = _.data.currentSay.filter((el) => el !== '<span></span>')
        }
        _.insertHtml();
      }, _.settings.replaceTime * (index))
    })
  }

  ShuffleText.prototype.setShortArray = function(shortArray, longArray) {
    const _ = this;
    let shortI = 0
    let i
    for (i = 0; i < longArray.length; i++) {
      if (_.data.replaceIndex[shortI] !== i) {
        shortArray.splice(i, 0, '');
      } else {
        shortI++
      }
    }
  }

  ShuffleText.prototype.getRandomIndex = function(short, long) {
    const _ = this;
    // replace Index
    let check
    let replaceI
    let lastReplaceI = -1;
    let i
    for (i = 0; i < short; i++) {
      check = long - (short - i) - (lastReplaceI + 1)
      replaceI = Math.floor(Math.random() * check);
      lastReplaceI = (lastReplaceI + 1) + replaceI;
      _.data.replaceIndex.push(lastReplaceI);
    }

    // play Index
    let j
    for (j = 0; j < long; j++) {
      _.data.playIndex.push(j);
    }
    if (_.settings.isReplacedRandomly) {
      _.data.playIndex = _.shuffleArray(_.data.playIndex);
    }
  }

  ShuffleText.prototype.repeatAction = function(shortArray, longArray) {
    const _ = this;
    _.getRandomIndex(shortArray.length, longArray.length);
    _.setShortArray(shortArray, longArray);
    _.replaceText();
  }

  ShuffleText.prototype.compareLength = function(item) {
    const _ = this;
    _.data.nextText = item.split('');
    const nextLength = _.data.nextText.length;
    const currentLength = _.data.currentSay.length;
    
    if (nextLength < currentLength) {
      _.repeatAction(_.data.nextText, _.data.currentSay);
      _.data.totalReplaceTime = currentLength * _.settings.replaceTime;
    } else {
      _.repeatAction(_.data.currentSay, _.data.nextText);
      _.data.totalReplaceTime = nextLength * _.settings.replaceTime;
    }
  }

  ShuffleText.prototype.playAuto = function() {
    const _ = this;
    clearTimeout(_.setAutoTimeout)
    _.setAutoTimeout = setTimeout(() => {
      _.play();
      _.playAuto();
    }, _.data.totalReplaceTime + (_.settings.stayTime));
  }

  ShuffleText.prototype.play = function() {
    const _ = this;
    _.data.replaceIndex = [];
    _.data.playIndex = [];
    _.compareLength(_.data.say[_.data.sayIndex]); // item은 say에서 next item
    _.data.sayIndex = _.data.sayIndex == _.data.say.length - 1 ? _.data.sayIndex = 0 : _.data.sayIndex + 1;
  }

  ShuffleText.prototype.shuffleArray = function(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  ShuffleText.prototype.insertHtml = function() {
    const _ = this;
    let htmlText = ''
    _.data.currentSay.forEach(el => {
      htmlText = htmlText + el
    });
    _.settings.shuffleTarget.innerHTML = htmlText
  }

  ShuffleText.prototype.clear = function() {
    const _ = this;
    clearTimeout(_.data.setReplaceTimeout)
    clearTimeout(_.data.setAutoTimeout)
  }

  return ShuffleText;
}));