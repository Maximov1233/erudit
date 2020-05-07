// import

import {
    dictionary
} from './dictionary.js';
import {
    alphabet
} from './alphabet.js';

// adding cells

const tripleWord = [0, 7, 14, 105, 119, 210, 217, 224],
    doubleLetter = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221],
    doubleWord = [16, 28, 32, 42, 48, 56, 64, 70, 154, 160, 168, 176, 182, 192, 196, 208],
    tripleLetter = [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204];

const box = document.querySelector('.box');

for (let i = 0; i < 225; i++) {
    const boxCell = document.createElement('div');
    boxCell.classList.add('box-cell');
    boxCell.dataset.pos = i + 1;
    box.append(boxCell);
}

const availableLetters = document.querySelector('.available-letters'),
    boxCells = document.querySelectorAll('.box-cell'),
    bagItems = document.querySelector('.bag-items'),
    bagTitle = document.querySelector('.bag-title'),
    bagModal = document.querySelector('.bag-modal__bg'),
    historyTitle = document.querySelector('.history-title'),
    historyList = document.querySelector('.history-list'),
    submitButton = document.querySelector('.submit-button'),
    wordIndicator = document.createElement('div'),
    hint = document.querySelector('.hints'),
    bagClose = document.querySelector('.bag-close'),
    wrongWordModal = document.querySelector('.wrong-word__modal__bg'),
    wrongWordModalText = wrongWordModal.querySelector('.words'),
    center = boxCells[112];

center.classList.add('star');
wordIndicator.classList.add('word-indicator');

let points = 0,
    wordX,
    wordY,
    word;

const emptyChecker = (arr, comparing) => {
    let checker = arr.every((elem) => {
        return elem !== comparing;
    });
    return checker;
};

// adding classes

tripleWord.forEach((key) => {
    boxCells[key].classList.add('triple-word');
});
doubleLetter.forEach((key) => {
    boxCells[key].classList.add('double-letter');
});
doubleWord.forEach((key) => {
    boxCells[key].classList.add('double-word');;
});
tripleLetter.forEach((key) => {
    boxCells[key].classList.add('triple-letter');
});

// coordinates

let x = 1,
    y = 1;

for (let i = 0; i < boxCells.length; i++) {
    boxCells[i].dataset.x = x;
    boxCells[i].dataset.y = y;
    x++;
    if (x === 16) {
        x = 1;
        boxCells[i].dataset.y = y;
        y++;
    }
}

// functions

const fillingBag = () => { // fills the bag in sidebar
    for (let key in alphabet) {
        const bagItem = document.createElement('div');
        bagItem.classList.add('bag-item');
        bagItem.innerHTML = `
        <div class="letter">
            <p class="letter-symbol">${alphabet[key].symbol}</p>
            <p class="letter-index">${alphabet[key].index}</p>
        </div>
        <p class="amount">${alphabet[key].amount}</p>
        `;
        bagItems.append(bagItem);
    }
};

fillingBag();

const tilesInBag = document.querySelectorAll('.bag-item .letter');

const tilesBagChecker = (symbol) => { // checks if the letter is available in bag
    let checker;
    for (let i = 0; i < tilesInBag.length; i++) {
        if (tilesInBag[i].childNodes[1].textContent === symbol) {
            if (tilesInBag[i].parentNode.childNodes[3].textContent !== '0') {
                tilesInBag[i].parentNode.childNodes[3].textContent--;
                checker = true;
            } else {
                checker = false;
            }
            break;
        }
    }
    return checker;
};

const randomProperty = (obj) => { // return random key from object
    const keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

const getRandomIntInclusive = (min, max) => { // returns random number in iclusive range
    min = Math.ceil(min);
    max = Math.floor(max);
    let number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number;
};

const shuffle = (arr) => { // suffles the array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const appendingTiles = (arr) => { // appends tiles into available letters
    let slots = document.querySelectorAll('.slot');
    if (slots.length === 0) {
        arr.forEach((item) => {
            const slot = document.createElement('div');
            slot.classList.add('slot');
            const letter = document.createElement('div');
            letter.classList.add('letter');
            letter.setAttribute('draggable', 'true');
            letter.innerHTML = `
                <p class="letter-symbol">${alphabet[item].symbol}</p>
                <p class="letter-index">${alphabet[item].index}</p>
            `;
            slot.append(letter);
            availableLetters.append(slot);
        });
    } else {
        for (let i = 0; i < slots.length; i++) {
            if (!slots[i].hasChildNodes()) {
                const letter = document.createElement('div');
                letter.classList.add('letter');
                letter.setAttribute('draggable', 'true');
                letter.innerHTML = `
                    <p class="letter-symbol">${alphabet[arr[i]].symbol}</p>
                    <p class="letter-index">${alphabet[arr[i]].index}</p>
                `;
                slots[i].append(letter);
            }
        }
    }
};

const addingTilesIntoArr = (arr, isStart) => { // adds missing symbols
    if (isStart === true) {
        while (arr.length !== 8) {
            const symbol = randomProperty(alphabet).symbol;
            if (tilesBagChecker(symbol) === true) {
                arr.push(symbol);
            }
        }
        arr = shuffle(arr);
    } else {
        while (emptyChecker(arr, '') === false) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === '') {
                    const symbol = randomProperty(alphabet).symbol;
                    if (tilesBagChecker(symbol) === true) {
                        arr.splice(i, 1, symbol);
                    }
                }
            }
        }
    }
    appendingTiles(arr);
};

