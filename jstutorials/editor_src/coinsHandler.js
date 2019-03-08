/* global $ */

const constants = {
  hintCost: 10,
  coins: $('#coin-count-container').html(),
};

if (localStorage.getItem('usedHint') == null) {
  localStorage.setItem('usedHint', false);
}

const updateCoinCount = () => {
  const usedHint = localStorage.getItem('usedHint') === 'true';
  const coins = constants.coins - (usedHint * constants.hintCost);

  $('#coin-count-container').html(
    `<i class="fas fa-coins"></i> ${coins} Coins`,
  );
};

updateCoinCount();

$('#use-hint-button').click(() => {
  $('#hintModal').modal('show');
  localStorage.setItem('usedHint', true);
  updateCoinCount();
});

$('#ask-for-hint-button').click(() => {
  const usedHint = localStorage.getItem('usedHint') === 'true';

  if (constants.coins < constants.hintCost) {
    $('#noCoinsModal').modal('show');
  } else if (usedHint) {
    $('#hintModal').modal('show');
  } else {
    $('#hintPrompt').modal('show');
  }
});
