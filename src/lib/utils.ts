import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string or Date object into a readable format
 * Simple implementation that matches the original approach
 */
export function formatDate(dateInput: string | Date): string {
  if (!dateInput) return ''
  
  let date: Date
  
  if (typeof dateInput === 'string') {
    date = new Date(dateInput)
  } else {
    date = dateInput
  }
  
  // Check if date is invalid
  if (isNaN(date.getTime())) {
    return ''
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Calculate estimated reading time for text content
 */
export function getReadTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Deep merge two objects, preserving nested structures
 */
export function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') {
    return target
  }
  
  if (!target || typeof target !== 'object') {
    return source
  }
  
  const result = { ...target }
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // Recursively merge objects
        result[key] = deepMerge(target[key] || {}, source[key])
      } else {
        // For arrays and primitive values, replace directly
        result[key] = source[key]
      }
    }
  }
  
  return result
}
