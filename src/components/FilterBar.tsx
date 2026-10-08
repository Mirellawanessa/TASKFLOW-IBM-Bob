// Barra de filtros — estilo monocromático com abas e contadores

import type { FilterOption } from '../types/task'

interface FilterBarProps {
  activeFilter: FilterOption
  counts: Record<FilterOption, number>
  onFilterChange: (filter: FilterOption) => void
}

const filters: { value: FilterOption; label: string }[] = [
  { value: 'all',       label: 'Todas'      },
  { value: 'pending',   label: 'Pendentes'  },
  { value: 'completed', label: 'Concluídas' },
]

export function FilterBar({ activeFilter, counts, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeFilter === f.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {f.label}
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
            activeFilter === f.value
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {counts[f.value]}
          </span>
        </button>
      ))}
    </div>
  )
}
