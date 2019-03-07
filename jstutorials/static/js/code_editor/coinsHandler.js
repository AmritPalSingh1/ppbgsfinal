/* global $ */

if (localStorage.getItem('usedHint') == null) {
  localStorage.setItem('usedHint', false);
}

fetch(`/static/mock_data/user.json`)
  .then(data => data.json())
  .then(data => {
    const updateCoinCount = () => {
      const usedHint = localStorage.getItem('usedHint') === 'true';
      $('#coin-count-container').html(
        `<i class="fas fa-coins"></i> ${data.coins - usedHint} Coins`,
      );
    };

    updateCoinCount();

    $('#use-hint-button').click(() => {
      $('#hintModal').modal('show');
      localStorage.setItem('usedHint', true);
      updateCoinCount();
    });
  });

$('#ask-for-hint-button').click(() => {
  const usedHint = localStorage.getItem('usedHint') === 'true';
  $(usedHint ? '#hintModal' : '#hintPrompt').modal('show');
});
