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

    updateStatus() {
        this.isSunk = this.damage >= this.size ? true : false;
        return this.isSunk;
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
                spaceArray.push(this.getPoint(space.col, space.row + i));
            } else {
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
                let [ship] = this.ships.filter((s) => s.points.includes(point));
                ship.recieveAttack();
                ship.updateStatus();
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
        this.lost = false;
    }

    getTurn() {
        return this.isTurn;
    }

    nextTurn() {
        this.isTurn = true;
        return this;
    }

    play(point) {
        this.board.recieveAttack(point);
        this.isTurn = point.isOccupied ? true : false;
        this.lost = this.board.isClear();
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
    constructor(id, controller, oppController) {
        this.id = id;
        this.boardElem = document.getElementById(id);
        this.board = controller.board;
        this.oppController = oppController;
        this.controller = controller;
        this.occupiedElems = [];
        this.winner = document.getElementById("winner");
        this.pointElems = [];
        this.event = new Event("click");
    }

    createBoard() {
        let board = ``;
        for (let i = 0; i < this.board.size; i++) {
            let row = [];
            for (let j = 0; j < this.board.size; j++) {
                row.push(`<div class="point" data-col=${j} data-row=${i}>&nbsp;</div>`);
            }

            this.pointElems.push(...row);
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
                this.occupiedElems.push(this.boardElem.children[row].children[col]);
            }
        }
        return this;
    }

    showPoints() {
        this.occupiedElems.forEach((elem) => {
            elem.classList.add("occupied");
        });
        return this;
    }

    pointSetup() {
        for (let row of this.boardElem.children) {
            for (let point of row.children) {
                point.addEventListener("click", (e) => {
                    if (this.controller.getTurn()) {
                        let [col, row] = [e.target.dataset.col, e.target.dataset.row];
                        this.play(col, row);
                    }
                });
            }
        }

        return this;
    }

    play(col, row) {
        let point = this.board.getPoint(col, row);
        let pointElem = this.boardElem.children[row].children[col];

        if (!this.controller.lost) {
            this.controller.play(point);
            if (point.isOccupied) {
                pointElem.style.backgroundColor = "yellow";
            } else {
                pointElem.innerHTML = `
                <svg class="fail" width="46" height="46" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"></path>
                </svg>
                `;
                this.oppController.nextTurn();
            }
        } else {
            const mess = this.id === "opp_board" ? "You Win!" : "You Lost!";
            this.winner.innerHTML = mess;
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }

    randomPlay() {
        if (this.controller.getTurn()) {
            const index = Math.floor(Math.random() * this.pointElems.length - 1);
            const [col, row] = this.pointElems.splice(index, 1)[0].match(/\d/g);
            const point = this.boardElem.children[parseInt(row)].children[parseInt(col)];
            point.dispatchEvent(this.event);
        }
    }
}

function main() {
    let myBoard = new GameBoard(10).fill(Point);
    let oppBoard = new GameBoard(10).fill(Point);

    let myController = new Controller(myBoard);
    let oppController = new Controller(oppBoard).nextTurn();

    let oppDom = new Dom("opp_board", oppController, myController).createBoard().placeShips();
    let myDom = new Dom("my_board", myController, oppController).createBoard().placeShips().showPoints();

    const randomBtn = document.getElementById("r_btn");
    const start = document.getElementById("start");

    start.addEventListener("click", (e) => {
        oppDom.pointSetup();
        myDom.pointSetup();
        randomBtn.disabled = true;
        e.target.disabled = true;
    });

    setInterval(() => {
        myDom.randomPlay();
    }, 1000);

    randomBtn.addEventListener("click", (e) => {
        location.reload();
    });
}

main();