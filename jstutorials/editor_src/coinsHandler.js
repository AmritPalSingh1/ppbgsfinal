/* global $ */

const constants = {
  hintCost: 2,
};

let state = {
  coins: $('#coin-count-container').html(),
  hintsUsed: 0,
};

const updateCoinCount = () => {
  $('#coin-count-container').html(
    `<i class="fas fa-coins"></i> ${state.coins} Coins`,
  );
};

updateCoinCount();

$('#use-hint-button').click(() => {
  $('#hintModal').modal('show');
});

$('#ask-for-hint-button').click(() => {
});

$('#hint-cost').html(constants.hintCost);

export const setState = newState => {
  state = { ...state, ...newState };
};

export const getState = () => state;
