const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let members = [];

let nextId = 1;

// Get all members
app.get('/api/members', (req, res) => {
  res.json(members);
});

// Add a new member
app.post('/api/members', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newMember = { id: nextId++, name };
  members.push(newMember);
  res.status(201).json(newMember);
});

// Delete a member
app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const memberIndex = members.findIndex(m => m.id === parseInt(id));
  if (memberIndex === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }
  members.splice(memberIndex, 1);
  res.status(204).send();
});

let chores = [];
let nextChoreId = 1;

// Get all chores
app.get('/api/chores', (req, res) => {
  res.json(chores);
});

// Add a new chore
app.post('/api/chores', (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  const newChore = { id: nextChoreId++, description, completed: false, assignedTo: null };
  chores.push(newChore);
  res.status(201).json(newChore);
});

// Delete a chore
app.delete('/api/chores/:id', (req, res) => {
    const { id } = req.params;
    const choreIndex = chores.findIndex(c => c.id === parseInt(id));
    if (choreIndex === -1) {
        return res.status(404).json({ error: 'Chore not found' });
    }
    chores.splice(choreIndex, 1);
    res.status(204).send();
});

// Update a chore
app.put('/api/chores/:id', (req, res) => {
    const { id } = req.params;
    const { completed, assignedTo } = req.body;
    const chore = chores.find(c => c.id === parseInt(id));
    if (!chore) {
        return res.status(404).json({ error: 'Chore not found' });
    }
    if (completed !== undefined) {
        chore.completed = completed;
    }
    if (assignedTo !== undefined) {
        chore.assignedTo = assignedTo;
    }
    res.json(chore);
});


let shoppingListItems = [];
let nextShoppingListItemId = 1;

// Get all shopping list items
app.get('/api/shopping-list', (req, res) => {
    res.json(shoppingListItems);
});

// Add a new shopping list item
app.post('/api/shopping-list', (req, res) => {
    const { item } = req.body;
    if (!item) {
        return res.status(400).json({ error: 'Item is required' });
    }
    const newItem = { id: nextShoppingListItemId++, item, purchased: false };
    shoppingListItems.push(newItem);
    res.status(201).json(newItem);
});

// Delete a shopping list item
app.delete('/api/shopping-list/:id', (req, res) => {
    const { id } = req.params;
    const itemIndex = shoppingListItems.findIndex(i => i.id === parseInt(id));
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    shoppingListItems.splice(itemIndex, 1);
    res.status(204).send();
});

// Update a shopping list item
app.put('/api/shopping-list/:id', (req, res) => {
    const { id } = req.params;
    const { purchased } = req.body;
    const item = shoppingListItems.find(i => i.id === parseInt(id));
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    if (purchased !== undefined) {
        item.purchased = purchased;
    }
    res.json(item);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
