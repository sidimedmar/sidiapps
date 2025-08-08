document.addEventListener('DOMContentLoaded', () => {
    // Member variables
    const memberList = document.getElementById('member-list');
    const addMemberForm = document.getElementById('add-member-form');
    const memberNameInput = document.getElementById('member-name');
    const membersApiUrl = 'http://localhost:3000/api/members';

    // Chore variables
    const choreList = document.getElementById('chore-list');
    const addChoreForm = document.getElementById('add-chore-form');
    const choreDescriptionInput = document.getElementById('chore-description');
    const choresApiUrl = 'http://localhost:3000/api/chores';

    // Shopping list variables
    const shoppingList = document.getElementById('shopping-list');
    const addItemForm = document.getElementById('add-item-form');
    const itemNameInput = document.getElementById('item-name');
    const shoppingListApiUrl = 'http://localhost:3000/api/shopping-list';

    let members = [];

    // Member functions
    async function fetchMembers() {
        try {
            const response = await fetch(membersApiUrl);
            members = await response.json();
            renderMembers(members);
            fetchChores(); // Fetch chores after members are fetched
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }

    function renderMembers(members) {
        memberList.innerHTML = '';
        members.forEach(member => {
            const li = document.createElement('li');
            li.textContent = member.name;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => deleteMember(member.id));
            li.appendChild(deleteButton);
            memberList.appendChild(li);
        });
    }

    addMemberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const memberName = memberNameInput.value.trim();
        if (memberName) {
            try {
                const response = await fetch(membersApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: memberName }),
                });
                if (response.ok) {
                    memberNameInput.value = '';
                    fetchMembers();
                }
            } catch (error) {
                console.error('Error adding member:', error);
            }
        }
    });

    async function deleteMember(id) {
        try {
            const response = await fetch(`${membersApiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchMembers();
            }
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    }

    // Chore functions
    async function fetchChores() {
        try {
            const response = await fetch(choresApiUrl);
            const chores = await response.json();
            renderChores(chores);
        } catch (error) {
            console.error('Error fetching chores:', error);
        }
    }

    function renderChores(chores) {
        choreList.innerHTML = '';
        if (!chores) return;
        chores.forEach(chore => {
            const li = document.createElement('li');
            li.textContent = chore.description;

            const controls = document.createElement('div');

            const completedCheckbox = document.createElement('input');
            completedCheckbox.type = 'checkbox';
            completedCheckbox.checked = chore.completed;
            completedCheckbox.addEventListener('change', () => {
                updateChore(chore.id, { completed: completedCheckbox.checked });
            });
            controls.appendChild(completedCheckbox);

            const assigneeSelect = document.createElement('select');
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Non assigné';
            assigneeSelect.appendChild(defaultOption);
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                if (chore.assignedTo === member.id) {
                    option.selected = true;
                }
                assigneeSelect.appendChild(option);
            });
            assigneeSelect.addEventListener('change', () => {
                updateChore(chore.id, { assignedTo: assigneeSelect.value ? parseInt(assigneeSelect.value) : null });
            });
            controls.appendChild(assigneeSelect);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => deleteChore(chore.id));
            controls.appendChild(deleteButton);

            li.appendChild(controls);
            choreList.appendChild(li);
        });
    }


    addChoreForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const choreDescription = choreDescriptionInput.value.trim();
        if (choreDescription) {
            try {
                const response = await fetch(choresApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ description: choreDescription }),
                });
                if (response.ok) {
                    choreDescriptionInput.value = '';
                    fetchChores();
                }
            } catch (error) {
                console.error('Error adding chore:', error);
            }
        }
    });

    async function deleteChore(id) {
        try {
            const response = await fetch(`${choresApiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchChores();
            }
        } catch (error) {
            console.error('Error deleting chore:', error);
        }
    }

    async function updateChore(id, data) {
        try {
            const response = await fetch(`${choresApiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update chore');
            }
            fetchChores();
        } catch (error) {
            console.error('Error updating chore:', error);
        }
    }

    // Shopping list functions
    async function fetchShoppingListItems() {
        try {
            const response = await fetch(shoppingListApiUrl);
            const items = await response.json();
            renderShoppingList(items);
        } catch (error) {
            console.error('Error fetching shopping list items:', error);
        }
    }

    function renderShoppingList(items) {
        shoppingList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.item;
            if (item.purchased) {
                li.classList.add('purchased');
            }
            const purchasedCheckbox = document.createElement('input');
            purchasedCheckbox.type = 'checkbox';
            purchasedCheckbox.checked = item.purchased;
            purchasedCheckbox.addEventListener('change', () => updateShoppingListItem(item.id, { purchased: purchasedCheckbox.checked }));
            li.appendChild(purchasedCheckbox);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => deleteShoppingListItem(item.id));
            li.appendChild(deleteButton);

            shoppingList.appendChild(li);
        });
    }

    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemName = itemNameInput.value.trim();
        if (itemName) {
            try {
                const response = await fetch(shoppingListApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: itemName }),
                });
                if (response.ok) {
                    itemNameInput.value = '';
                    fetchShoppingListItems();
                }
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    });

    async function deleteShoppingListItem(id) {
        try {
            const response = await fetch(`${shoppingListApiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchShoppingListItems();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    async function updateShoppingListItem(id, data) {
        try {
            const response = await fetch(`${shoppingListApiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                fetchShoppingListItems();
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }

    // Initial fetch
    fetchMembers();
    fetchShoppingListItems();
});
