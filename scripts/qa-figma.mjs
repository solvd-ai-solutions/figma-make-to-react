#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

async function main() {
  try {
    const args = process.argv.slice(2)
    const strict = args.includes('--strict')
    
    const generatedDir = path.join(process.cwd(), '.generated')
    await fs.mkdir(generatedDir, { recursive: true })
    
    const report = {
      timestamp: new Date().toISOString(),
      checks: [],
      summary: {
        passed: 0,
        failed: 0,
        total: 0
      }
    }
    
    // Check if required directories exist
    const requiredDirs = [
      'src/components/generated',
      'src/styles',
      'src/app'
    ]
    
    for (const dir of requiredDirs) {
      try {
        await fs.access(path.join(process.cwd(), dir))
        report.checks.push({
          check: `Directory exists: ${dir}`,
          status: 'PASS',
          details: 'Directory found'
        })
        report.summary.passed++
      } catch (error) {
        report.checks.push({
          check: `Directory exists: ${dir}`,
          status: 'FAIL',
          details: 'Directory not found'
        })
        report.summary.failed++
      }
      report.summary.total++
    }
    
    // Check if generated components exist
    try {
      const genDir = path.join(process.cwd(), 'src/components/generated')
      const files = await fs.readdir(genDir)
      const tsxFiles = files.filter(f => f.endsWith('.tsx'))
      
      if (tsxFiles.length > 0) {
        report.checks.push({
          check: 'Generated components exist',
          status: 'PASS',
          details: `${tsxFiles.length} components found`
        })
        report.summary.passed++
      } else {
        report.checks.push({
          check: 'Generated components exist',
          status: 'FAIL',
          details: 'No components found'
        })
        report.summary.failed++
      }
      report.summary.total++
    } catch (error) {
      report.checks.push({
        check: 'Generated components exist',
        status: 'FAIL',
        details: 'Could not access components directory'
      })
      report.summary.failed++
      report.summary.total++
    }
    
    // Write QA report
    const reportPath = path.join(generatedDir, 'qa-report.json')
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
    
    console.log('✓ QA Report generated:', reportPath)
    console.log(`Summary: ${report.summary.passed}/${report.summary.total} checks passed`)
    
    if (strict && report.summary.failed > 0) {
      console.error('❌ QA checks failed in strict mode')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('Error running QA:', error)
    process.exit(1)
  }
}

main()
