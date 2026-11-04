import { Selector, ClientFunction } from 'testcafe';
import type { Priority } from '../../src/todoLogic';

// The app is started with "vite preview" and lives under the GitHub Pages base path
const APP_URL = 'http://localhost:4173/bde-project/';

// Elements on the page that the tests use
const todoInput = Selector('#todo-input');
const prioritySelect = Selector('#priority-select');
const addButton = Selector('.todo-form button[type="submit"]');
const errorMessage = Selector('#error-message');
const todoItems = Selector('.todo-item');
const searchInput = Selector('#search-input');
const sortButton = Selector('#sort-button');
const clearButton = Selector('#clear-button');

// Functions that run inside the browser
const clearStorage = ClientFunction(() => localStorage.clear());
const reloadPage = ClientFunction(() => location.reload());

// Helper: type a todo, choose a priority and click Add
const addTodo = async (t: TestController, text: string, priority: Priority = 'medium'): Promise<void> => {
  await t
    .typeText(todoInput, text)
    .click(prioritySelect)
    .click(prioritySelect.find('option').withAttribute('value', priority))
    .click(addButton);
};

// Every test starts with an empty list
const startClean = async (t: TestController): Promise<void> => {
  await clearStorage();
  await reloadPage();
  await t.expect(todoItems.count).eql(0);
};

fixture('Error handling')
  .page(APP_URL)
  .beforeEach(startClean);

test('shows a red border and an error message when adding an empty todo', async t => {
  await t
    .click(addButton)
    .expect(errorMessage.visible).ok()
    .expect(todoInput.hasClass('input-error')).ok()
    .expect(todoItems.count).eql(0);
});

test('hides the error again when the user starts typing', async t => {
  await t
    .click(addButton)
    .expect(errorMessage.visible).ok()
    .typeText(todoInput, 'B')
    .expect(errorMessage.visible).notOk()
    .expect(todoInput.hasClass('input-error')).notOk();
});

fixture('Toggle completed')
  .page(APP_URL)
  .beforeEach(startClean);

test('clicking the text marks a todo as completed', async t => {
  await addTodo(t, 'Buy milk');
  await t
    .click(todoItems.nth(0).find('.todo-text'))
    .expect(todoItems.nth(0).hasClass('completed')).ok();
});

test('clicking the text again marks it as not completed', async t => {
  await addTodo(t, 'Buy milk');
  const text = todoItems.nth(0).find('.todo-text');
  await t
    .click(text)
    .click(text)
    .expect(todoItems.nth(0).hasClass('completed')).notOk();
});

fixture('Priority levels')
  .page(APP_URL)
  .beforeEach(startClean);

test('shows the chosen priority as a colored label', async t => {
  await addTodo(t, 'Study for exam', 'high');
  const badge = todoItems.nth(0).find('.priority-badge');
  await t
    .expect(badge.textContent).eql('high')
    .expect(badge.hasClass('priority-high')).ok();
});

test('uses medium when the priority is not changed', async t => {
  await t
    .typeText(todoInput, 'Buy milk')
    .click(addButton);
  await t.expect(todoItems.nth(0).find('.priority-badge').textContent).eql('medium');
});

fixture('Sort by priority')
  .page(APP_URL)
  .beforeEach(startClean);

test('sorts todos with high first, then medium, then low', async t => {
  await addTodo(t, 'Low task', 'low');
  await addTodo(t, 'High task', 'high');
  await addTodo(t, 'Medium task', 'medium');
  await t
    .click(sortButton)
    .expect(todoItems.nth(0).find('.todo-text').textContent).eql('High task')
    .expect(todoItems.nth(1).find('.todo-text').textContent).eql('Medium task')
    .expect(todoItems.nth(2).find('.todo-text').textContent).eql('Low task');
});

test('keeps the sorted order after refreshing the page', async t => {
  await addTodo(t, 'Low task', 'low');
  await addTodo(t, 'High task', 'high');
  await t.click(sortButton);
  await reloadPage();
  await t.expect(todoItems.nth(0).find('.todo-text').textContent).eql('High task');
});

fixture('Search')
  .page(APP_URL)
  .beforeEach(startClean);

test('only shows todos that match the search text', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Walk the dog');
  await addTodo(t, 'Buy bread');
  await t
    .typeText(searchInput, 'buy')
    .expect(todoItems.count).eql(2);
});

test('shows all todos again when the search is cleared', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Walk the dog');
  await t
    .typeText(searchInput, 'milk')
    .expect(todoItems.count).eql(1)
    .selectText(searchInput)
    .pressKey('delete')
    .expect(todoItems.count).eql(2);
});

fixture('Local storage')
  .page(APP_URL)
  .beforeEach(startClean);

test('keeps the todos after refreshing the page', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Walk the dog');
  await reloadPage();
  await t.expect(todoItems.count).eql(2);
});

test('keeps the completed status and priority after refreshing', async t => {
  await addTodo(t, 'Study for exam', 'high');
  await t.click(todoItems.nth(0).find('.todo-text'));
  await reloadPage();
  await t
    .expect(todoItems.nth(0).hasClass('completed')).ok()
    .expect(todoItems.nth(0).find('.priority-badge').textContent).eql('high');
});

fixture('Clear all')
  .page(APP_URL)
  .beforeEach(startClean);

test('removes all todos when the user clicks OK', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Walk the dog');
  await t
    .setNativeDialogHandler(() => true) // click OK in the confirm popup
    .click(clearButton)
    .expect(todoItems.count).eql(0);
  await reloadPage();
  await t.expect(todoItems.count).eql(0);
});

test('keeps all todos when the user clicks Cancel', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Walk the dog');
  await t
    .setNativeDialogHandler(() => false) // click Cancel in the confirm popup
    .click(clearButton)
    .expect(todoItems.count).eql(2);
});

// Picks a color in the color picker.
// typeText doesn't work on <input type="color">, so we set the value in the browser
// and send the same 'input' event that a real color pick sends.
const pickThemeColor = ClientFunction((color: string) => {
  const picker = document.getElementById('color-picker') as HTMLInputElement;
  picker.value = color;
  picker.dispatchEvent(new Event('input'));
});

const colorPicker = Selector('#color-picker');

fixture('Theme color picker')
  .page(APP_URL)
  .beforeEach(startClean);

test('picking a color changes the button color', async t => {
  await pickThemeColor('#cc0066');
  // #cc0066 written as rgb is rgb(204, 0, 102)
  await t.expect(addButton.getStyleProperty('background-color')).eql('rgb(204, 0, 102)');
});

test('keeps the chosen color after refreshing the page', async t => {
  await pickThemeColor('#cc0066');
  await reloadPage();
  await t
    .expect(colorPicker.value).eql('#cc0066')
    .expect(addButton.getStyleProperty('background-color')).eql('rgb(204, 0, 102)');
});
