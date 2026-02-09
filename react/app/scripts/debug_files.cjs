#!/usr/bin/env node

/**
 * RAHI Debug Utility
 * Lists important backend + frontend files for debugging
 */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();

const IMPORTANT_PATHS = [
  "backend",
  "src",
  "infrastructure",
  ".env",
  "docker-compose.yml"
];

function walk(dir, depth = 0) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      console.log(" ".repeat(depth * 2) + "📁 " + item);
      walk(fullPath, depth + 1);
    } else {
      console.log(" ".repeat(depth * 2) + "📄 " + item);
    }
  });
}

console.log("🛠️ RAHI Debug File Structure\n");
IMPORTANT_PATHS.forEach(p => {
  const fullPath = path.join(PROJECT_ROOT, p);
  if (fs.existsSync(fullPath)) {
    console.log(`\n=== ${p} ===`);
    walk(fullPath);
  }
});

console.log("\n✅ Debug scan completed\n");
