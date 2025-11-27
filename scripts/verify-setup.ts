/**
 * Pre-Deployment Verification Script
 * 
 * Purpose: Verify all prerequisites are met before deploying
 * Run: tsx scripts/verify-setup.ts
 */

import fs from 'fs'
import path from 'path'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  critical: boolean
}

const results: CheckResult[] = []

function check(name: string, condition: boolean, message: string, critical: boolean = false) {
  results.push({
    name,
    status: condition ? 'pass' : 'fail',
    message,
    critical
  })
}

function warn(name: string, message: string) {
  results.push({
    name,
    status: 'warning',
    message,
    critical: false
  })
}

console.log('🔍 Pre-Deployment Verification\n')
console.log('Checking all prerequisites...\n')

// ============================================================================
// 1. Check Environment Variables
// ============================================================================
console.log('📋 Checking Environment Variables...')

const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

check(
  'Environment File',
  envExists,
  envExists 
    ? '.env.local found' 
    : '.env.local missing - create it with Supabase credentials',
  true
)

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL')
  const hasAnonKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY')
  
  check('Supabase URL', hasUrl, hasUrl ? '✓ URL configured' : '✗ Missing NEXT_PUBLIC_SUPABASE_URL', true)
  check('Anon Key', hasAnonKey, hasAnonKey ? '✓ Anon key configured' : '✗ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY', true)
  check('Service Role Key', hasServiceKey, hasServiceKey ? '✓ Service key configured' : '✗ Missing SUPABASE_SERVICE_ROLE_KEY', true)
}

// ============================================================================
// 2. Check Content Files
// ============================================================================
console.log('\n📚 Checking Content Files...')

const contentFiles = [
  { path: 'მათემატიკა.md', name: 'Mathematics' },
  { path: 'ბიოლოგია.md', name: 'Biology' },
  { path: 'ისტორია.md', name: 'History' },
  { path: 'გეოგრაფია.md', name: 'Geography' },
  { path: 'ინგლისური.md', name: 'English' },
  { path: 'ქართული.md', name: 'Georgian Language' }
]

let totalQuestions = 0

for (const file of contentFiles) {
  const filePath = path.join(process.cwd(), file.path)
  const exists = fs.existsSync(filePath)
  
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const questionCount = (content.match(/\n\d+\.\s+/g) || []).length
    totalQuestions += questionCount
    
    check(
      `${file.name} Content`,
      questionCount === 20,
      `${questionCount}/20 questions found`,
      false
    )
  } else {
    check(
      `${file.name} Content`,
      false,
      `File ${file.path} not found`,
      true
    )
  }
}

check(
  'Total Questions',
  totalQuestions === 120,
  `${totalQuestions}/120 questions ready for import`,
  false
)

// ============================================================================
// 3. Check Migration Files
// ============================================================================
console.log('\n📦 Checking Migration Files...')

const migrationFiles = [
  'supabase/migrations/20241118000000_initial_schema.sql',
  'supabase/migrations/20241119_grades_and_options.sql',
  'supabase/ALL_IN_ONE_SETUP.sql'
]

for (const file of migrationFiles) {
  const filePath = path.join(process.cwd(), file)
  const exists = fs.existsSync(filePath)
  
  check(
    path.basename(file),
    exists,
    exists ? `✓ ${file}` : `✗ Missing ${file}`,
    file.includes('ALL_IN_ONE')
  )
}

// ============================================================================
// 4. Check Scripts
// ============================================================================
console.log('\n🔧 Checking Scripts...')

const scriptPath = path.join(process.cwd(), 'scripts/seed-questions.ts')
const scriptExists = fs.existsSync(scriptPath)

check(
  'Seed Script',
  scriptExists,
  scriptExists ? '✓ seed-questions.ts ready' : '✗ Missing seed-questions.ts',
  true
)

// Check package.json for seed script
const packagePath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  const hasSeedScript = packageJson.scripts?.['seed:questions']
  
  check(
    'NPM Seed Script',
    !!hasSeedScript,
    hasSeedScript ? '✓ "npm run seed:questions" configured' : '✗ Missing seed:questions script',
    false
  )
  
  // Check tsx dependency
  const hasTsx = packageJson.devDependencies?.tsx
  check(
    'TSX Dependency',
    !!hasTsx,
    hasTsx ? `✓ tsx@${hasTsx} installed` : '✗ Missing tsx - run: npm install -D tsx',
    true
  )
}

// ============================================================================
// 5. Check Documentation
// ============================================================================
console.log('\n📖 Checking Documentation...')

const docFiles = [
  'START_HERE.md',
  'DEPLOYMENT_READY.md',
  'SETUP_INSTRUCTIONS.md',
  'IMPLEMENTATION-PLAN.md',
  'IMPLEMENTATION_SUMMARY.md'
]

for (const file of docFiles) {
  const filePath = path.join(process.cwd(), file)
  check(
    file,
    fs.existsSync(filePath),
    fs.existsSync(filePath) ? `✓ ${file}` : `✗ Missing ${file}`,
    false
  )
}

// ============================================================================
// 6. Print Results
// ============================================================================
console.log('\n' + '='.repeat(60))
console.log('VERIFICATION RESULTS')
console.log('='.repeat(60))

const passed = results.filter(r => r.status === 'pass').length
const failed = results.filter(r => r.status === 'fail').length
const warnings = results.filter(r => r.status === 'warning').length
const criticalFails = results.filter(r => r.status === 'fail' && r.critical).length

// Group results by status
const failedChecks = results.filter(r => r.status === 'fail')
const warningChecks = results.filter(r => r.status === 'warning')
const passedChecks = results.filter(r => r.status === 'pass')

if (failedChecks.length > 0) {
  console.log('\n❌ FAILED CHECKS:')
  failedChecks.forEach(r => {
    console.log(`   ${r.critical ? '🔴' : '⚠️ '} ${r.name}: ${r.message}`)
  })
}

if (warningChecks.length > 0) {
  console.log('\n⚠️  WARNINGS:')
  warningChecks.forEach(r => {
    console.log(`   ⚠️  ${r.name}: ${r.message}`)
  })
}

console.log(`\n✅ PASSED: ${passed}/${results.length}`)
if (failed > 0) console.log(`❌ FAILED: ${failed}`)
if (warnings > 0) console.log(`⚠️  WARNINGS: ${warnings}`)

console.log('\n' + '='.repeat(60))

if (criticalFails > 0) {
  console.log('\n🚫 CRITICAL ISSUES DETECTED!')
  console.log(`   ${criticalFails} critical check(s) failed.`)
  console.log('   Please fix these issues before deploying.\n')
  console.log('   See details above for specific fixes needed.')
  process.exit(1)
} else if (failed > 0) {
  console.log('\n⚠️  NON-CRITICAL ISSUES DETECTED')
  console.log('   Deployment can proceed, but address warnings if possible.')
  process.exit(0)
} else {
  console.log('\n🎉 ALL CHECKS PASSED!')
  console.log('\n✅ Your system is ready for deployment.')
  console.log('\n📋 NEXT STEPS:')
  console.log('   1. Open Supabase Dashboard → SQL Editor')
  console.log('   2. Run: supabase/ALL_IN_ONE_SETUP.sql')
  console.log('   3. Run: npm run seed:questions')
  console.log('   4. Verify: 120 questions imported')
  console.log('\n🚀 See DEPLOYMENT_READY.md for detailed instructions.')
  process.exit(0)
}
