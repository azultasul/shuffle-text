# ShuffleText

'ShuffleText' is a JavaScript library for text switching effects.  
You can switch any words or sentences you want to show randomly or in order.

## π Install

```jsx
npm i @tasul/shuffle-text
```

## π Basic Usage

```jsx
// html
<div class="my-target"></div>

// js
// const myShuffle = new ShuffleText(target, options)
const shuffleText = new ShuffleText(".my-target", {
  textArray: [ "Hello", "Yo!", "Β‘Hola!", "Salut", "Ciao", "μλνμΈμ", "γγγ«γ‘γ―" ],
  isAuto: false,
  isReplacedRandomly: false,
  isDisorderedArray: false, 
  stayTime: 1500, 
  replaceTime: 50, 
})
```

### Cases
![shshsh](https://user-images.githubusercontent.com/105263749/221733853-af06dcfe-5b74-491d-a9a9-aac4b13a8ee6.gif)
```jsx
// case 1
const shuffleText1 = new ShuffleText(".my-target-1", {
  textArray: [ "Hello", "Yo!", "Β‘Hola!", "Salut", "Ciao", "μλνμΈμ", "γγγ«γ‘γ―" ],
  isAuto: true,
})

// case 2
const shuffleText2 = new ShuffleText(".my-target-2", {
  textArray: [ "Hello", "Yo!", "Β‘Hola!", "Salut", "Ciao", "μλνμΈμ", "γγγ«γ‘γ―" ],
  isAuto: true,
  isReplacedRandomly: true,
})

// case 3
const shuffleText3 = new ShuffleText(".my-target-3", {
  textArray: [ "Hello", "Yo!", "Β‘Hola!", "Salut", "Ciao", "μλνμΈμ", "γγγ«γ‘γ―" ],
  isAuto: true,
  isDisorderedArray: true, 
})

// case 4
const shuffleText4 = new ShuffleText(".my-target-4", {
  textArray: [ "Hello", "Yo!", "Β‘Hola!", "Salut", "Ciao", "μλνμΈμ", "γγγ«γ‘γ―" ],
  isAuto: true,
  isReplacedRandomly: true,
  isDisorderedArray: true, 
})
```

## π Parameter

### target
The element that you want to use 'shuffle text'.  
Use the βidβ or βclassβ name of the element.

### options
Option | Type | Default | Description
:---|:---|:---|:---
textArray | array | [] | Array of words or sentences to shuffle.
isAuto | boolean | false | Define whether to play automatically(true) or not(false). (After the page load)
isReplacedRandomly | boolean | false | Define whether to switch alphabets randomly(true) or in order(false).
isDisorderedArray | boolean | false | Define whether to mix(true) βtextArrayβ or use it in order(false).
stayTime | int | 1500 | Time to stay after shuffling
replaceTime | int | 50 | Time to switch alphabets

## π Methods
Method | Description
:---|:---
clear | Destroy ShuffleText
play | Shuffle text once
playAuto | Start shuffling automatically (Add to any event you want)
