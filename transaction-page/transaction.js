document.addEventListener('DOMContentLoaded', () => {
    // Form handling for transaction-add-page.html
    const form = document.getElementById('transaction-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            try {
                const transaction = {
                    date: document.getElementById('date-input').value,
                    amount: document.getElementById('amount-input').value,
                    category: document.getElementById('category-input').value,
                    description: document.getElementById('description-input').value,
                    account: document.getElementById('account-input').value,
                    id: Date.now()
                };

                const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
                transactions.push(transaction);
                localStorage.setItem('transactions', JSON.stringify(transactions));

                window.location.href = 'transactionpage.html';
            } catch (error) {
                console.error('Error processing form:', error);
            }
        });
    }

    // Transaction card rendering for transactionpage.html
    const template = document.getElementById('transaction-card-template');
    const transacParent = document.querySelector('.transac-parent');
    
    if (template && transacParent) {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const container = document.createElement('div');
            container.className = 'transaction-cards';

            if (transactions.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <div class="empty-state-content">
                        <img src="../SVGimages/empty-box-svg.svg" alt="No transactions" class="empty-state-icon">
                        <h2>No Transactions Yet</h2>
                        <p>Start tracking your finances by adding your first transaction!</p>
                        <a href="transaction-add-page.html" class="empty-state-button">Add Transaction</a>
                    </div>
                `;
                container.appendChild(emptyState);
            } else {
                transactions.forEach(transaction => {
                    const clone = template.content.cloneNode(true);
                    const card = clone.querySelector('.transaction-card');
                    
                    // Add data-id attribute for identifying the transaction
                    card.dataset.id = transaction.id;
                    
                    clone.querySelector('.transaction-date').textContent = new Date(transaction.date).toLocaleDateString();
                    clone.querySelector('.transaction-category').textContent = transaction.category;
                    clone.querySelector('.transaction-amount').textContent = `$${transaction.amount}`;
                    clone.querySelector('.transaction-account').textContent = transaction.account;
                    clone.querySelector('.transaction-description').textContent = transaction.description;
                    
                    // Add action buttons
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'transaction-actions';
                    actionsDiv.innerHTML = `
                        <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
                    `;
                    
                    card.appendChild(actionsDiv);
                    container.appendChild(clone);
                });
            }

            transacParent.appendChild(container);
        } catch (error) {
            console.error('Error rendering transactions:', error);
        }
    }
});

// Delete transaction function
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const updatedTransactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        location.reload();
    }
}

// Edit transaction function
function editTransaction(id) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = transactions.find(t => t.id === id);
    const card = document.querySelector(`[data-id="${id}"]`);
    const amountElement = card.querySelector('.transaction-amount');
    
    // Create input for editing
    const input = document.createElement('input');
    input.type = 'number';
    input.value = transaction.amount;
    input.className = 'edit-amount-input';
    
    // Replace amount text with input
    const originalText = amountElement.textContent;
    amountElement.textContent = '';
    amountElement.appendChild(input);
    input.focus();
    
    // Save on enter or blur
    const saveEdit = () => {
        const newAmount = input.value;
        if (newAmount && !isNaN(newAmount)) {
            transaction.amount = newAmount;
            const updatedTransactions = transactions.map(t => 
                t.id === id ? transaction : t
            );
            localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
            amountElement.textContent = `$${newAmount}`;
        } else {
            amountElement.textContent = originalText;
        }
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            amountElement.textContent = originalText;
        }
    });
}