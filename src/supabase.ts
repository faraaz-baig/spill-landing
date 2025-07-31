import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if credentials are properly configured
const isConfigured = supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseKey !== 'your-anon-key-here'

if (!isConfigured) {
  console.warn('Supabase credentials not configured. Please check your .env file and follow SUPABASE_SETUP.md')
}

// Create Supabase client only if properly configured
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null

// Function to validate email format
export const isValidEmail = (email: string): boolean => {
  // More strict email validation regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  // Additional checks for common invalid patterns
  if (!email || email.trim() !== email) return false // No whitespace
  if (email.length > 254) return false // RFC 5321 limit
  if (email.split('@').length !== 2) return false // Exactly one @
  
  const [localPart, domain] = email.split('@')
  if (localPart.length > 64) return false // Local part limit
  if (localPart.length === 0 || domain.length === 0) return false // Both parts must exist
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false // No leading/trailing dots
  if (localPart.includes('..')) return false // No consecutive dots
  if (domain.startsWith('-') || domain.endsWith('-')) return false // Domain can't start/end with hyphen
  if (!domain.includes('.')) return false // Domain must have at least one dot
  
  return emailRegex.test(email)
}

// Function to check if email already exists
export const checkEmailExists = async (email: string) => {
  if (!supabase) {
    return { exists: false, error: 'Supabase not configured' }
  }
  
  try {
    const { data, error } = await supabase
      .from('email_signups')
      .select('email')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking email:', error)
      return { exists: false, error }
    }
    
    return { exists: !!data, error: null }
  } catch (error) {
    console.error('Error checking email:', error)
    return { exists: false, error }
  }
}

// Function to store email in Supabase (only if it doesn't exist)
export const storeEmailIfNew = async (email: string) => {
  if (!supabase) {
    console.warn('Supabase not configured. Email not stored:', email)
    return { success: false, error: 'Supabase not configured', isNew: false }
  }
  
  try {
    // Try to insert the email directly
    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          email: email,
          created_at: new Date().toISOString()
        }
      ])
    
    if (error) {
      // Check if it's a duplicate key error (email already exists)
      if (error.code === '23505') {
        // Email already exists, return success but not new
        return { success: true, data: null, isNew: false }
      }
      
      console.error('Error storing email:', error)
      return { success: false, error, isNew: false }
    }
    
    return { success: true, data, isNew: true }
  } catch (error) {
    console.error('Error storing email:', error)
    return { success: false, error, isNew: false }
  }
}

// Function to trigger file download
export const downloadApp = () => {
  // URL to your .dmg file - you can either:
  // 1. Host it in the public folder: '/Spill.dmg'
  // 2. Host it on a CDN or file hosting service
  // 3. Use GitHub releases or similar
  const downloadUrl = '/src/assets/Spill 1.0.dmg' // Path to the .dmg file in assets folder
  
  try {
    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'Spill 1.0.dmg'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('Download initiated for:', downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
    // Fallback: open in new tab if direct download fails
    window.open(downloadUrl, '_blank')
  }
}