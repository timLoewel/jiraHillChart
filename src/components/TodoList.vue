<template>
  <div class="todo-list">
    <h4>To-Do List</h4>
    <div v-if="!ticketsStore.selectedTicket">
      <p>Select a ticket to see its to-do list.</p>
    </div>
    <div v-else>
      <draggable
        v-model="draggableTodos"
        tag="ul"
        item-key="id"
        class="drag-area"
        handle=".handle"
        @end="onDragEnd"
      >
        <template #item="{ element: todo }">
          <li>
            <span class="handle">⠿</span>
            {{ todo.text }}
          </li>
        </template>
      </draggable>
      <p v-if="todoStore.todos.length === 0">No to-do items found in the ticket description.</p>

      <div class="add-todo">
        <input
          type="text"
          v-model="newTodoText"
          @keyup.enter="addTodo"
          placeholder="Add a new item..."
        />
        <button @click="addTodo">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useTodoStore } from '@/stores/todo.store';
import { useTicketsStore } from '@/stores/tickets.store';
import draggable from 'vuedraggable';

const todoStore = useTodoStore();
const ticketsStore = useTicketsStore();
const newTodoText = ref('');

const selectedTicketDescription = computed(() => ticketsStore.selectedTicket?.fields.description);
watch(selectedTicketDescription, (newDescription) => {
  todoStore.parseTodosFromDescription(newDescription);
}, { immediate: true });

// vuedraggable needs a writable computed property to update the store
const draggableTodos = computed({
  get: () => todoStore.todos,
  set: (value) => {
    // This setter is called by vuedraggable, but we'll handle the final update in onDragEnd
    // to avoid multiple updates. We can update the local order optimistically.
    todoStore.todos = value;
  }
});

const onDragEnd = () => {
  // The store's `todos` are already updated by the setter.
  // Now we call the action to persist the final order.
  todoStore.updateTodoOrder(draggableTodos.value);
};

const addTodo = async () => {
  if (!newTodoText.value.trim()) return;
  await todoStore.addTodo(newTodoText.value);
  newTodoText.value = '';
};
</script>

<style scoped>
.drag-area {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 1rem;
}
li {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.handle {
  cursor: grab;
  color: #aaa;
}
.add-todo {
  display: flex;
  gap: 0.5rem;
}
.add-todo input {
  flex-grow: 1;
  padding: 0.5rem;
}
.add-todo button {
  padding: 0.5rem 1rem;
}
</style>
