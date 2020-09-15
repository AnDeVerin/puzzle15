/* Ссылки на элементы */
const boxElem = document.querySelector('.box');
const resetButtonElem = document.querySelector('.button_type_reset');
const startButtonElem = document.querySelector('.button_type_start');

/* Массив ячеек для проверки логики игры */
let cells = [];

/* Инициализация игры */
for (let i = 1; i < 16; i += 1) {
    cells.push(i);
}
cells.push(0);

renderCells();


/**
 * Назначение слушателей (обработчиков)
 */
resetButtonElem.addEventListener('click', function() {
    stopGame();
    resetCells();
});


startButtonElem.addEventListener('click', function() {
    activateCells();
    boxElem.addEventListener('click', cellClickHandler);
});


/**
 * Обрабатывает клик по игровому полю
 *
 * @param {Object} e объект события click
 */
function cellClickHandler(e) {
    const cellElem = e.target.closest('.cell');
    if (!cellElem || cellElem.id === '0') {
        return;
    }

    runGameCycle(cellElem);
}


/**
 * Запускает игровой цикл
 * @param {HTMLElement} targetCell ячейка, по которой кликнули
 */
function runGameCycle(targetCell) {
    const num = +targetCell.id; // преобразуем String --> Number
    if (!canCellMove(num)) {
        return;
    }

    // ячейка может двигаться
    // меняем местами 0 и ячейку: обновляем массив и страницу
    const numIdx = cells.indexOf(num);
    const zeroIdx = cells.indexOf(0);
    cells[numIdx] = 0;
    cells[zeroIdx] = num;

    const zeroCell = document.querySelector('[id="0"]');
    updateCell(targetCell, 0);
    updateCell(zeroCell, num);

    // закончилась ли игра?
    if (isGameOver()) {
        stopGame();
        setTimeout(() => alert('You win! Game over!'), 0);
    }
}


/**
 * Проверяет закончена ли игра
 * @return {Boolean}
 */
function isGameOver() {
    return cells.slice(0, 15).every((v, i) => v === i + 1);
}


/**
 * Проверяет может ли ячейка двигаться
 *
 * Сells [0...15] - массив ячеек
 * Проверяем ячейки сверху, снизу, слева, справа:
 * если находим 0 --> ячейка может двигаться.
 *
 * @param {Number} n номер ячейки
 * @return {Boolean}
 */
function canCellMove(n) {
    const idx = cells.indexOf(n);

    // ячейка сверху
    if (cells[idx - 4] === 0) {
        return true;
    }

    // ячейка снизу
    if (cells[idx + 4] === 0) {
        return true;
    }

    // ячейка слева
    if (idx % 4 !== 0 && cells[idx - 1] === 0) {
        return true;
    }

    // ячейка справа
    if ((idx + 1) % 4 !== 0 && cells[idx + 1] === 0) {
        return true;
    }

    return false;
}


/**
 * Останавливает игру
 */
function stopGame() {
    const cellElems = document.querySelectorAll('.cell');
    cellElems.forEach((el) => el.classList.remove('cell_active'));

    boxElem.removeEventListener('click', cellClickHandler);
}


/**
 * Перемешивает ячейки: перемешивает массив и обновляет значения в ячейках
 */
function resetCells() {
    cells = _.shuffle(cells);

    const cellElems = document.querySelectorAll('.cell');
    cells.forEach((n, i) => updateCell(cellElems[i], n));
}


/**
 * Активирует ячейки
 */
function activateCells() {
    const cellElems = document.querySelectorAll('.cell');
    cellElems.forEach((el) => el.classList.add('cell_active'));
}


/**
 * Рендерит ячейки
 */
function renderCells() {
    const cellTemplate = document.querySelector('[data-component="cell"]');

    cells.forEach((n) => {
        const cellFragment = cellTemplate.content.cloneNode(true);
        const cellElem = cellFragment.querySelector('.cell');

        updateCell(cellElem, n);
        boxElem.appendChild(cellElem);
    });
}


/**
 * Обновляет ячейку
 * @param {Object} cellElem - элемент ячейки
 * @param {Number} number - число для записи в ячейку
 */
function updateCell(cellElem, number) {
    const cellNumElem = cellElem.querySelector('.cell__num');
    cellElem.id = number;
    cellNumElem.textContent = number;
}
