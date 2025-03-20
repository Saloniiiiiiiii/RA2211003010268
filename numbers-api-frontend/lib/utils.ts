import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock API responses for local development
export const mockApiResponses = {
  fibonacci: {
    numbers: [55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765],
  },
  even: {
    numbers: [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56],
  },
  random: {
    numbers: [2, 19, 25, 7, 4, 24, 17, 27, 30, 21, 14, 10, 23],
  },
  prime: {
    numbers: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71],
  },
}

// Window state storage (in a real app, this would be in a database)
export const windowStates: Record<string, number[]> = {}

