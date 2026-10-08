// Este arquivo é responsável por SALVAR e CARREGAR as tarefas
// no localStorage do navegador.
//
// O localStorage é como um "HD" do navegador: os dados ficam salvos
// mesmo depois de fechar a aba ou o navegador.

import type { Task } from '../types/task'

const STORAGE_KEY = 'taskflow_tasks'

// Carrega as tarefas salvas. Se não houver nenhuma, retorna uma lista vazia.
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

// Salva a lista completa de tarefas no localStorage.
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
