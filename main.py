"""
Horror Heroes Quiz
A progressive quiz game featuring Garten of Banban, Poppy Playtime, and FNAF characters
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
from pathlib import Path

app = FastAPI(title="Horror Heroes Quiz")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Load questions
QUESTIONS_FILE = Path("data/questions.json")
with open(QUESTIONS_FILE) as f:
    quiz_data = json.load(f)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Home page"""
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/levels")
async def get_levels():
    """Get all levels metadata"""
    levels = [
        {
            "id": level["id"],
            "name": level["name"],
            "description": level["description"],
            "question_count": len(level["questions"])
        }
        for level in quiz_data["levels"]
    ]
    return {"levels": levels}


@app.get("/api/level/{level_id}")
async def get_level(level_id: int):
    """Get questions for a specific level"""
    for level in quiz_data["levels"]:
        if level["id"] == level_id:
            return {"level": level}
    return JSONResponse(
        status_code=404,
        content={"error": "Level not found"}
    )


@app.get("/api/stats")
async def get_stats():
    """Get overall quiz statistics"""
    total_questions = sum(len(level["questions"]) for level in quiz_data["levels"])
    return {
        "total_levels": len(quiz_data["levels"]),
        "total_questions": total_questions,
        "games_featured": ["Garten of Banban", "Poppy Playtime", "Five Nights at Freddy's"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
