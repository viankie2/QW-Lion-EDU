export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/qwen") {
      return new Response("Not Found", { status: 404 });
    }

    // Read inbound payload
    const inbound = await request.json().catch(() => ({}));

    // Build DashScope payload (text-generation)
    const payload = {
      model: inbound.model || "qwen-plus",
      input: {
        prompt: inbound.prompt || ""
      },
      parameters: {
        // temperature slightly lowered for admissions-style determinism
        temperature: 0.6,
        result_format: "text"
      }
    };

    const resp = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // Pass through body & status
    return new Response(resp.body, {
      status: resp.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}