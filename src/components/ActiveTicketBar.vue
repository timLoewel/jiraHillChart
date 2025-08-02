<script setup lang="ts">
import { ref, watch } from 'vue';
import { updateTicketTitle } from '../services/jira';

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  jiraHost: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['select-ticket-dialog']);

const isEditing = ref(false);
const editableTitle = ref(props.ticket.title);

watch(() => props.ticket.title, (newTitle) => {
  editableTitle.value = newTitle;
});

function openTicketSelector() {
  emit('select-ticket-dialog');
}

function startEditing() {
  isEditing.value = true;
}

async function finishEditing() {
  isEditing.value = false;
  if (props.ticket.title !== editableTitle.value) {
    try {
      await updateTicketTitle(props.ticket.id, editableTitle.value);
      // Optionally, you could emit an event here to notify the parent
      // that the ticket was updated, so it can refetch or update its state.
    } catch (error) {
      console.error('Failed to update ticket title:', error);
      // Revert the title on failure
      editableTitle.value = props.ticket.title;
    }
  }
}

function getJiraTicketUrl() {
    return `${props.jiraHost}/browse/${props.ticket.id}`;
}
</script>

<template>
  <div class="active-ticket-bar">
    <span class="ticket-id" @click="openTicketSelector">{{ ticket.id }}</span>
    <a :href="getJiraTicketUrl()" target="_blank" class="external-link-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    </a>
    <span v-if="!isEditing" class="ticket-title" @click="startEditing">{{ editableTitle }}</span>
    <input
      v-else
      v-model="editableTitle"
      @blur="finishEditing"
      @keyup.enter="finishEditing"
      class="title-input"
      type="text"
      ref="titleInput"
      v-focus
    />
  </div>
</template>

<style scoped>
.active-ticket-bar {
  display: flex;
  align-items: center;
  padding: 0.5em;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}
.ticket-id {
  font-weight: bold;
  cursor: pointer;
  margin-right: 0.5em;
}
.external-link-icon {
    margin-right: 0.5em;
    display: inline-flex;
    align-items: center;
}
.ticket-title {
  cursor: pointer;
}
.title-input {
  width: 100%;
  padding: 0.2em;
}
</style>
