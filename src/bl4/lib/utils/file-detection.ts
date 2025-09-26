/**
 * File type detection and processing utilities for BL4 save files
 */

import * as yaml from 'js-yaml'

export interface FileTypeInfo {
  type: 'character' | 'profile' | 'unknown'
  format: 'sav' | 'yaml'
  fileName: string
}

/**
 * Detect if a file is a character save or profile save based on its content and name
 */
export function detectFileType(file: File): FileTypeInfo {
  const fileName = file.name.toLowerCase()
  const isYaml = fileName.endsWith('.yaml') || fileName.endsWith('.yml')
  const isSav = fileName.endsWith('.sav')
  
  const result: FileTypeInfo = {
    type: 'unknown',
    format: isSav ? 'sav' : (isYaml ? 'yaml' : 'yaml'),
    fileName: file.name
  }

  // Simple filename-based detection - this is all we need
  if (fileName.includes('profile')) {
    result.type = 'profile'
  } else if (/^\d+\.(sav|ya?ml)$/.test(fileName)) {
    result.type = 'character'
  } else if (fileName.includes('character')) {
    result.type = 'character'
  }

  return result
}





/**
 * Convert YAML content to the internal JSON format for editing
 */
export async function processYamlFile(file: File): Promise<{
  fileName: string
  originalContent: string
  yamlContent: string
  jsonData: any
  fileType: FileTypeInfo
}> {
  const content = await file.text()
  const fileType = detectFileType(file)

  try {
    // First, try to preprocess the content to remove problematic tags
    let processedContent = content
    
    // Remove or replace various unknown YAML tags that cause parsing issues
    // Handle different tag formats that might appear in game files
    processedContent = processedContent
      // Handle the specific !<!tags> pattern anywhere in the file
      .replace(/!<!tags>/g, '# Removed unknown tag')
      // Handle any other <!...> tags
      .replace(/!<[^>]*>/g, '# Removed unknown tag')
      // Handle standard YAML tags like !tag
      .replace(/![a-zA-Z0-9_.-]+(\s|$)/g, '# Removed unknown tag$1')
      // Handle tags that appear after colons (like in the error)
      .replace(/:\s*!<!tags>/g, ': # Removed unknown tag')
      .replace(/:\s*!<[^>]*>/g, ': # Removed unknown tag')
      .replace(/:\s*![a-zA-Z0-9_.-]+/g, ': # Removed unknown tag')
    
    console.log(`Processing YAML file ${file.name}, original size: ${content.length}, processed size: ${processedContent.length}`)
    
    // Parse YAML with default schema
    const jsonData = yaml.load(processedContent, {
      onWarning: function(warning) {
        console.warn('YAML warning:', warning)
      }
    })
    
    return {
      fileName: file.name,
      originalContent: content,
      yamlContent: content, // No processing needed
      jsonData,
      fileType
    }
  } catch (error) {
    throw new Error(`Failed to parse YAML file ${file.name}: ${error}`)
  }
}