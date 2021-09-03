
### QUIZZES

## hooks
knitr::knit_hooks$set(
  quiz = function(before, options, envir){
    if (isTRUE(options$quiz)) {
      if (before) {
        paste0('<div class="quiz">')
      } else paste0('</div>')
    }
  }
)

knitr::opts_hooks$set(
  quiz = function(options) {
    if (isTRUE(options$quiz)) {
      options$sol = FALSE
      options$eval = TRUE
      options$echo = FALSE
      options$results = 'asis'
      options$layout = "quiz-wrapper"
      options
    }
  }
)

## counter
quiz_qu_no <- 1

## quiz functions
mcq <- function(q, options, correct = 1, shuffle = TRUE, code = FALSE,
                correct_msg = "Correct!", wrong_msg = "That's not right...", numbered = TRUE) {
  corrAns <- gsub("--", "-\\\\-", options[correct])
  # if (shuffle) options <- sample(options) # done with JS on page load now
  cat(
    "<div class=\"question mcq", if (shuffle) " shuffle", if (code) " code","\">\n",
    if (numbered) paste0("#### QUESTION ", quiz_qu_no, "\n\n"),
    q,
    "\n\n:::{.corrAns}\n",
    corrAns,
    "\n:::\n<div class=\"submit\"><p class=\"opts", if (shuffle) paste(" shuffle") ,"\">", paste0("<input class=\"quizSubmit\" type=\"submit\" value=\"", options, "\">\n", collapse = ""),
    "</p><p class=\"feedback\"><span class=\"correct\">", correct_msg, "</span><span class=\"incorrect\">", wrong_msg, "</span></p></div></div>\n",
    sep = ""
  )
  if (numbered)  quiz_qu_no <<- quiz_qu_no + 1 
}

saq <- function(q, correct, numeric = TRUE, code = FALSE,
                correct_msg = "Correct!", wrong_msg = "That's not right...", numbered=TRUE) {
  cat(
    "<div class=\"question saq", if (code) " code", "\">\n",
    if (numbered) paste0("#### QUESTION ", quiz_qu_no, "\n\n"),
    q,
    "\n\n:::{.corrAns", ifelse(numeric, "", " .str"),"}\n",
    paste(gsub("--", "-\\\\-", correct), collapse = " | "),
    "\n:::\n:::{.submit}\n",
    "<input class=\"quizInput\" value=\"\">",
    "<input class=\"quizSubmit\" type=\"submit\" value=\"Submit\"><span class=\"correct\">", correct_msg, "</span><span class=\"incorrect\">", wrong_msg, "</span>\n:::\n</div>\n",
    sep = ""
  )
  if (numbered) quiz_qu_no <<- quiz_qu_no + 1 
}
