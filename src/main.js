import {dictionary} from './dictionary.js';
import {alphabet} from './letters.js';

const box = document.querySelector('.box'),
tripleWord = [0, 7, 14, 105, 119, 210, 224],
doubleLetter = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221],
doubleWord = [16, 28, 32, 42, 48, 56, 64, 70, 154, 160, 168, 176, 182, 192, 196, 208],
tripleLetter = [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204];

for (let i = 0; i < 225; i++) {
    const boxCell = document.createElement('div');
    boxCell.classList.add('box-cell');
    boxCell.dataset.pos = i + 1;
    if (i === 112) {
        boxCell.innerHTML = 'ЦТР';
    }
    box.append(boxCell);
}

const boxCells = document.querySelectorAll('.box-cell');

tripleWord.forEach((key) => {
    boxCells[key].innerHTML = 'ТС';
    boxCells[key].style.background = 'red';
});
doubleLetter.forEach((key) => {
    boxCells[key].innerHTML = 'ДБ';
    boxCells[key].style.background = '#00FFFF';
});
doubleWord.forEach((key) => {
    boxCells[key].innerHTML = 'ДС';
    boxCells[key].style.background = '#D2691E';
});
tripleLetter.forEach((key) => {
    boxCells[key].innerHTML = 'ТБ';
    boxCells[key].style.background = '#0000FF';
});

// let letter = document.createElement('div');
// letter.classList.add('letter');
// letter.setAttribute("draggable", "true");
// letter.innerHTML = `
//     <img src="./img/letter_bg.png">
//     <p class="letter-symbol">${alphabet['Р'].symbol}</p>
//     <p class="letter-index">${alphabet['Р'].index}</p>
// `;


const availableLetters = document.querySelector('.available-letters');

for (let i = 0; i < 7; i++) {
    const letter = document.createElement('div');
    letter.classList.add('letter');
    letter.setAttribute('draggable',"true");
    letter.innerHTML = `
        <img src="./img/letter_bg.png">
        <p class="letter-symbol">${alphabet['Р'].symbol}</p>
        <p class="letter-index">${alphabet['Р'].index} ${i}</p>
`;
availableLetters.append(letter);
}

// dragDrop

const letters = document.querySelectorAll('.letter');

// const dragDrop = () => {

//     const dragStart = function () {
//         setTimeout(() => {
//             this.classList.add('hide');
//         }, 0);
//     };
    
//     const dragEnd = function () {
//         this.classList.add('hide');
//     };

//     const dragOver = function (evt) {
//         evt.preventDefault();
//     };

//     const dragEnter = function (evt) {
//         evt.preventDefault();
//         this.classList.add('hovered');
//     };

//     const dragLeave = function () {
//         this.classList.remove('hovered');
//     };

//     const dragDrop = function () {
//         console.log(this);
//         this.append(letter);
//         console.log(letter);
//         this.classList.remove('hovered');
//     };

//     boxCells.forEach(cell => {
//         cell.addEventListener('dragover', dragOver);
//         cell.addEventListener('dragenter', dragEnter);
//         cell.addEventListener('dragleave', dragLeave);
//         cell.addEventListener('drop', dragDrop);
//     });

//     letters.forEach(letter => {
//         letter.addEventListener('dragstart', dragStart);
//         letter.addEventListener('dragend', dragEnd);
//     });
// }

const dragStart = function (letter) {
    setTimeout(() => {
        letter.classList.add('hide');
    }, 0);
};

const dragEnd = function (letter) {
   letter.classList.remove('hide');
};

const dragOver = function (cell, evt) {
    evt.preventDefault();
};

const dragEnter = function (cell, evt) {
    evt.preventDefault();
    cell.classList.add('hovered');
};

const dragLeave = function (cell) {
    cell.classList.remove('hovered');
};

const dragDrop = function (cell, letter) {
    cell.append(letter);
    console.log(letter);
    cell.classList.remove('hovered');
};

let letterUsed;

letters.forEach(letter => {
    
    letter.addEventListener('dragstart', () => {
        letterUsed = letter;
        dragStart(letter);
    });
    letter.addEventListener('dragend', () => {
        dragEnd(letter);
    });
});

boxCells.forEach(cell => {
    cell.addEventListener('dragover', () => {
        dragOver(cell, event);
    });
    cell.addEventListener('dragenter',() => {
        dragEnter(cell, event);
    });
    cell.addEventListener('dragleave', () => {
        dragLeave(cell);
    });
    cell.addEventListener('drop', () => {
        dragDrop(cell, letterUsed);
    });     
});

// letters.forEach(letter => {
//     letter.addEventListener('dragstart', dragStart);
//     letter.addEventListener('dragend', dragEnd);
// });

// letters.forEach((letter) => {
//     letter.addEventListener('dragstart', () => {
//         dragDrop();
//     });
//     // letter.addEventListener('dragend', dragDrop);
// });

// dragDrop(letter);

// boxCells.forEach(cell => {
//     cell.addEventListener('click', () => {
//         if (cell.hasChildNodes()) {
//             cell.children[0].addEventListener('click', LetterDragAndDrop(cell.children[0]));
//             console.log(cell.children[0]);
//         }
//     });
// });



