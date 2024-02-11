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
                let point = this.board[i][j];
                if (!point.isAttacked && !point.isOccupied) return point;
            }
        }

        return null
    }

    canContain(space, size, isVertical) {
        let spaceArray = [];
        for (let i = 0; i < size; i++) {
            if (isVertical) {
                console.log(space.row, space.col)
                spaceArray.push(this.board[space.row + i][space.col]);
            } else {
                spaceArray.push(this.board[space.row][space.col + i]);
            }
        }

        if (spaceArray.every((point) => point && point.isOccupied === false)) return spaceArray;
        return false;
    }

    place(ship) {
        let col = 0;
        let row = 0;
        let canContain = null;

        if (this.ships.length > 0) {
            const [lastShip] = this.ships.slice(-1);
            const point = lastShip.vertical ? lastShip.points[0] : lastShip.points.slice(-1)[0];
            col = point.col + parseInt(Math.random() * 5);
            row = point.row + parseInt(Math.random() * 5);
        }

        let space = this.findSpace(col, row);

        while (space) {
            canContain = this.canContain(space, ship.size, ship.vertical);
            if (canContain) break;
            space = this.findSpace(space.col + 1, space.row);
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

    recieveAttack(col, row) {
        const point = this.board[row][col]
        point.isAttacked = true

        if (point.isOccupied) {
            let [ship] = this.ships.filter((s) => s.points.include(point))
            ship.recieveAttack()
        }
    }

    isClear() {
        return this.ships.every((ship) => ship.isSunk)
    }
}

module.exports = { Ship, Point, GameBoard };