const startingTiles = () => { // creates letter in first move
    let firstLetters = [];

    for (let key in dictionary) {
        if (key.length <= 3) {
            firstLetters.push(key);
        }
    }

    let startingTilesArr = [...firstLetters[getRandomIntInclusive(0, firstLetters.length - 1)].toUpperCase()];

    startingTilesArr.forEach((item) => {
        tilesBagChecker(item);
    });

    console.log(startingTilesArr);

    addingTilesIntoArr(startingTilesArr, true);
};

const twoLinesCheck = () => { // checks how letter is written
    let arrX = [],
        arrY = [],
        x,
        y;

    const tilesInGame = document.querySelectorAll('.box .letter[draggable=true]');

    tilesInGame.forEach((tile) => {
        x = tile.parentNode.dataset.x;
        y = tile.parentNode.dataset.y;
        arrX.push(tile.parentNode.dataset.y);
        arrY.push(tile.parentNode.dataset.x);
    });

    const sameValues = (arr, coord) => {
        const check = arr.every((elem) => {
            return elem === coord;
        });
        return check;
    };

    let lineChecker = sameValues(arrX, y) + sameValues(arrY, x);

    return [lineChecker, sameValues(arrX, y), sameValues(arrY, x), arrX, arrY];
};

const solidWord = (arr) => { // checks if word has no spaces
    if (arr.join('').trim(' ').length >= 3) {
        arr = [...arr.join('').trim(' ')];
        return emptyChecker(arr, ' ');
    } else {
        return true;
    }
};

const biggestNumber = (arr) => {
    console.log(arr);
    let num = 1;
    arr.forEach((item) => {
        if (item > num) {
            num = item;
        }
    });
    return num;
};

