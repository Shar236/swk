#!/usr/bin/env node

/**
 * RAHI Code Quality Automation Script
 * Frontend + Backend (MongoDB) code review automation
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = process.cwd();

// ======================
// Configuration
// ======================
const CONFIG = {
  frontendPaths: [
    "src/components/",
    "src/pages/",
    "src/hooks/",
    "src/contexts/"
  ],
  databasePaths: [
    "backend/database/",
    "backend/models/",
    "backend/schemas/"
  ],
  ignorePatterns: [
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage"
  ]
};

// ======================
// Database Schema Review
// ======================
async function reviewDatabaseSchema() {
  console.log("🔍 Analyzing backend database schema (MongoDB)...\n");

  const schemaFiles = [];

  CONFIG.databasePaths.forEach(dir => {
    const fullDir = path.join(PROJECT_ROOT, dir);
    if (!fs.existsSync(fullDir)) return;

    const files = fs.readdirSync(fullDir)
      .filter(f => f.match(/\.(js|ts)$/));

    files.forEach(file => {
      schemaFiles.push({
        name: file,
        path: path.join(fullDir, file)
      });
    });
  });

  if (schemaFiles.length === 0) {
    console.log("⚠️ No database schema files found. Skipping DB review.\n");
    return;
  }

  console.log(`Found ${schemaFiles.length} schema files:`);
  schemaFiles.forEach(f => console.log(`  - ${f.name}`));

  console.log(
    "\n💡 Tip: Review indexes, validation rules, and relations in MongoDB schemas\n"
  );
}

// ======================
// Frontend Code Review
// ======================
async function reviewFrontendCode() {
  console.log("📋 Reviewing frontend code...\n");

  const filesToReview = [];

  function collectFiles(dir, prefix = "") {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(prefix, item);

      if (CONFIG.ignorePatterns.some(p => relativePath.includes(p))) return;

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        collectFiles(fullPath, relativePath);
      } else if (item.match(/\.(tsx|ts|jsx|js)$/)) {
        filesToReview.push({ relativePath });
      }
    });
  }

  CONFIG.frontendPaths.forEach(dir =>
    collectFiles(path.join(PROJECT_ROOT, dir), dir)
  );

  console.log(`Found ${filesToReview.length} frontend files to review`);

  console.log("\nSample files:");
  filesToReview.slice(0, 5).forEach(f =>
    console.log(`  - ${f.relativePath}`)
  );

  console.log(
    "\n💡 Tip: Use component splitting & memoization where needed\n"
  );
}

// ======================
// Run ESLint
// ======================
function runESLint() {
  console.log("🧹 Running ESLint...\n");
  try {
    execSync("npx eslint src/ --ext .ts,.tsx,.js,.jsx", {
      cwd: PROJECT_ROOT,
      stdio: "inherit"
    });
  } catch {
    console.log("⚠️ ESLint found issues.\n");
  }
}

// ======================
// Run TypeScript Check
// ======================
function runTypeCheck() {
  console.log("🔍 Running TypeScript check...\n");
  try {
    execSync("npx tsc --noEmit", {
      cwd: PROJECT_ROOT,
      stdio: "inherit"
    });
    console.log("✅ TypeScript check passed\n");
  } catch {
    console.log("❌ TypeScript errors found\n");
  }
}

// ======================
// Main Execution
// ======================
async function main() {
  console.log("🚀 RAHI Code Quality Check");
  console.log("=".repeat(50));

  await reviewDatabaseSchema();
  await reviewFrontendCode();
  runESLint();
  runTypeCheck();

  console.log("✨ Code quality check completed!\n");
}

main().catch(console.error);
