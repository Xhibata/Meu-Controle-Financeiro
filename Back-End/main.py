from fastapi import FastAPI

app = FastAPI(
    title="API Financeiro",
    version="1.0.0"
)

@app.get("/")
def home():
    return {"mensagem": "API funcionando!"}