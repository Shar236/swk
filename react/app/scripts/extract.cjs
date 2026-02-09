/**
 * Knowledge Extractor (Node.js)
 * Converts JSON/text resources into backend-ready data
 */

const fs = require("fs");
const path = require("path");

const INPUT_DIR = "resources";
const OUTPUT_FILE = "backend/data/knowledge.json";

if (!fs.existsSync(INPUT_DIR)) {
  console.log("❌ Resource folder not found");
  process.exit(1);
}

const knowledgeBase = [];

fs.readdirSync(INPUT_DIR).forEach(file => {
  if (file.endsWith(".txt") || file.endsWith(".json")) {
    const content = fs.readFileSync(path.join(INPUT_DIR, file), "utf-8");
    knowledgeBase.push({
      source: file,
      content: content.trim()
    });
    console.log(`✅ Processed ${file}`);
  }
});

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase, null, 2));

console.log(`\n🚀 Knowledge written to ${OUTPUT_FILE}`);
