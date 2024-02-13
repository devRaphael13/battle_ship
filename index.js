class Ship {
    constructor(size, vertical = false) {
        this.size = size;
        this.vertical = vertical;
        this.points = null;
        this.damage = 0;
        this.isSunk = false;
    }

    recieveAttack() {
        this.damage += 1;
        return this;
    }

    status() {
        if (this.damage >= this.size) {
            this.isSunk = true;
            return true;
        }
        this.isSunk = false;
        return false;
    }
}

class Point {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.isOccupied = false;
        this.isAttacked = false;
    }
}

class GameBoard {
    constructor(size = 10) {
        this.board = [];
        this.ships = [];
        this.size = size;
    }

    getBoard() {
        return this.board;
    }

    getPoint(col, row) {
        if (col >= 10 || row >= 10) return null;
        return this.board[row][col];
    }

    fill(pointClass) {
        for (let i = 0; i < this.size; i++) {
            let row = [];
            for (let j = 0; j < this.size; j++) {
                row.push(new pointClass(j, i));
            }
            this.board.push(row);
        }
        return this;
    }

    findSpace(col = 0, row = 0) {
        if (row >= this.size - 1 || col >= this.size - 1) {
            col = 0;
            row = 0;
        }

        for (let i = row; i < this.size; i++) {
            for (let j = col; j < this.size; j++) {
                let point = this.getPoint(j, i);
                if (point && !point.isAttacked && !point.isOccupied) {
                    return point;
                }
            }
        }

        return null;
    }

    canContain(space, size, isVertical) {
        let spaceArray = [];
        for (let i = 0; i < size; i++) {
            if (isVertical) {
                console.log(space.col, space.row);
                spaceArray.push(this.getPoint(space.col, space.row + i));
            } else {
                console.log(space.col, space.row);
                spaceArray.push(this.getPoint(space.col + i, space.row));
            }
        }

        if (spaceArray.every((point) => point && point.isOccupied === false)) return spaceArray;
        return false;
    }

    place(ship) {
        let canContain = null;

        while (true) {
            const space = this.findSpace(parseInt((Math.random() * 10000) % 10), parseInt((Math.random() * 10000) % 10));
            canContain = this.canContain(space, ship.size, ship.vertical);
            if (canContain) break;
        }

        if (canContain) {
            this.assignSpace(ship, canContain);
            this.ships.push(ship);
        }
        return canContain;
    }

    assignSpace(ship, spaceArray) {
        spaceArray.forEach((point) => (point.isOccupied = true));
        ship.points = spaceArray;
    }

    recieveAttack(point) {
        if (!point.isAttacked) {
            point.isAttacked = true;

            if (point.isOccupied) {
                let [ship] = this.ships.filter((s) => s.points.include(point));
                ship.recieveAttack();
            }
            return true;
        }
        return false;
    }

    isClear() {
        return this.ships.every((ship) => ship.isSunk);
    }

    reset() {
        this.board = [];
        this.ships = [];
        return this.fill(Point);
    }
}

class Controller {
    constructor(board) {
        this.isTurn = false;
        this.board = board;
    }

    play(point) {
        this.isTurn = true;
        this.board.recieveAttack(point);
        this.isTurn = point.isOccupied ? true : false;
    }

    randomPlay() {
        let col = parseInt(Math.random() * 10),
            row = parseInt(Math.random() * 10);
        this.play(this.board.getPoint(col, row));
    }

    randomShips(shipClass) {
        const sizes = [1, 1, 1, 2, 3, 4, 5],
            isVertical = [true, false];

        const ships = [];

        while (sizes.length) {
            const size = sizes.splice(parseInt(Math.random() * sizes.length), 1);
            const orientation = isVertical[parseInt(Math.random() * isVertical.length)];

            ships.push(new shipClass(size, orientation));
        }

        return ships;
    }
}

class Dom {
    constructor(id, board, controller) {
        this.boardElem = document.getElementById(id);
        this.board = board
        this.controller = controller;
        this.pointElems = [];
    }

    createBoard() {
        let board = ``;
        for (let i = 0; i < this.board.size; i++) {
            let row = [];
            for (let j = 0; j < this.board.size; j++) {
                row.push(`<div class="point" data-col=${j} data-row=${i}></div>`);
            }

            board = board.concat(`<div class="row">${row.join(" ")}</div>`);
        }
        this.boardElem.innerHTML = board;
        return this;
    }

    placeShips(ships = null) {
        ships = ships ? ships : this.controller.randomShips(Ship);
        ships.map((ship) => this.board.place(ship));

        for (let ship of ships) {
            for (let point of ship.points) {
                const [col, row] = [point.col, point.row];
                this.pointElems.push(this.boardElem.children[row].children[col]);
            }
        }
        return this;
    }

    showPoints() {
        this.pointElems.forEach((elem) => {
            elem.classList.add("occupied");
        });
        return this;
    }
}

let myBoard = new GameBoard(10).fill(Point);
let oppBoard = new GameBoard(10).fill(Point);

let myController = new Controller(oppBoard);
let oppController = new Controller(myBoard);

let oppDom = new Dom("opp_board", oppBoard, oppController).createBoard();
let myDom = new Dom("my_board", myBoard, myController).createBoard();

const randomBtn = document.getElementById("r_btn");

myDom.placeShips().showPoints();
randomBtn.addEventListener("click", (e) => {
    myBoard = new GameBoard(10).fill(Point);
    myDom = new Dom("my_board", myBoard, myController).createBoard()
    myDom.placeShips().showPoints();
});
oppDom.placeShips();

module.exports = { Ship, Point, GameBoard };
