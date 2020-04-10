const gameTables = []

const GameRepository = {
    getGameTables: () => {
        return gameTables;
    },
    getGameTablesById: (id) => {
        return gameTables[id];
    },
    creatingTable: (newTable) => {
        gameTables.push(newTable);
    },
    getLength: () => {
        return gameTables.length;
    }

}

Object.freeze(GameRepository);


module.exports = GameRepository;