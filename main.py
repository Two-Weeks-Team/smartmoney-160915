from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from routes import router

app = FastAPI()


@app.middleware("http")
async def normalize_api_prefix(request: Request, call_next):
    if request.scope.get("path", "").startswith("/api/"):
        request.scope["path"] = request.scope["path"][4:] or "/"
    return await call_next(request)

app.include_router(router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.get("/", response_class=HTMLResponse)
async def root() -> str:
    html = """
    <html>
    <head>
        <title>SmartMoney – AI‑Powered Finance Tracker</title>
        <style>
            body {background:#1e1e2e; color:#e2e8f0; font-family:Arial,Helvetica,sans-serif; padding:2rem;}
            h1 {color:#3b82f6;}
            a {color:#60a5fa; text-decoration:none;}
            a:hover {text-decoration:underline;}
            .endpoint {margin-bottom:1rem;}
            .code {background:#2d2d44; padding:0.2rem 0.4rem; border-radius:4px; font-family:monospace;}
            .footer {margin-top:2rem; font-size:0.9rem; color:#a1a1aa;}
        </style>
    </head>
    <body>
        <h1>SmartMoney</h1>
        <p>Transform your finances with AI‑powered insights.</p>
        <h2>Available API Endpoints</h2>
        <div class="endpoint"><strong>GET</strong> <span class="code">/health</span> – health check</div>
        <div class="endpoint"><strong>POST</strong> <span class="code">/analyze-transactions</span> – AI analysis of uploaded transactions</div>
        <div class="endpoint"><strong>POST</strong> <span class="code">/generate-goals</span> – AI‑driven savings‑goal simulations</div>
        <h2>Tech Stack</h2>
        <ul>
            <li>FastAPI 0.115.0 (Python 3.12+)</li>
            <li>PostgreSQL via SQLAlchemy 2.0.35</li>
            <li>DigitalOcean Serverless Inference (model: openai‑gpt‑oss‑120b)</li>
        </ul>
        <p>Explore the interactive docs: <a href="/docs">/docs</a> | <a href="/redoc">/redoc</a></p>
        <div class="footer">© 2024 SmartMoney – All rights reserved.</div>
    </body>
    </html>
    """
    return html
