/**
 * Helper function to get CV file path based on locale
 */
export function getCVPath(locale: string): string {
  // Map locale to CV filename
  const cvFiles: Record<string, string> = {
    vi: '/cv/VU-THI-HOAI-THU_FRONT_END_Vi.pdf',
    en: '/cv/VU-THI-HOAI-THU_FRONT_END.pdf',
  }
  
  // Default to Vietnamese if locale not found
  return cvFiles[locale] || cvFiles.vi
}

/**
 * Helper function to get CV filename for download
 */
export function getCVFileName(locale: string): string {
  const fileNames: Record<string, string> = {
    vi: 'VU-THI-HOAI-THU_FRONT_END_Vi.pdf',
    en: 'VU-THI-HOAI-THU_FRONT_END.pdf',
  }
  
  return fileNames[locale] || fileNames.vi
}

