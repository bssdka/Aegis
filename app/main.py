# app/main.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
import os


# Getting metadata
with open('meta.json', 'r') as file:
    data = json.load(file)
title = data['title']
version = data['version']

# Determine the path to the folder with static files
current_file_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_file_dir)
static_dir = os.path.join(project_root, "static")

# Creating app
app = FastAPI(
    title=title,
    version=version
)

app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
async def read_index():
    html_path = os.path.join(static_dir, "index.html")
    return FileResponse(html_path)