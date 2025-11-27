# PowerShell script to split PLAN.MD into multiple files

$sourcePath = "d:\11BRILLIANT\PLAN.MD"
$targetDir = "d:\11BRILLIANT\docs"

# Read the entire file
$content = Get-Content $sourcePath -Raw

# Define section markers and their target files
$sections = @(
    @{Pattern = '(?s)^# PLAN\.md.*?(?=## 2\. Core Domain Model)'; File = '01-vision-and-tech-stack.md'; Name = 'Vision & Tech Stack'}
    @{Pattern = '(?s)(## 2\. Core Domain Model.*?)(?=## 3\. Supabase Setup Plan)'; File = '02-database-schema.md'; Name = 'Database Schema'}
    @{Pattern = '(?s)(## 3\. Supabase Setup Plan.*?)(?=## 4\. Next\.js Application Structure)'; File = '03-supabase-setup.md'; Name = 'Supabase Setup'}
    @{Pattern = '(?s)(## 4\. Next\.js Application Structure.*?)(?=## 5\. Question Engine)'; File = '04-nextjs-structure.md'; Name = 'Next.js Structure'}
    @{Pattern = '(?s)(## 5\. Question Engine & Interactivity.*?)(?=## 6\. Progress)'; File = '05-question-engine.md'; Name = 'Question Engine'}
    @{Pattern = '(?s)(## 6\. Progress, Streaks, and Recommendations.*?)(?=## 7\. Subscriptions)'; File = '06-progress-and-streaks.md'; Name = 'Progress & Streaks'}
    @{Pattern = '(?s)(## 7\. Subscriptions & Access Control.*?)(?=## 8\. Content Authoring)'; File = '07-subscriptions.md'; Name = 'Subscriptions'}
    @{Pattern = '(?s)(## 8\. Content Authoring Workflow.*?)(?=## 9\. Performance)'; File = '08-content-authoring.md'; Name = 'Content Authoring'}
    @{Pattern = '(?s)(## 9\. Performance & Scaling.*?)(?=## 10\. Security)'; File = '09-performance.md'; Name = 'Performance'}
    @{Pattern = '(?s)(## 10\. Security & Privacy.*?)(?=## 11\. Testing)'; File = '10-security.md'; Name = 'Security'}
    @{Pattern = '(?s)(## 11\. Testing Strategy.*?)(?=## 12\. Local Development)'; File = '11-testing.md'; Name = 'Testing'}
    @{Pattern = '(?s)(## 12\. Local Development Setup.*?)(?=## 13\. Deployment)'; File = '12-local-development.md'; Name = 'Local Development'}
    @{Pattern = '(?s)(## 13\. Deployment Checklist.*?)(?=## 14\. Development Roadmap)'; File = '13-deployment.md'; Name = 'Deployment'}
    @{Pattern = '(?s)(## 14\. Development Roadmap.*?)(?=## 15\. Legal)'; File = '14-roadmap.md'; Name = 'Roadmap'}
    @{Pattern = '(?s)(## 15\. Legal & Compliance Requirements.*?)(?=## 16\. Guiding Principles)'; File = '15-legal-compliance.md'; Name = 'Legal & Compliance'}
    @{Pattern = '(?s)(## 16\. Guiding Principles.*?$)'; File = '16-principles-and-next-steps.md'; Name = 'Principles & Next Steps'}
)

Write-Host "Splitting PLAN.MD into $($sections.Count) files..." -ForegroundColor Cyan

foreach ($section in $sections) {
    $targetPath = Join-Path $targetDir $section.File
    
    if ($content -match $section.Pattern) {
        $sectionContent = $Matches[0]
        
        # Clean up the content
        $sectionContent = $sectionContent -replace '(?m)^---\s*$',''  # Remove --- separators
        $sectionContent = $sectionContent.Trim()
        
        # Add navigation header
        $header = @"
# $($section.Name)

> Part of the [Brilliant-Style Learning Platform Documentation](README.md)

**Navigation:** [← Back to Index](README.md) | [Next Section →]($(($sections.IndexOf($section) + 1).ToString().PadLeft(2,'0'))-*.md)

---

"@
        
        $fullContent = $header + "`n" + $sectionContent
        
        # Write to file
        Set-Content -Path $targetPath -Value $fullContent -Encoding UTF8
        Write-Host "✓ Created: $($section.File)" -ForegroundColor Green
    } else {
        Write-Host "✗ Pattern not found for: $($section.File)" -ForegroundColor Red
    }
}

Write-Host "`nSplit complete! Files created in: $targetDir" -ForegroundColor Green
Write-Host "Original file preserved at: $sourcePath" -ForegroundColor Yellow
