/**
 * ------------------------------
 * Глобальные переменные
 * ------------------------------
 */

const boxElem = document.querySelector('.box');
const resetButtonElem = document.querySelector('.button_type_reset');
const startButtonElem = document.querySelector('.button_type_start');

let cells = [];

/**
 * ------------------------------
 * ОСНОВНОЙ КОД
 * ------------------------------
 */

/* Инициализация игры */

for (let i = 1; i < 16; i++) {
    cells.push(i);
}
cells.push(0);

renderCells();
// resetCells();

/* Обработчики */

resetButtonElem.addEventListener('click', function() {
    stopGame();
    resetCells();
});

startButtonElem.addEventListener('click', function() {
    activateCells();
    // startTimer();
    boxElem.addEventListener('click', cellClickHandler);
});

/**
 * ------------------------------
 * ОБЪЯВЛЕНИЕ ФУНКЦИЙ
 * ------------------------------
 */

/* Обработка кликов по ячейкам - основной цикл игры */
function cellClickHandler(e) {
    const targetCell = e.target.closest('.cell');

    if (!targetCell || targetCell.id === '0') {
        return;
    }

    const num = +targetCell.id; // преобразуем String --> Number
    const canCellMove = checkCell(num);
    // console.log('Cell can move:', canCellMove);

    if (!canCellMove) {
        return;
    }

    // ячейка может двигаться: обновляем массив и страницу
    const numIdx = cells.indexOf(num);
    const zeroIdx = cells.indexOf(0);
    cells[numIdx] = 0;
    cells[zeroIdx] = num;

    const zeroCell = document.querySelector('[id="0"]');

    cellRepaint(targetCell, 0);
    cellRepaint(zeroCell, num);
    // console.log(cells);

    const isGameOver = checkGame();

    if (!isGameOver) {
        return;
    }

    stopGame();
    setTimeout(() => {
        alert('You win! Game over!');
    });
}

/* Проверка закончилась ли игра */
function checkGame() {
    return cells.slice(0, 15).every(function(value, index) {
        return value === index + 1;
    });
}

/*
 * Проверка ячейки в массиве: может ли она двигаться?
 * Сells: границы массива 0 и 15
 * проверяем ячейки сверху, снизу, слева, справа
 *  - проверить не выходим ли мы за диапазон массива (будет ошибка)
 *  - если находим 0 --> ячейка может двигаться
 */
function checkCell(n) {
    const idx = cells.indexOf(n);

    // ячейка сверху
    const upIdx = idx - 4;

    if ( (upIdx >= 0) && (cells[upIdx] === 0) ) {
        return true;
    }

    // ячейка снизу
    const downIdx = idx + 4;
    if ( (downIdx < 16) && (cells[downIdx] === 0) ) {
        return true;
    }

    // ячейка слева
    const leftIdx = idx - 1;
    if ( (leftIdx >= 0) && (idx % 4 !== 0) && (cells[leftIdx] === 0) ) {
        return true;
    }

    // ячейка справа
    const rightIdx = idx + 1;
    if ( (rightIdx < 16) && (rightIdx % 4 !== 0) && (cells[rightIdx] === 0) ) {
        return true;
    }

    return false;
}

/* Остановка игры */
function stopGame() {
    boxElem.removeEventListener('click', cellClickHandler);
    deactivateCells();
}

/* Активация ячеек */
function activateCells() {
    const cellElems = document.querySelectorAll('.cell');
    cellElems.forEach(function(el) {
        el.classList.add('cell_active');
    });
}

/* деактивация ячеек */
function deactivateCells() {
    const cellElems = document.querySelectorAll('.cell');
    cellElems.forEach(function(el) {
        el.classList.remove('cell_active');
    });
}

/* Рендеринг ячеек на страницу */
function renderCells() {
    const cellTemplate = document.querySelector('[data-component="cell"]');

    cells.forEach(function(n) {
        const cellFragment = cellTemplate.content.cloneNode(true);
        const cellElem = cellFragment.querySelector('.cell');

        // const cellNumElem = cellFragment.querySelector('.cell__num');
        // cellElem.id = n;
        // cellNumElem.textContent = n;
        cellRepaint(cellElem, n);

        boxElem.appendChild(cellElem);
    });
}

/* Сброс массива и перерисовка значений в ячейках */
function resetCells() {
    cells = _.shuffle(cells);

    const cellElems = document.querySelectorAll('.cell');
    cells.forEach(function(n, i) {
        cellRepaint(cellElems[i], n);
    });
}

/* перерисовка содержимого ячейки */
function cellRepaint(sellElem, n) {
    const sellNumElem = sellElem.querySelector('.cell__num');
    sellElem.id = n;
    sellNumElem.textContent = n;
}
