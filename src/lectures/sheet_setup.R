
## knitr hooks
knitr::opts_hooks$set(
  panel = function(options) {
    if (isTRUE(options$panel)) {
      options$eval = TRUE
      options$echo = TRUE
      options$copy = TRUE
      options
    }
  },
  copy = function(options) {
    if (isTRUE(options$copy)) {
      options$echo = TRUE
      options
    }
  }
)

knitr::knit_hooks$set(
  sol = function(before, options, envir){
    if (isTRUE(options$sol)) {
      if (before) {
        paste0('<div class="solution">')
      } else paste0('</div>')
    }
  },
  copy = function(before, options, envir){
    if (isTRUE(options$copy)) {
      if (before) {
        paste0('<div class="copy">')
      } else paste0('</div>')
    }
  },
  panel = function(before, options, envir){
    if (isTRUE(options$panel)) {
      options$echo=TRUE
      if (before) {
        paste0('<div class="codePanel">')
      } else paste0('</div>')
    }
    }
)

### ggplot backgrounds same colour as teaching materials
bg_col <- "#fdfdfd"
theme_col <- "#003568"
default_col <- '#464b61'
second_col <- "#3d755b"

par(mar = c(5, 2, 2, 1) + 0.1,
    bg = bg_col)

source("../../plot_theme.R")
