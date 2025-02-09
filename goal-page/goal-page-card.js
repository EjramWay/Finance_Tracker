// goal-page-card.js
document.addEventListener('DOMContentLoaded', () => {
  const template = document.getElementById('goal-card-template');
  const container = document.getElementById('goalsContainer');
  let goals = JSON.parse(localStorage.getItem('goals') || '[]');

  // Sort goals: incomplete ones first, completed ones (current >= target) at the end
  goals = goals.sort((a, b) => {
    const aCompleted = parseFloat(a.current) >= parseFloat(a.target);
    const bCompleted = parseFloat(b.current) >= parseFloat(b.target);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  // Optional: Add null checks for dropdown and profile elements
  const dropdown = document.getElementById("dropdown");
  const menu = document.getElementById("dropdown-menu");
  
  if (dropdown) {
      dropdown.addEventListener('click', () => {
          if (menu) menu.classList.toggle('active');
      });
  }

  goals.forEach(goal => {
    const clone = template.content.cloneNode(true);
    const progress = (goal.current / goal.target * 100).toFixed(1);

    // Replace the placeholders in the template's innerHTML
    let cardHtml = clone.querySelector('.goal-card').innerHTML;
    cardHtml = cardHtml.replace(/\$NAME/g, goal.name)
                       .replace(/\$DESCRIPTION/g, goal.description)
                       .replace(/\$TARGET/g, `$${goal.target}`)
                       .replace(/\$CURRENT/g, `$${goal.current}`)
                       .replace(/\$DUE_DATE/g, new Date(goal.dueDate).toLocaleDateString())
                       .replace(/\$PROGRESS/g, progress);
    clone.querySelector('.goal-card').innerHTML = cardHtml;

    // Set the progress bar width
    const progressElem = clone.querySelector('.progress');
    if (progressElem) {
      progressElem.style.width = `${progress}%`;
    }

    // --- Event Listeners for the Action Buttons ---
    
    // Edit Amount: prompt the user for a new current amount
    const editBtn = clone.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      const newCurrent = prompt("Enter new current amount:", goal.current);
      if (newCurrent !== null && newCurrent !== "") {
        goal.current = newCurrent;
        updateGoal(goal.id, goal);
      }
    });

    // Delete: confirm and remove the goal from localStorage
    const deleteBtn = clone.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to delete this goal?")) {
        deleteGoal(goal.id);
      }
    });

    // Complete Goal: set current equal to target to mark as completed
    const completeBtn = clone.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => {
      goal.current = goal.target;
      updateGoal(goal.id, goal);
    });

    container.appendChild(clone);
  });

  // Helper: Update a goal and reload the page
  function updateGoal(goalId, updatedGoal) {
    let goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const index = goals.findIndex(g => g.id === goalId);
    if (index !== -1) {
      goals[index] = updatedGoal;
      localStorage.setItem('goals', JSON.stringify(goals));
      window.location.reload();
    }
  }

  // Helper: Delete a goal and reload the page
  function deleteGoal(goalId) {
    let goals = JSON.parse(localStorage.getItem('goals') || '[]');
    goals = goals.filter(g => g.id !== goalId);
    localStorage.setItem('goals', JSON.stringify(goals));
    window.location.reload();
  }

  // Optional: Create goal button handler
  const goalCreateBtn = document.getElementById('goal-create');
  if (goalCreateBtn) {
      goalCreateBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'goal-create.html';
      });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  // Form handling for goal-add-page
  const form = document.getElementById('goal-form');
  
  if (form) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          try {
              const goal = {
                  name: document.getElementById('goal-name-input').value,
                  amount: document.getElementById('goal-amount-input').value,
                  date: document.getElementById('goal-date-input').value,
                  description: document.getElementById('goal-description-input').value,
                  id: Date.now()
              };

              const goals = JSON.parse(localStorage.getItem('goals') || '[]');
              goals.push(goal);
              localStorage.setItem('goals', JSON.stringify(goals));

              window.location.href = 'goal-page.html';
          } catch (error) {
              console.error('Error processing form:', error);
          }
      });
  }

  // Goal card rendering for goal-page.html
  const template = document.getElementById('goal-card-template');
  const goalParent = document.querySelector('.goal-parent');
  
  if (template && goalParent) {
      try {
          const goals = JSON.parse(localStorage.getItem('goals') || '[]');
          const container = document.createElement('div');
          container.className = 'goal-cards';

          if (goals.length === 0) {
              // Create empty state message
              const emptyState = document.createElement('div');
              emptyState.className = 'empty-state';
              emptyState.innerHTML = `
                  <div class="empty-state-content">
                      <img src="../SVGimages/target-svg.svg" alt="No goals" class="empty-state-icon">
                      <h2>No Goals Set Yet</h2>
                      <p>Start working towards your financial goals by setting your first target!</p>
                      <a href="./goal-create.html" class="empty-state-button">Create Goal</a>
                  </div>
              `;
              container.appendChild(emptyState);
          } else {
              goals.forEach(goal => {
                  const clone = template.content.cloneNode(true);
                  const card = clone.querySelector('.goal-card');
                  
                  // Add data-id attribute for identifying the goal
                  card.dataset.id = goal.id;
                  
                  clone.querySelector('.goal-name').textContent = goal.name;
                  clone.querySelector('.goal-amount').textContent = `$${goal.amount}`;
                  clone.querySelector('.goal-date').textContent = new Date(goal.date).toLocaleDateString();
                  clone.querySelector('.goal-description').textContent = goal.description;
                  
                  container.appendChild(clone);
              });
          }

          goalParent.appendChild(container);
      } catch (error) {
          console.error('Error rendering goals:', error);
      }
  }
});



