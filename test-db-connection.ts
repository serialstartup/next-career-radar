import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

envContent.split('\n').forEach((line) => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Service Key:', supabaseServiceKey ? '✅ Set (starts with ' + supabaseServiceKey.substring(0, 10) + '...)' : '❌ Missing')
console.log('')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabaseConnection() {
  console.log('🔌 Testing Supabase Database Connection...\n')

  try {
    // Test 1: Check if we can connect to Supabase by querying profiles table
    console.log('1. Connecting to Supabase...')
    const { data: healthData, error: healthError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (healthError) {
      console.log('   ❌ Connection failed:', healthError.message)
      console.log('   Error code:', healthError.code)
      return false
    }
    console.log('   ✅ Successfully connected to Supabase\n')

    // Test 2: Check if profiles table exists and can be queried
    console.log('2. Checking profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(5)

    if (profilesError) {
      if (profilesError.code === '42P01') {
        console.log('   ⚠️  profiles table does not exist yet')
        console.log('   ℹ️  Run the Supabase migrations to create the tables')
      } else {
        console.log('   ❌ Failed to query profiles table:', profilesError.message)
        console.log('   Error code:', profilesError.code)
      }
      return false
    }

    console.log('   ✅ profiles table exists and is queryable')
    console.log(`   📊 Found ${profiles?.length || 0} profile(s) in the table\n`)

    // Test 3: Try to query other expected tables
    console.log('3. Checking other expected tables...')
    const expectedTables = ['cvs', 'experiences', 'educations', 'skills', 'jobs', 'job_matches']
    const tablesFound: string[] = []

    for (const table of expectedTables) {
      const { error: tableError } = await supabase.from(table).select('id').limit(1)
      if (!tableError) {
        tablesFound.push(table)
        console.log(`   ✅ ${table} table exists`)
      } else if (tableError.code === '42P01') {
        console.log(`   ⚠️  ${table} table does not exist`)
      } else {
        console.log(`   ⚠️  ${table} table error: ${tableError.message}`)
      }
    }
    console.log('')

    console.log('📋 Summary:')
    console.log(`   - Connected to: ${supabaseUrl}`)
    console.log(`   - profiles table: ✅ exists`)
    console.log(`   - Other tables found: ${tablesFound.length > 0 ? tablesFound.join(', ') : 'none'}`)
    console.log('')

    console.log('🎉 All tests passed! Database connection is working correctly.')
    return true

  } catch (error) {
    console.log('   ❌ Unexpected error:', error instanceof Error ? error.message : error)
    return false
  }
}

testDatabaseConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
