= Psychology as a Science 2020/2021
:toc: left
:nofooter:
:stylesheet: github.css


Welcome to Psychology as a Science. You can find all the course materials, such as lecture slides, lecture handouts, and practical worksheets listed on this page.

== Lecture material

<% lecture_materials.each do |item| %>
<%= item.week.h3 %>
<%= item.title + "\n" %>
<%= item.description + "\n" %>
<%= item.type %>
<% end %>

== Practical worksheets

<% practicals.each do |item| %>
<%= item.week.h3 %>
<%= item.title + "\n" %>
<%= item.description + "\n" %>
<%= item.type %>
<% end %>

