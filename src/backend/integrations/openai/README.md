# OpenAI Integration Boundary

Future OpenAI API calls should be implemented server-side only.

Recommended shape:

- Add feature-specific routes under `src/backend/http` or `src/backend/<feature>`.
- Keep prompts, request validation, rate limits, and cost controls in backend code.
- Read `OPENAI_API_KEY` only from server environment variables.
- Never send API keys, raw internal prompts, or privileged system instructions to Angular.
- Store audit records for user-triggered AI features before adding persistence-heavy workflows.

Likely future features:

- Editorial summarization for internal/admin workflows.
- Semantic article search with embeddings.
- Startup-directory enrichment from trusted editorial sources.
- Report generation jobs using background workers, not request/response handlers.
