/* global events */
/* eslint func-names: ["error", "never"] */

(function () {
  const controlsFormRef = this;

  const controlsShell = document.getElementById('controls-shell');
  const [btnNewGame, btnRestartGame, btnSavePlayers] = ['#btn-new-game', '#btn-restart-game', '#btn-save-players'].map((id) => controlsShell.querySelector(id));

  function getNames(formElement) {
    return ['#player_one', '#player_two'].map((id) => formElement.querySelector(id).value);
  }

  function validateForm(names) {
    return Boolean(
      names.reduce((acc, playerName, index) => {
        const labelId = index === 0 ? '#player_one_error_label' : '#player_two_error_label';
        const errorLabel = controlsShell.querySelector(labelId);

        const state = playerName !== null && playerName.trim() !== '';

        errorLabel.style.display = state ? 'none' : 'block';
        errorLabel.innerText = state ? '' : 'Invalid name value';
        /* eslint-disable-next-line no-bitwise */
        acc &= state;

        return acc;
      }, true),
    );
  }

  btnNewGame.addEventListener('click', () => {
    btnSavePlayers.disabled = false;
    const event = new Event(events.NEW_GAME_INITIATED);
    controlsFormRef.dispatchEvent(event);
  });

  btnRestartGame.addEventListener('click', () => {
    const event = new Event(events.RESTART_CURRENT_GAME);
    controlsFormRef.dispatchEvent(event);
  });

  btnSavePlayers.addEventListener('click', (evt) => {
    const names = getNames(controlsShell);
    const isValidForm = validateForm(names);

    if (!isValidForm) return;
    evt.target.disabled = true;

    ['#player_one', '#player_two'].forEach((id) => {
      controlsShell.querySelector(id).value = '';
    });
    const event = new CustomEvent(events.PLAYER_NAMES_RECEIVED, { detail: names });
    controlsFormRef.dispatchEvent(event);
  });
}());
