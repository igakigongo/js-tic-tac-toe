/* global events */
/* eslint func-names: ["error", "never"] */

(function () {
  const tickerRef = this;
  const tickerShell = document.getElementById('ticker-shell');

  tickerRef.addEventListener(events.CURRENT_PLAYER_CHANGED, (evt) => {
    const { name } = evt.detail.player;
    tickerShell.innerText = `Next Player: ${name}`;
  });

  tickerRef.addEventListener(events.GAME_DRAWN, () => {
    tickerShell.innerText = 'The game has ended in a draw, we have no winner';
  });

  tickerRef.addEventListener(events.GAME_WON, (evt) => {
    const { name } = evt.detail.winner;
    tickerShell.innerText = `Congratulations ${name}, you have won this game.`;
  });

  tickerRef.addEventListener(events.NEW_GAME_INITIATED, () => {
    tickerShell.innerText = '';
  });
}());
