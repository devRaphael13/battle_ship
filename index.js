//col, row
// [0, 0]
class Ship {
    constructor(size, vertical = false) {
        this.size = size;
        this.vertical = vertical;
        this.ship = [...Array(this.size).fill([null, null])]
        this.hits = 0;
        this.isSunk = false;
    }

    hits() {
        this.hits += 1
        return this.hits
    }

    isSunk() {
        if (this.hits >= this.size) {
            this.isSunk = true
            return true
        }
        else {
            this.isSunk = false
            return false
        }
    }
}

module.exports = {Ship}

