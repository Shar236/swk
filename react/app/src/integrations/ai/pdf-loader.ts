import { KNOWLEDGE_BASE } from '@/data/knowledge';

export interface PdfDocument {
  title: string;
  content: string;
  chunks: string[];
}

export interface KnowledgeBase {
  documents: PdfDocument[];
  combinedContent: string;
}


export class PdfLoader {
  private knowledgeBase: KnowledgeBase | null = null;

  async loadAllPdfs(): Promise<KnowledgeBase> {
    if (this.knowledgeBase) {
      return this.knowledgeBase;
    }

    const documents: PdfDocument[] = KNOWLEDGE_BASE.map(doc => ({
      title: doc.filename.replace('.pdf', ''),
      content: doc.content,
      chunks: this.chunkText(doc.content, 1000)
    }));

    const combinedContent = documents.map(doc => doc.content).join('\n\n');
    
    this.knowledgeBase = {
      documents,
      combinedContent
    };

    return this.knowledgeBase;
  }

  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  findRelevantContent(query: string, topK: number = 3): string[] {
    if (!this.knowledgeBase) {
      return [];
    }

    // Simple keyword-based search (in production, use embeddings or more sophisticated search)
    const queryLower = query.toLowerCase();
    const results: { content: string; score: number }[] = [];

    for (const doc of this.knowledgeBase.documents) {
      for (const chunk of doc.chunks) {
        const score = this.calculateRelevanceScore(chunk.toLowerCase(), queryLower);
        if (score > 0) {
          results.push({ content: chunk, score });
        }
      }
    }

    // Sort by score and return top K
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => item.content);
  }

  private calculateRelevanceScore(chunk: string, query: string): number {
    const queryWords = query.split(/\s+/);
    let score = 0;

    for (const word of queryWords) {
      if (chunk.includes(word)) {
        score += 1;
      }
    }

    return score;
  }

  getKnowledgeBase(): KnowledgeBase | null {
    return this.knowledgeBase;
  }
}

// Export singleton instance
export const pdfLoader = new PdfLoader();