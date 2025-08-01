import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jiraApi } from '@/services/jiraApi'
import { useTicketsStore } from '@/stores/tickets.store'

export interface ToDo {
  id: string; // Unique ID for v-for keys
  text: string;
  x: number;
  y: number;
  originalLine: string;
  listIndex: number; // To know which bullet list it belongs to
}

// Regex to find task items with coordinates, e.g., "* Do something [1.2, 3.4]"
const todoWithCoordsRegex = /^\s*\*\s+(.*)\[([\d.]+),\s*([\d.]+)\]\s*$/;
// Regex to find any task item, e.g., "* Do something"
const anyTodoRegex = /^\s*\*\s+(.*)$/;

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<ToDo[]>([]);
  const nonTodoLines = ref<string[]>([]);

  function parseTodosFromDescription(description: string | null | undefined) {
    if (!description) {
      todos.value = [];
      nonTodoLines.value = [];
      return;
    }

    const lines = description.split('\n');
    const parsedTodos: ToDo[] = [];
    const remainingLines: string[] = [];
    let listCounter = -1;
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('* ')) {
        if (!inList) {
          listCounter++;
          inList = true;
        }

        const matchWithCoords = trimmedLine.match(todoWithCoordsRegex);
        if (matchWithCoords) {
          parsedTodos.push({
            id: `todo-${index}`,
            text: matchWithCoords[1].trim(),
            x: parseFloat(matchWithCoords[2]),
            y: parseFloat(matchWithCoords[3]),
            originalLine: line,
            listIndex: listCounter,
          });
        } else {
          const matchAny = trimmedLine.match(anyTodoRegex);
          if (matchAny) {
            parsedTodos.push({
              id: `todo-${index}`,
              text: matchAny[1].trim(),
              x: 0, // Default for items without coords
              y: 5, // Default for items without coords - uphill start
              originalLine: line,
              listIndex: listCounter,
            });
          }
        }
      } else {
        inList = false;
        remainingLines.push(line);
      }
    });

    todos.value = parsedTodos;
    nonTodoLines.value = remainingLines;
  }

  function reconstructDescription(): string {
    const lists: string[][] = [];
    todos.value.forEach(todo => {
      if (!lists[todo.listIndex]) {
        lists[todo.listIndex] = [];
      }
      const text = `* ${todo.text} [${todo.x}, ${todo.y}]`;
      lists[todo.listIndex].push(text);
    });

    let desc = nonTodoLines.value.join('\n');
    lists.forEach(list => {
      desc += '\n\n' + list.join('\n');
    });

    return desc.trim();
  }

  async function updateTodoPosition(id: string, x: number, y: number) {
    const todo = todos.value.find(t => t.id === id);
    if (!todo) return;

    todo.x = x;
    todo.y = y;

    const ticketsStore = useTicketsStore();
    if (!ticketsStore.selectedTicket) return;

    const newDescription = reconstructDescription();
    await jiraApi.updateTicketDescription(ticketsStore.selectedTicket.key, newDescription);
    ticketsStore.selectedTicket.fields.description = newDescription;
  }

  async function addTodo(text: string) {
    const ticketsStore = useTicketsStore();
    if (!ticketsStore.selectedTicket) return;

    const newTodo: ToDo = {
      id: `todo-${Date.now()}`,
      text,
      x: 0,
      y: 5,
      originalLine: '', // Will be generated
      listIndex: todos.value.length > 0 ? todos.value[todos.value.length - 1].listIndex : 0,
    };
    todos.value.push(newTodo);

    const newDescription = reconstructDescription();
    await jiraApi.updateTicketDescription(ticketsStore.selectedTicket.key, newDescription);

    // Refresh the description from source
    ticketsStore.selectedTicket.fields.description = newDescription;
    parseTodosFromDescription(newDescription);
  }

  async function updateTodoOrder(newTodos: ToDo[]) {
    // For now, we'll treat re-ordering as creating one single list.
    // This simplifies the logic of determining which sub-list an item belongs to.
    if (newTodos.length > 0) {
      for (let i = 0; i < newTodos.length; i++) {
        newTodos[i].listIndex = 0;
      }
    }

    todos.value = newTodos;

    const ticketsStore = useTicketsStore();
    if (!ticketsStore.selectedTicket) return;

    const newDescription = reconstructDescription();
    await jiraApi.updateTicketDescription(ticketsStore.selectedTicket.key, newDescription);
    ticketsStore.selectedTicket.fields.description = newDescription;
    parseTodosFromDescription(newDescription);
  }

  return {
    todos,
    nonTodoLines,
    parseTodosFromDescription,
    addTodo,
    updateTodoPosition,
    updateTodoOrder,
  }
})
