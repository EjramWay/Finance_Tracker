// goal-page-card.js
document.addEventListener('DOMContentLoaded', () => {
    const template = document.getElementById('goal-card-template');
    const container = document.getElementById('goalsContainer');
    let goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const goalcard = document.getElementById("goal-card")
  
    // Sort goals: incomplete ones first, completed ones (current >= target) at the end
    goals = goals.sort((a, b) => {
      const aCompleted = parseFloat(a.current) >= parseFloat(a.target);
      const bCompleted = parseFloat(b.current) >= parseFloat(b.target);
      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;

    });

    const dropdown = document.getElementById("dropdown");
const menu = document.getElementById("dropdown-menu");
const profilemenu = document.getElementById("profile-menu")
const profilebutton = document.getElementById("profile-btn");
const navprofile = document.getElementById("nav-link-profile")

dropdown.addEventListener('click', () => {
    menu.classList.toggle('active')});

profilebutton.addEventListener('click', () => { 
    navprofile.classList.toggle('active')});
  
    goals.forEach(goal => {
      const clone = template.content.cloneNode(true);
      const progress = (goal.current / goal.target * 100).toFixed(1);
  
      // Replace the placeholders in the template’s innerHTML
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
  });
  
  // Fix the create button link (if needed)
  document.getElementById('goal-create').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'goal-create.html';
  });
  