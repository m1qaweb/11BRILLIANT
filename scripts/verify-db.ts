// Quick database connection verification script
import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function verifyDatabase() {
  console.log('🔍 Verifying Supabase connection...\n')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test 1: Check subjects
    console.log('1️⃣ Checking subjects table...')
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
    
    if (subjectsError) throw subjectsError
    console.log(`   ✅ Found ${subjects?.length || 0} subject(s)`)
    if (subjects && subjects.length > 0) {
      console.log(`   📚 ${subjects[0].title} - ${subjects[0].description}`)
    }
    
    // Test 2: Check courses
    console.log('\n2️⃣ Checking courses table...')
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
    
    if (coursesError) throw coursesError
    console.log(`   ✅ Found ${courses?.length || 0} course(s)`)
    if (courses && courses.length > 0) {
      console.log(`   📖 ${courses[0].title} - Difficulty: ${courses[0].difficulty}`)
    }
    
    // Test 3: Check lessons
    console.log('\n3️⃣ Checking lessons table...')
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
    
    if (lessonsError) throw lessonsError
    console.log(`   ✅ Found ${lessons?.length || 0} lesson(s)`)
    if (lessons && lessons.length > 0) {
      console.log(`   📝 ${lessons[0].title} - ${lessons[0].estimated_minutes} min`)
    }
    
    // Test 4: Check questions
    console.log('\n4️⃣ Checking questions table...')
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
    
    if (questionsError) throw questionsError
    console.log(`   ✅ Found ${questions?.length || 0} question(s)`)
    if (questions && questions.length > 0) {
      const types = questions.map(q => q.type).join(', ')
      console.log(`   ❓ Question types: ${types}`)
    }
    
    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('🎉 DATABASE VERIFICATION COMPLETE!')
    console.log('='.repeat(50))
    console.log(`✅ Subjects: ${subjects?.length || 0}`)
    console.log(`✅ Courses: ${courses?.length || 0}`)
    console.log(`✅ Lessons: ${lessons?.length || 0}`)
    console.log(`✅ Questions: ${questions?.length || 0}`)
    console.log('\n✨ Your database is ready for testing!')
    console.log('\n📍 Next step: Visit http://localhost:3000')
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error)
    console.error('\n💡 Troubleshooting:')
    console.error('   1. Check your .env.local has correct keys')
    console.error('   2. Verify you ran the migration SQL in Supabase')
    console.error('   3. Verify you ran the seed.sql in Supabase')
    console.error('   4. Check your Supabase project is active (not paused)')
    process.exit(1)
  }
}

verifyDatabase()
