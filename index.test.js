const {Ship} = require("./index.js")

test("Create empty ship", () => {
    expect(new Ship(4).ship).toEqual([
        [null, null],
        [null, null],
        [null, null],
        [null, null],
    ]);
})
