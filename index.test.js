const {Ship, Point} = require("./index.js")

test("Ship registers hits", () => {
    const ship = new Ship(1, true)
    const point = new Point(0, 0)

    ship.recieveAttack(point)
    expect(ship.damage).toBe(1)
})

test("Ship sinks", () => {
    const ship = new Ship(1)
    const point = new Point(0, 0)

    ship.recieveAttack(point)
    expect(ship.status()).toBeTruthy()
})