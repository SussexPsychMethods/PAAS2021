#!/bin/bash
cd 01
R -e 'rmarkdown::render("index.Rmd")'
cd ..


cd 02
R -e 'rmarkdown::render("index.Rmd")'
cd ..

cd 03
R -e 'rmarkdown::render("index.Rmd")'
cd ..

