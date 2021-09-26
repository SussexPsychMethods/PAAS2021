
### plot theme for teaching materials
library(ggplot2)

point_col <- paste0(default_col, "88")

ggplot2::theme_set(cowplot::theme_cowplot() +
            theme(line = element_line(colour = default_col),
                  plot.background = element_rect(fill = bg_col),
                  legend.background = element_rect(fill= bg_col),
                  panel.background = element_rect(fill = bg_col),
                  text = element_text(colour = default_col),
                  title = element_text(colour = default_col),
                  axis.line = element_line(colour = default_col),
                  axis.ticks = element_line(colour = default_col),
                  axis.text = element_text(colour = default_col),
                  axis.title = element_text(colour = default_col),
            )
)
ggplot2::update_geom_defaults("bar", list(fill = bg_col, colour = default_col))

