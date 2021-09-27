#!/bin/bash

cd slides
R -e 'rmarkdown::render("index.Rmd")'
cd ..

cd worksheet
R -e 'rmarkdown::render("index.Rmd")'
cd ..
