const DEFAULT_JUDGE0_URL = "https://ce.judge0.com";

export async function executeCode(sourceCode: string, languageId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_JUDGE0_URL || DEFAULT_JUDGE0_URL;
  const url = `${baseUrl.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_code: sourceCode,
      language_id: languageId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Execution failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    compile_output: result.compile_output ?? "",
  };
}
