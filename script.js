document.addEventListener('DOMContentLoaded', function() {
    // Gérer les sections et la navigation
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('id').replace('link-', '') + '-section';
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Initialiser sur la section Accueil
    document.getElementById('link-home').classList.add('active');

    // Gestion des catégories
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categoryForm = document.getElementById('category-form');
    const categoryList = document.getElementById('category-list');
    const categoryFilter = document.getElementById('category-filter');
    const transactionCategorySelect = document.getElementById('transaction-category');

    function renderCategories() {
        categoryList.innerHTML = '';
        categoryFilter.innerHTML = '<option value="all">Toutes les Catégories</option>';
        transactionCategorySelect.innerHTML = '<option value="" disabled selected>Choisir une Catégorie</option>';
        categories.forEach((category, index) => {
            const li = document.createElement('li');
            li.innerText = category;
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Supprimer';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category}" ?`)) {
                    categories.splice(index, 1);
                    localStorage.setItem('categories', JSON.stringify(categories));
                    renderCategories();
                    renderTransactions(categoryFilter.value);
                }
            });
            li.appendChild(deleteBtn);
            categoryList.appendChild(li);

            const optionFilter = document.createElement('option');
            optionFilter.value = category;
            optionFilter.innerText = category;
            categoryFilter.appendChild(optionFilter);

            const optionTransaction = document.createElement('option');
            optionTransaction.value = category;
            optionTransaction.innerText = category;
            transactionCategorySelect.appendChild(optionTransaction);
        });
    }

    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newCategory = document.getElementById('new-category').value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            localStorage.setItem('categories', JSON.stringify(categories));
            renderCategories();
            categoryForm.reset();
        } else {
            alert('Veuillez entrer un nom de catégorie valide et non existant.');
        }
    });

    renderCategories();

    // Gestion des transactions par catégorie
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const filteredTransactionsList = document.getElementById('filtered-transactions');
    const transactionForm = document.getElementById('transaction-form');

    function renderTransactions(filterCategory = 'all') {
        filteredTransactionsList.innerHTML = '';
        transactions
            .filter(transaction => filterCategory === 'all' || transaction.category === filterCategory)
            .forEach((transaction, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${transaction.category}</span>: ${transaction.description} - ${transaction.amount.toFixed(2)} € (${transaction.type === 'income' ? 'Revenu' : 'Dépense'})`;
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Supprimer';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.addEventListener('click', () => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
                        transactions.splice(index, 1);
                        localStorage.setItem('transactions', JSON.stringify(transactions));
                        renderTransactions(categoryFilter.value);
                    }
                });
                li.appendChild(deleteBtn);
                filteredTransactionsList.appendChild(li);
            });
    }

    categoryFilter.addEventListener('change', (e) => {
        renderTransactions(e.target.value);
    });

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value.trim();
        const amountValue = document.getElementById('amount').value.trim();
        const amount = parseFloat(amountValue);
        const category = transactionCategorySelect.value;
        const type = document.querySelector('input[name="type"]:checked').value;

        if (description === '' || isNaN(amount) || category === '') {
            alert('Veuillez remplir tous les champs correctement.');
            return;
        }

        const transaction = {
            description,
            amount,
            category,
            type
        };

        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        renderTransactions(categoryFilter.value);
        transactionForm.reset();
    });

    renderTransactions();

    // Gestion de la réserve d'argent
    let reservedAmount = JSON.parse(localStorage.getItem('reservedAmount')) || 0;
    const totalReserveEl = document.getElementById('total-reserve');
    const reserveForm = document.getElementById('reserve-form');

    function updateReservedAmount() {
        totalReserveEl.innerText = `${reservedAmount.toFixed(2)} €`;
    }

    reserveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reserveAmountValue = document.getElementById('reserve-amount').value.trim();
        const reserveAmount = parseFloat(reserveAmountValue);

        if (!isNaN(reserveAmount) && reserveAmount > 0) {
            reservedAmount += reserveAmount;
            localStorage.setItem('reservedAmount', JSON.stringify(reservedAmount));
            updateReservedAmount();
            reserveForm.reset();
        } else {
            alert('Veuillez entrer un montant valide à réserver.');
        }
    });

    updateReservedAmount();
});
