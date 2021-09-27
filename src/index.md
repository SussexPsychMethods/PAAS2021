= Psychology as a Science 2021/2022
:toc: left
:nofooter:
:stylesheet: github.css


Welcome to Psychology as a Science. You can find all the course materials, such
as lecture slides, lecture handouts, and practical worksheets listed on this
page.

If you're looking for the 2020/2021 version of this course then follow
link:archive/2020/index.html[this link].

== Lectures

<% lectureList.each do |item| %>
<%= item.week.h3 if item.subtype == "slides" %>
<%= item.link + "\n" %>
<% end %>

== Practical classes

<% practicalList.each do |item| %>
<%= item.week.h3 if item.subtype == "slides" %>
<%= item.link + "\n" %>
<% end %>


== Tutorials

<% tutorialList.each do |item| %>
<%= item.week.h3 %>
<%= item.link + "\n" %>
<% end %>