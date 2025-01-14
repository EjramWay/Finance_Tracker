const goal_card = document.getElementById("goal-card-template");
const cloned = goal_card.content.cloneNode(true);

// To select a single element:
const element = cloned.querySelector('.some-class');

// Or to select multiple elements:
const elements = cloned.querySelectorAll('.some-class');

document.getElementById('goal-create').addEventListener('click', () => {
    window.location.href = 'goal-create.html';
});