function onAlertButtonClick() {
  alert('Hello! You clicked the button.');
}

function setupInteractions() {
  var alertButton = document.getElementById('alertButton');
  if (!alertButton) return;
  alertButton.addEventListener('click', onAlertButtonClick);
}

document.addEventListener('DOMContentLoaded', setupInteractions); 