const checkWord = (cell) => { // checks the word for definition and adds word indicator
    let x = cell.dataset.x,
        y = cell.dataset.y,
        definition,
        checker = 0,
        arrX = [],
        arrY = [],
        wordMultiplier,
        letterMultiplier;

    points = 0;

    let wordMultiplierArr = [];

    let tilesInGame = document.querySelectorAll('.box .letter[draggable=true]');

    if (tilesInGame.length <= 1) tilesInGame = '';

    const defOutput = () => {
        if (arrX.join('').trim(' ').length >= 2 && arrY.join('').trim(' ').length >= 2) {
            let firstWord,
            secondWord;
            for (let key in dictionary) {
                if (key === arrX.join('').trim(' ')) {
                    firstWord = key;
                }
                if (key === arrY.join('').trim(' ')) {
                    secondWord = key;
                }
            }
            console.log(firstWord);
            console.log(secondWord);
            if (secondWord && firstWord) {
                checker++;
                definition = key + '- ' + dictionary[key].definition;
                word = definition;
                wordIndicator.style.background = 'green';
            }
        } else {
            for (let key in dictionary) {
                if (key === arrX.join('').trim(' ') || key === arrY.join('').trim(' ')) {
                    checker++;
                    definition = key + '- ' + dictionary[key].definition;
                    word = definition;
                    wordIndicator.style.background = 'green';
                }
            }
        }
    };

    let twoLinesCheckArr = twoLinesCheck();
    console.log(twoLinesCheckArr);

    const addingWordIndicator = (word) => {
        console.log(biggestNumber(wordMultiplierArr));
        wordIndicator.innerHTML = `
        <p>${points * biggestNumber(wordMultiplierArr)}</p>
        `;
        word.append(wordIndicator);
    };

    if (tilesInGame.length === 0) {
        console.log('a');
        wordIndicator.remove();
    }

    const LetterMultiplier = (item) => {
        if (item.classList.contains('triple-letter')) {
            letterMultiplier = 3;
        } else if (item.classList.contains('double-letter')) {
            letterMultiplier = 2;
        } else letterMultiplier = 1;
        return letterMultiplier;
    };

    const WordMultiplier = (item) => {
        if (item.classList.contains('triple-word')) {
            wordMultiplier = 3;
        } else if (item.classList.contains('double-word')) {
            wordMultiplier = 2;
        } else wordMultiplier = 1;
        return wordMultiplier;
    };

    const nameFunc = (item, index, letter) => {
        wordMultiplierArr.push(WordMultiplier(item));
        points += parseInt(index) * LetterMultiplier(item);
        addingWordIndicator(letter); // appending word indicator    
    };

    const slotsLetterRemoverFunc = (index, item) => {
        // points -= parseInt(index) * LetterMultiplier(item);
        wordIndicator.remove();
    };

    if (twoLinesCheckArr[0] !== 0 && center.hasChildNodes()) { // word is written in one line
        wordIndicator.style.background = '';

        if (cell.classList.contains('box-cell')) { // letter was put in box cell
            boxCells.forEach((item) => {
                let itemSymbol,
                    itemLetter,
                    itemIndex;

                if (item.hasChildNodes()) { // cell has letter
                    itemLetter = item.childNodes[0],
                        itemSymbol = item.childNodes[0].childNodes[1].textContent.toLowerCase(),
                        itemIndex = item.childNodes[0].childNodes[3].textContent;
                } else {
                    itemSymbol = ' ';
                }

                if (item.dataset.y === y && item.dataset.x === x) { // letter is in center
                    arrX.push(itemSymbol);
                    arrY.push(itemSymbol);
                    if (solidWord(arrX) || solidWord(arrY)) {
                        if (item.hasChildNodes()) {
                            nameFunc(item, itemIndex, itemLetter);
                        }
                    } else {
                        wordIndicator.remove();
                    }

                } else if (item.dataset.y === y) { // horizontal word
                    arrX.push(itemSymbol);
                    if (solidWord(arrX)) { // word without spaces
                        if (item.hasChildNodes()) {
                            nameFunc(item, itemIndex, itemLetter);
                        }
                    } else {
                        wordIndicator.remove();
                    }
                } else if (item.dataset.x === x) { // vertical word
                    arrY.push(itemSymbol);
                    if (solidWord(arrY)) { // word without spaces
                        if (item.hasChildNodes()) {
                            nameFunc(item, itemIndex, itemLetter);
                        }
                    } else {
                        wordIndicator.remove();
                    }
                }
            });

        } else { // letter was in put in player's slot
        let horizontalWord = twoLinesCheckArr[3];
        let verticalWord = twoLinesCheckArr[4];
            boxCells.forEach((item) => {
                let itemSymbol,
                    itemLetter,
                    itemIndex;

                if (item.hasChildNodes()) { // cell has letter
                    itemLetter = item.childNodes[0],
                        itemSymbol = item.childNodes[0].childNodes[1].textContent.toLowerCase(),
                        itemIndex = item.childNodes[0].childNodes[3].textContent;
                } else {
                    itemSymbol = ' ';
                }

                if (twoLinesCheckArr[1] === true && twoLinesCheckArr[2] === true) {
                    console.log(horizontalWord[0], verticalWord[0]);
                    if (item.dataset.y === horizontalWord[0]) {
                        arrX.push(itemSymbol);              
                    }
                    if (item.dataset.x === verticalWord[0]) {
                        arrY.push(itemSymbol);  
                    }

                    if (item.dataset.y === horizontalWord[0] || item.dataset.x === verticalWord[0]) {
                        if (arrX.join('').trim(' ') && arrY.join('').trim(' ')) {
                            if (solidWord(arrX) && solidWord(arrY)) { // word without spaces
                                if (item.hasChildNodes()) {
                                    nameFunc(item, itemIndex, itemLetter);
                                }
                            } else {
                                wordIndicator.remove();
                            } 
                        }      
                    }                
                }  else if (twoLinesCheckArr[1] === true) { // horizontal word
                    if (item.dataset.y === horizontalWord[0]) {
                        arrX.push(itemSymbol);
                        if (solidWord(arrX)) { // word without spaces
                            if (item.hasChildNodes()) {
                                nameFunc(item, itemIndex, itemLetter);
                            }
                        } else {
                            slotsLetterRemoverFunc(itemIndex, item);
                        }
                    }
                } else if (twoLinesCheckArr[2] === true) { // vertical word
                    if (item.dataset.x === verticalWord[0]) {
                        arrY.push(itemSymbol);
                        if (solidWord(arrY)) { // word without spaces
                            if (item.hasChildNodes()) {
                                nameFunc(item, itemIndex, itemLetter);
                            }
                        } else {
                            slotsLetterRemoverFunc(itemIndex, item);
                        }
                    }
                }
            });
        };
        console.log(points);
        defOutput(); // alerting definition
    } else { // two-line word
        wordIndicator.remove();
    }
    wordX = arrX.join('').trim(' ');
    wordY = arrY.join('').trim(' ');

    console.log(arrX);
    console.log(arrY);
    console.log(biggestNumber(wordMultiplierArr));
};

