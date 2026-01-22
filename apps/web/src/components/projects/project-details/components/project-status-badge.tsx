interface ProjectStatusBadgeProps {
  status: string
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      case 'DELETED':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className={`flex flex-row items-center justify-center rounded-[0.5em] px-[0.7em] py-[0.3em] text-sm ${getStatusStyles()}`}>
      {status}
    </div>
  )
}
