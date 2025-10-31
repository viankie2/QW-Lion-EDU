// services/geminiService.ts  —— no-axios, vite-friendly

export type RecommendInput = {
  score: number;
  province?: string;
  cityPreference?: string;
  subjects?: string[];
  vibe?: "S" | "M" | "H";
};

export type Recommendation = {
  name: string;
  qsRank?: number;
  city?: string;
  country?: string;
  rationale: string;
  tier: "Match" | "Reach" | "Safe";
};

const API_PATH = "/api/qwen";

const M_STYLE_GUIDE = `
你是“会聊天的升学顾问”，说话自然、有温度、有判断。
面向对象：想在 QS 前 200 的大学里做更合适选择的学生（或家长）。

**硬性规则（必须遵守）**
- 只推荐 QS 排名 **前 200** 的大学，无法满足时请明确说明“分数与偏好在 QS200 内可选项非常有限”，宁缺毋滥。
- 每所学校必须附带：**QS 排名（具体数字） + 所在城市/国家**。
- 输出结构为分层梯度：
  1) Match（匹配度最高）2-3 所
  2) Reach（略冲但值得）1-2 所
  3) Safe（稳妥保底）1-2 所
- 语言风格：M 中度——自然、共情、不过度热情；避免命令句和空话。

**评估逻辑（请在脑内完成并体现在理由里）**
- 结合用户分数、城市偏好、学科关键词，解释“为什么”这所学校适合（或值得一冲/更稳）。
- 城市维度考虑：就业机会、行业集中度、生活成本/幸福感。
- 学校维度考虑：学科强项、国际化、校友网络。
- 如果城市偏好与学科资源冲突，明确两套路径的权衡结论。

**输出 JSON**
仅输出一个 JSON 对象，不要额外文字：
{
  "summary": "一段 2-3 句的总评，口吻自然。",
  "recommendations": [
    { "name": "...", "qsRank": 23, "city": "上海", "country": "中国", "tier": "Match", "rationale": "..." }
  ]
}
`;

function buildPrompt(input: RecommendInput): string {
  const { score, province, cityPreference, subjects } = input;
  const subjectText = subjects?.length ? subjects.join(", ") : "未指定";
  const cp = cityPreference || "未指定";
  return `
${M_STYLE_GUIDE}

【用户画像】
- 分数：${score}
- 省份：${province || "未提供"}
- 城市偏好：${cp}
- 学科偏好：${subjectText}

【任务】
基于上述信息，给出 QS 前 200 的大学推荐，严格输出 JSON（不要 Markdown、不要代码块）。
  `.trim();
}

export async function recommendUniversities(
  input: RecommendInput
): Promise<{ summary: string; recommendations: Recommendation[] }> {
  const prompt = buildPrompt(input);

  const resp = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "qwen-plus", prompt })
  });

  if (!resp.ok) {
    const msg = await resp.text().catch(() => "");
    throw new Error(`Qwen API failed: ${resp.status} ${msg}`);
  }

  const data = await resp.json().catch(() => ({} as any));
  const text: string = data?.output?.text || "";

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : { summary: "", recommendations: [] };
  }

  const recs = (parsed.recommendations || []).filter((r: any) => {
    if (typeof r.qsRank === "number") return r.qsRank <= 200;
    return true; // 没给 rank 也先保留（prompt 已强制要求返回）
  });

  return {
    summary: parsed.summary || "",
    recommendations: recs as Recommendation[]
  };
}
