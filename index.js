class Ship {
    constructor(size, vertical = false) {
        this.size = size;
        this.vertical = vertical;
        this.points = null;
        this.damage = 0;
        this.isSunk = false;
    }

    recieveAttack(point) {
        point.isAttacked = true;
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

module.exports = { Ship, Point };
