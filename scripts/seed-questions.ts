/**
 * Seed Script: Import Questions from Markdown Files
 * 
 * Purpose: Parse Georgian MCQ questions from .md files and insert into Supabase
 * Input: 6 markdown files (მათემატიკა.md, ბიოლოგია.md, etc.)
 * Output: 120 questions + 480 options in database
 * 
 * Usage: tsx scripts/seed-questions.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

interface ParsedQuestion {
  prompt: string
  options: Array<{
    letter: string // ა, ბ, გ, დ
    text: string
  }>
  correctAnswer: string
}

/**
 * Parse markdown file to extract MCQ questions
 * Expected format:
 * 1. Question text?
 * ა) Option A
 * ბ) Option B
 * გ) Option C
 * დ) Option D
 * სწორი პასუხი: ბ)
 */
function parseMarkdownFile(filePath: string): ParsedQuestion[] {
  console.log(`  📄 Reading: ${path.basename(filePath)}`)
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const questions: ParsedQuestion[] = []
  
  // Split by question number (1., 2., 3., etc.)
  const blocks = content.split(/\n\d+\.\s+/)
  
  // Process each question block
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].trim()
    if (!block) continue
    
    const lines = block.split('\n')
    const prompt = lines[0].trim()
    
    const options: Array<{ letter: string; text: string }> = []
    let correctAnswer = ''
    
    // Extract options and correct answer
    for (const line of lines.slice(1)) {
      // Match option: ა) text
      const optionMatch = line.match(/^([ა-დ])\)\s*(.+)/)
      if (optionMatch) {
        options.push({
          letter: optionMatch[1],
          text: optionMatch[2].trim()
        })
      }
      
      // Match correct answer: სწორი პასუხი: ბ)
      const correctMatch = line.match(/სწორი პასუხი:\s*([ა-დ])\)/)
      if (correctMatch) {
        correctAnswer = correctMatch[1]
      }
    }
    
    // Validate question
    if (!prompt) {
      console.warn(`  ⚠️  Question ${i}: Missing prompt`)
      continue
    }
    if (options.length !== 4) {
      console.warn(`  ⚠️  Question ${i}: Expected 4 options, found ${options.length}`)
      continue
    }
    if (!correctAnswer) {
      console.warn(`  ⚠️  Question ${i}: Missing correct answer`)
      continue
    }
    
    questions.push({ prompt, options, correctAnswer })
  }
  
  console.log(`  ✓ Parsed ${questions.length} questions`)
  return questions
}

/**
 * Determine difficulty level based on question position
 * Questions 1-7: Easy (1)
 * Questions 8-14: Medium (2)
 * Questions 15-20: Hard (3)
 */
function getDifficulty(index: number): number {
  if (index < 7) return 1
  if (index < 14) return 2
  return 3
}

/**
 * Seed questions for a specific lesson
 */
async function seedLesson(
  lessonSlug: string,
  mdFilePath: string,
  subjectName: string
): Promise<void> {
  console.log(`\n📚 ${subjectName}`)
  
  // Get lesson ID from database
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('slug', lessonSlug)
    .single()
  
  if (lessonError || !lesson) {
    console.error(`  ❌ Lesson not found: ${lessonSlug}`)
    console.error(`     Error:`, lessonError?.message)
    return
  }
  
  console.log(`  ✓ Found lesson: ${lesson.id}`)
  
  // Parse markdown file
  const questions = parseMarkdownFile(mdFilePath)
  
  if (questions.length === 0) {
    console.error(`  ❌ No questions parsed from file`)
    return
  }
  
  let successCount = 0
  
  // Insert each question and its options
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const difficulty = getDifficulty(i)
    const points = difficulty === 3 ? 2 : 1
    
    try {
      // Insert question
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
          lesson_id: lesson.id,
          type: 'mcq',
          prompt_md: q.prompt,
          stem_ka: q.prompt,  // Georgian prompt
          difficulty: difficulty === 1 ? 'easy' : difficulty === 2 ? 'medium' : 'hard',
          difficulty_level: difficulty,  // Numeric difficulty (1-3)
          order_index: i + 1,
          points,
          correct_answer: {}  // Required field, will be populated from options
        })
        .select()
        .single()
      
      if (questionError) {
        console.error(`  ❌ Q${i + 1} insert failed:`, questionError.message)
        continue
      }
      
      // Insert options
      let optionErrors = 0
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j]
        
        const { error: optionError } = await supabase
          .from('question_options')
          .insert({
            question_id: question.id,
            label_ka: opt.text,
            is_correct: opt.letter === q.correctAnswer,
            order_index: j
          })
        
        if (optionError) {
          console.error(`  ❌ Q${i + 1} option ${opt.letter} failed:`, optionError.message)
          optionErrors++
        }
      }
      
      if (optionErrors === 0) {
        successCount++
      }
      
    } catch (error) {
      console.error(`  ❌ Q${i + 1} unexpected error:`, error)
    }
  }
  
  console.log(`  ✅ Imported ${successCount}/${questions.length} questions`)
}

/**
 * Main execution function
 */
async function main() {
  console.log('🌱 Starting question import from markdown files\n')
  console.log('=' .repeat(60))
  
  const baseDir = path.resolve(__dirname, '..')
  
  const subjects = [
    {
      name: 'მათემატიკა (Mathematics)',
      lessonSlug: 'math-7-basics',
      file: path.join(baseDir, 'მათემატიკა.md')
    },
    {
      name: 'ბიოლოგია (Biology)',
      lessonSlug: 'bio-7-basics',
      file: path.join(baseDir, 'ბიოლოგია.md')
    },
    {
      name: 'ისტორია (History)',
      lessonSlug: 'hist-7-basics',
      file: path.join(baseDir, 'ისტორია.md')
    },
    {
      name: 'გეოგრაფია (Geography)',
      lessonSlug: 'geo-7-basics',
      file: path.join(baseDir, 'გეოგრაფია.md')
    },
    {
      name: 'ინგლისური (English)',
      lessonSlug: 'eng-7-basics',
      file: path.join(baseDir, 'ინგლისური.md')
    },
    {
      name: 'ქართული (Georgian Language)',
      lessonSlug: 'ka-7-basics',
      file: path.join(baseDir, 'ქართული.md')
    }
  ]
  
  let totalSuccess = 0
  let totalAttempts = 0
  
  // Process each subject
  for (const subject of subjects) {
    if (!fs.existsSync(subject.file)) {
      console.error(`\n❌ File not found: ${subject.file}`)
      continue
    }
    
    await seedLesson(subject.lessonSlug, subject.file, subject.name)
    totalAttempts += 20 // Expected 20 questions per subject
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🎉 Import complete!\n')
  
  // Verification queries
  console.log('📊 Verification (run these in Supabase SQL editor):')
  console.log('   1. SELECT COUNT(*) FROM questions;')
  console.log('   2. SELECT COUNT(*) FROM question_options;')
  console.log('   3. SELECT l.title, COUNT(q.id) as q_count')
  console.log('      FROM lessons l')
  console.log('      LEFT JOIN questions q ON l.id = q.lesson_id')
  console.log('      GROUP BY l.title')
  console.log('      ORDER BY l.title;')
}

// Execute
main()
  .then(() => {
    console.log('\n✅ Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed with error:', error)
    process.exit(1)
  })
