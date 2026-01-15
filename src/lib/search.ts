import fs from "fs";

export async function findRelevantChunks(query: string, topK = 3) {
  try {
    const chatData = JSON.parse(
      fs.readFileSync("src/data/chatData.json", "utf-8")
    );

    const queryLower = query.toLowerCase();
    const results = chatData
      .map((item: any) => ({
        ...item,
        score: item.content.toLowerCase().includes(queryLower) ? 1 : 0.1,
      }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, topK);

    return results;
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}
