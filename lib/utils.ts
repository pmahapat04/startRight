import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function getDaysUntil(date: Date): number {
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getProgressPercentage(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'done':
      return 'text-green-600 bg-green-50'
    case 'in-progress':
      return 'text-blue-600 bg-blue-50'
    case 'to-do':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function getEligibilityColor(eligibility: string): string {
  switch (eligibility) {
    case 'eligible':
      return 'text-green-600 bg-green-50'
    case 'likely':
      return 'text-yellow-600 bg-yellow-50'
    case 'not-eligible':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}
