const {Ship, Point} = require("./index.js")

test("Ship registers hits", () => {
    const ship = new Ship(1, true)

    ship.recieveAttack()
    expect(ship.damage).toBe(1)
})

test("Ship sinks", () => {
    const ship = new Ship(1)

    ship.recieveAttack()
    expect(ship.status()).toBeTruthy()
})
