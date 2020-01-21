/**
 * Factory for creating players to use in the game
 * @param {String} name 
 * @param {String} symbol 
 */
const createPlayer = function(name, symbol){
  if (!name) throw 'Invalid player name';
  if (!symbol) throw 'Invalid player symbol';

  return {
    name,
    symbol
  };
};