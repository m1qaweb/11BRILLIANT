#!/usr/bin/env python3
"""
Split PLAN.MD into multiple manageable documentation files
"""
import os
import re

# Source and target
SOURCE_FILE = r"d:\11BRILLIANT\PLAN.MD"
DOCS_DIR = r"d:\11BRILLIANT\docs"

# Ensure docs directory exists
os.makedirs(DOCS_DIR, exist_ok=True)

# Read the entire file
with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Define sections with their line ranges (approximate)
sections = [
    {
        'file': '01-vision-and-tech-stack.md',
        'title': 'Vision & Tech Stack',
        'start_pattern': r'# PLAN\.md',
        'end_pattern': r'## 2\. Core Domain Model',
        'description': 'Project vision, constraints, and complete technology stack'
    },
    {
        'file': '02-database-schema.md',
        'title': 'Database Schema',
        'start_pattern': r'## 2\. Core Domain Model',
        'end_pattern': r'## 3\. Supabase Setup Plan',
        'description': '13 tables with complete DDL, indexes, and constraints'
    },
    {
        'file': '03-supabase-setup.md',
        'title': 'Supabase Setup',
        'start_pattern': r'## 3\. Supabase Setup Plan',
        'end_pattern': r'## 4\. Next',
        'description': 'Authentication, RLS policies, storage configuration'
    },
    {
        'file': '04-nextjs-structure.md',
        'title': 'Next.js Application Structure',
        'start_pattern': r'## 4\. Next',
        'end_pattern': r'## 5\. Question Engine',
        'description': 'File structure, routing, and Supabase client setup'
    },
    {
        'file': '05-question-engine.md',
        'title': 'Question Engine & Grading',
        'start_pattern': r'## 5\. Question Engine',
        'end_pattern': r'## 6\. Progress',
        'description': 'Question types, grading logic, and validation rules'
    },
    {
        'file': '06-progress-and-streaks.md',
        'title': 'Progress & Streaks',
        'start_pattern': r'## 6\. Progress',
        'end_pattern': r'## 7\. Subscriptions',
        'description': 'Streak tracking, completion logic, recommendations'
    },
    {
        'file': '07-subscriptions.md',
        'title': 'Subscriptions & Access Control',
        'start_pattern': r'## 7\. Subscriptions',
        'end_pattern': r'## 8\. Content Authoring',
        'description': 'Stripe integration and premium content gating'
    },
    {
        'file': '08-content-authoring.md',
        'title': 'Content Authoring',
        'start_pattern': r'## 8\. Content Authoring',
        'end_pattern': r'## 9\. Performance',
        'description': 'Admin CMS and content creation workflows'
    },
    {
        'file': '09-performance.md',
        'title': 'Performance & Scaling',
        'start_pattern': r'## 9\. Performance',
        'end_pattern': r'## 10\. Security',
        'description': 'Database optimization and caching strategies'
    },
    {
        'file': '10-security.md',
        'title': 'Security & Privacy',
        'start_pattern': r'## 10\. Security',
        'end_pattern': r'## 11\. Testing',
        'description': 'RLS policies, admin bootstrap, and security measures'
    },
    {
        'file': '11-testing.md',
        'title': 'Testing Strategy',
        'start_pattern': r'## 11\. Testing',
        'end_pattern': r'## 12\. Local Development',
        'description': 'Unit, integration, E2E tests, and CI/CD pipeline'
    },
    {
        'file': '12-local-development.md',
        'title': 'Local Development Setup',
        'start_pattern': r'## 12\. Local Development',
        'end_pattern': r'## 13\. Deployment',
        'description': 'Prerequisites, installation, and troubleshooting'
    },
    {
        'file': '13-deployment.md',
        'title': 'Deployment Checklist',
        'start_pattern': r'## 13\. Deployment',
        'end_pattern': r'## 14\. Development Roadmap',
        'description': 'Pre-production setup and post-launch tasks'
    },
    {
        'file': '14-roadmap.md',
        'title': 'Development Roadmap',
        'start_pattern': r'## 14\. Development Roadmap',
        'end_pattern': r'## 15\. Legal',
        'description': '5-phase implementation plan with timelines'
    },
    {
        'file': '15-legal-compliance.md',
        'title': 'Legal & Compliance',
        'start_pattern': r'## 15\. Legal',
        'end_pattern': r'## 16\. Guiding Principles',
        'description': 'GDPR, COPPA, accessibility, and privacy requirements'
    },
    {
        'file': '16-principles-and-next-steps.md',
        'title': 'Guiding Principles & Next Steps',
        'start_pattern': r'## 16\. Guiding Principles',
        'end_pattern': r'$',  # End of file
        'description': 'Core principles and immediate action items'
    }
]

def extract_section(content, start_pattern, end_pattern):
    """Extract content between two regex patterns"""
    start_match = re.search(start_pattern, content, re.MULTILINE)
    if not start_match:
        return None
    
    start_pos = start_match.start()
    
    if end_pattern == '$':
        # Till end of file
        return content[start_pos:]
    
    end_match = re.search(end_pattern, content[start_pos:], re.MULTILINE)
    if not end_match:
        return content[start_pos:]
    
    end_pos = start_pos + end_match.start()
    return content[start_pos:end_pos].strip()

# Process each section
print(f"Splitting {SOURCE_FILE} into {len(sections)} files...\n")

for i, section in enumerate(sections):
    target_path = os.path.join(DOCS_DIR, section['file'])
    
    # Extract content
    section_content = extract_section(content, section['start_pattern'], section['end_pattern'])
    
    if not section_content:
        print(f"❌ Failed: {section['file']} - Pattern not found")
        continue
    
    # Create header with navigation
    prev_link = f"[← Previous]({sections[i-1]['file']})" if i > 0 else "[← Index](README.md)"
    next_link = f"[Next →]({sections[i+1]['file']})" if i < len(sections)-1 else "[Index](README.md)"
    
    header = f"""# {section['title']}

> Part of the [Brilliant-Style Learning Platform Documentation](README.md)

**{section['description']}**

**Navigation:** {prev_link} | [Index](README.md) | {next_link}

---

"""
    
    # Combine header and content
    full_content = header + section_content
    
    # Write to file
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    print(f"✅ Created: {section['file']} ({len(section_content)} chars)")

print(f"\n✨ Split complete! {len(sections)} files created in {DOCS_DIR}")
print(f"📄 Original file preserved at: {SOURCE_FILE}")
print(f"\n👉 Start here: {os.path.join(DOCS_DIR, 'README.md')}")
