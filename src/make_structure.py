import os
from pathlib import Path

os.mkdir("lectures")
os.mkdir("practicals")

for l in range(11):

    base = f"lectures/{l+1:#02d}/"
    slides = base + "slides/"
    handout = base + "handout/"
    recording = base + "recording/"
    os.mkdir(base)
    os.mkdir(slides)
    Path(slides + ".gitignore").touch()
    os.mkdir(handout)
    Path(handout + ".gitignore").touch()
    os.mkdir(recording)
    Path(recording + ".gitignore").touch()


for p in range(9):
    base = f"practicals/{p+2:#02d}/"
    slides = base + "slides/"
    handout = base + "worksheet/"
    os.mkdir(base)
    os.mkdir(slides)
    Path(slides + ".gitignore").touch()
    os.mkdir(handout)
    Path(handout + ".gitignore").touch()
