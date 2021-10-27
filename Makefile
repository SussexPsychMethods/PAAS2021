all :
	make "./src/practicals/${WEEK}/slides/index.html"
	make "./src/practicals/${WEEK}/worksheet/index.html"
	make "./src/lectures/${WEEK}/slides/index.html"
	make "./src/lectures/${WEEK}/handout/index.html"
	make "./src/lectures/${WEEK}/slides/lecture_${WEEK}_slides.pdf"

./src/practicals/${WEEK}/slides/index.html: ./src/practicals/${WEEK}/slides/index.Rmd
	@cd ./src/practicals/${WEEK}/slides/; \
		R -e 'rmarkdown::render("index.Rmd")' > /dev/null

./src/practicals/${WEEK}/worksheet/index.html : ./src/practicals/${WEEK}/worksheet/index.Rmd
	@cd ./src/practicals/${WEEK}/worksheet/; \
		R -e 'rmarkdown::render("index.Rmd")' > /dev/null

./src/lectures/${WEEK}/handout/index.html : ./src/lectures/${WEEK}/handout/index.Rmd
	@cd ./src/lectures/${WEEK}/handout/; \
		R -e 'rmarkdown::render("index.Rmd")' > /dev/null

./src/lectures/${WEEK}/slides/index.html : ./src/lectures/${WEEK}/slides/index.Rmd
	@cd ./src/lectures/${WEEK}/slides/; \
		R -e 'rmarkdown::render("index.Rmd")' > /dev/null

./src/lectures/${WEEK}/slides/lecture_${WEEK}_slides.pdf : ./src/lectures/${WEEK}/slides/index.html
	@cd ./src/lectures/${WEEK}/slides/; \
		R -e 'xaringan::decktape(file = "index.html", output = "lecture_${WEEK}_slides.pdf")' > /dev/null

.PHONY: deploy

deploy : 
	make all
	netlify deploy --prod