const submitingWord = () => { // checks if the word exists
    console.log(word);
    if (!word) {
        return false;
    } else {
        return true;
    }
};

startingTiles();

// dragDrop

const dragStart = function (letter) {
    setTimeout(() => {
        letter.classList.add('hide');
    }, 0);
};

const dragEnd = function (letter) {
    setTimeout(() => {
        letter.classList.remove('hide');
    }, 0);
};

const dragOver = function (cell, evt) {
    evt.preventDefault();
};

const dragEnter = function (cell, evt) {
    if (cell.hasChildNodes()) return;
    evt.preventDefault();
    cell.classList.add('hovered');
};

const dragLeave = function (cell) {
    cell.classList.remove('hovered');
};

const dragDrop = function (cell, letter) {
    if (!cell.hasChildNodes()) {
        cell.append(letter);
        checkWord(cell);
    } else {
        return;
    }
    cell.classList.remove('hovered');
    letterUsed = '';
};

let letters = document.querySelectorAll('.letter[draggable=true]'),
    slots = document.querySelectorAll('.slot');

submitButton.addEventListener('click', () => {
    let slots = document.querySelectorAll('.slot'),
        lettersArr = [];

    slots.forEach((slot) => {
        if (slot.hasChildNodes()) {
            lettersArr.push(slot.childNodes[0].childNodes[1].textContent);
        } else {
            lettersArr.push('');
        }
    });
    submitingWord();
    if (submitingWord()) {
        historyList.insertAdjacentHTML('beforeend', `<p>${word}<p>`);
        let tilesInGame = document.querySelectorAll('.box .letter');
        tilesInGame.forEach((tile) => {
            tile.removeAttribute('draggable');
            tile.classList.add('anti-scroll');
        });
        wordIndicator.remove();
        addingTilesIntoArr(lettersArr);
        word = '';
    } else if (!submitingWord() && wordX === '' && wordY === '') {
        return;
    } else {
        wrongWordModalText.innerHTML = `
        ты тут блять не выдумай слова... нет таких слов "${wordX}" и "${wordY}". Пиши нормальные бл слова
        `;
        wrongWordModal.classList.remove('hide');
    }
});

let letterUsed;

(() => setInterval(() => {
    letters = document.querySelectorAll('.letter[draggable=true]'),
        slots = document.querySelectorAll('.slot');

    letters.forEach(letter => {
        letter.addEventListener('dragstart', () => {
            if (!letter.hasAttribute('draggable')) return;
            letterUsed = letter;
            dragStart(letter);
        });
        letter.addEventListener('dragend', () => {
            dragEnd(letter);
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', () => {
            dragOver(slot, event);
        });
        slot.addEventListener('dragenter', () => {
            dragEnter(slot, event);
        });
        slot.addEventListener('dragleave', () => {
            dragLeave(slot);
        });
        slot.addEventListener('drop', () => {
            dragDrop(slot, letterUsed);
        });
    });
}, 0))();

boxCells.forEach(cell => {
    cell.addEventListener('dragover', () => {
        if (!letterUsed) return;
        dragOver(cell, event);
    });
    cell.addEventListener('dragenter', () => {
        if (!letterUsed) return;
        dragEnter(cell, event);
    });
    cell.addEventListener('dragleave', () => {
        if (!letterUsed) return;
        dragLeave(cell);
    });
    cell.addEventListener('drop', () => {
        if (!letterUsed) return;
        dragDrop(cell, letterUsed);
    });
});

bagTitle.addEventListener('click', () => {
    bagModal.classList.remove('hide');
});

// bagClose.addEventListener('click', () => {
//     bagModal.classList.add('hide');
// });

wrongWordModal.addEventListener('click', () => {
    wrongWordModal.classList.add('hide');
});

historyTitle.addEventListener('click', () => {
    historyList.classList.remove('hide');
});