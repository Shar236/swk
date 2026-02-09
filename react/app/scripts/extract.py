import os
import json
from pypdf import PdfReader

PDF_DIR = "resources/pdf"
OUTPUT_FILE = "backend/data/knowledge.json"

def extract_text():
    if not os.path.exists(PDF_DIR):
        print("❌ PDF folder not found")
        return

    knowledge = []

    for filename in os.listdir(PDF_DIR):
        if filename.lower().endswith(".pdf"):
            path = os.path.join(PDF_DIR, filename)
            print(f"📄 Processing {filename}")

            try:
                reader = PdfReader(path)
                text = ""

                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"

                clean = " ".join(text.split())
                if clean:
                    knowledge.append({
                        "source": filename,
                        "content": clean,
                        "pages": len(reader.pages)
                    })
                    print("  ✅ Success")
                else:
                    print("  ⚠️ No text found")

            except Exception as e:
                print(f"  ❌ Error: {e}")

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(knowledge, f, indent=2, ensure_ascii=False)

    print(f"\n🚀 Knowledge saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    extract_text()
