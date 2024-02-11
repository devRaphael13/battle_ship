class Ship {
    constructor(size, vertical = false) {
        this.size = size;
        this.vertical = vertical;
        this.points = null;
        this.hits = 0;
        this.isSunk = false;
    }

    hits(point) {
        point.isAttacked = true
        this.hits += 1;
        return this;
    }

    isSunk() {
        if (this.hits >= this.size) {
            this.isSunk = true;
            return true;
        } else {
            this.isSunk = false;
            return false;
        }
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

module.exports = {Ship, Point}
