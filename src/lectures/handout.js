
<script>

// from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript //
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if the element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in the top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of the white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    success = document.execCommand('copy');
    console.log('Copied');
  } catch (err) {	
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

  

let copyCode = document.querySelectorAll(".copy pre.r, .r-box pre.r")
if (copyCode.length > 0) {
	for (let i = 0; i < copyCode.length; i++) {
		copyCode[i].classList.add("copy")
	}
}


const hideBox = (cls) => { 
	let box = document.querySelectorAll(cls)
	if (box.length > 0) {
		for (let i = 0; i < box.length; i++) {
			if (cls == ".extra") {
				let firstP = box[i].firstElementChild
				firstP.innerHTML = '<strong class="prefix">EXTRA</strong> ' + '<span class="extra-title">' + firstP.innerHTML + '</span>'
				firstP.classList.add("label")
				let pHeight = firstP.scrollHeight + 13 + "px"
				box[i].collapsedHeight = pHeight
				box[i].style.maxHeight = pHeight
			} else if (cls == ".r-box") {
				let node = document.createElement("DIV")
				node.innerHTML = '<code>R</code> know-how'
				node.classList.add("label")
				box[i].insertBefore(node, box[i].firstChild);
			}
			box[i].style.height = box[i].scrollHeight + "px";
			box[i].classList.add("collapsible")
			if (cls == ".extra") {
				box[i].addEventListener("click", toggleExtra);
			} else if (cls == ".r-box") {
				box[i].addEventListener("click", toggleRbox);				
			}
		}
	}
}

toggleRbox = function() {
	this.classList.toggle("active");
	var content = this;
	if (content.style.maxHeight) {
		content.style.maxHeight = null;
	} else {
		content.style.maxHeight = content.style.height
	}
	
}

toggleExtra = function() {	
	this.classList.toggle("active")
	if (this.style.maxHeight == this.style.height) {
		this.style.maxHeight = this.collapsedHeight
	} else {
		this.style.maxHeight = this.style.height
	}
}

let copyDivs = document.querySelectorAll("pre.sourceCode.copy")
if (copyDivs.length > 0) {
	for (let i = 0; i < copyDivs.length; i++) {
		let icon = document.createElement("i")
		icon.classList.add("far", "fa-copy")
		let copyBttn = document.createElement("button")
		copyBttn.classList.add("btn", "btn-primary", "copy-btn")
		copyBttn.appendChild(icon);
		copyDivs[i].parentElement.appendChild(copyBttn)
		copyBttn.onclick = function() {
			textToCopy = this.parentElement.children[0].textContent
			let success = false
			copyTextToClipboard(textToCopy)
			if (success) {
			
			} else {
			
			}
		}
	}
}

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}


function plotsToPanels() {
	const codePanels = document.querySelectorAll(".codePanel")
	let tabNames = ["Plot", "R code"],
		copyWhat = [".figure", ".sourceCode"],
		ulTag = [],
		liTag = [],
		aTag = [],
		currentName = [],
		sections = [],
		active = [" panel-active", ""],
		content = [],
		slide = [],
		isCurrentSlide = false

	if (codePanels.length > 0) {
		for (let p = 0; p < codePanels.length; p++) {
			if (codePanels[p].getElementsByTagName("img").length == 1) {
				ulTag = document.createElement("ul")
				setAttributes(ulTag, {"class": "panel-tabs", "role": "tablist"})
				for (let i = 0; i < tabNames.length; i++) {
					currentName = tabNames[i].toLowerCase().replace(" ", "-")
					aTag = document.createElement("a")
				
					setAttributes(aTag, {"href": "?panelset=" + currentName + "#panelset_" + currentName, "onclick": "return false;", "tabindex": "-1", "aria-controls": currentName})
					aTag.innerHTML = tabNames[i]
				
					liTag = document.createElement("li")
					setAttributes(liTag, {"class": "panel-tab", "role": "tab", "tabindex": "0", "id": "panelset_" + currentName})
					
					sections[i] = document.createElement("section")
					setAttributes(sections[i], {"class": "panel" + active[i], "role": "tabpanel", "id": tabNames[i], "aria-labelledby": tabNames[i]})
					
					
					content = codePanels[p].querySelector(copyWhat[i]) || codePanels[p].querySelector("img") // if fig.cap= isn't given, there's not .figure and so select <img>
					
					sections[i].appendChild(content)		
					liTag.appendChild(aTag)
					ulTag.appendChild(liTag)
			  }
			  
			  codePanels[p].appendChild(ulTag)
			  codePanels[p].appendChild(sections[0])
			  codePanels[p].appendChild(sections[1])
			
			  setAttributes(codePanels[p], {"class": "panelset", "id": "panelset"})
			}
		}
	}
}

editPanels = function() {
	const panels = document.querySelectorAll(".panelset > .panel-tabs")
		  
	let tabs = [],
		names = []
	if (panels.length > 0) {		
		for (let i = 0; i < panels.length; i++) {			
			tabs = panels[i].getElementsByTagName("a")
			if (tabs.length == 2) {
				names = ["Panel"]
				for (let j = 0; j < 2; j++) {names.push(tabs[j].innerHTML)}
				if (names.every( (val, j, arr) => val === arr[0] )) {
					tabs[0].innerHTML = "Plot"
					tabs[1].innerHTML = "<code>R</code> code"
					
					// I don't think there's need to keep code blocks same max height as plots in worksheets (unlike slides)
					// panels[i].querySelector(".panel code").style.maxHeight = panels[i].getElementsByClassName("panel")[0].scrollHeight + "px"
				}
			}
		}
	}
}

function resetGif() {
	$(this).parent().removeClass('init')
	gifSrc = this.getAttribute("gif")
	gifSrc = gifSrc.split(" ")
	currentSrc = this.getAttribute("src")
	this.setAttribute("src", gifSrc.shift())
	gifSrc.push(currentSrc)	
	this.setAttribute("gif", gifSrc.join(" "))
}

function resetGifParent() {
	$(this).removeClass('init')
	gif = $(this).children()[0]
	gifSrc = gif.getAttribute("gif")
	gifSrc = gifSrc.split(" ")
	currentSrc = gif.getAttribute("src")
	gif.setAttribute("src", gifSrc.shift())
	gifSrc.push(currentSrc)	
	gif.setAttribute("gif", gifSrc.join(" "))
	$(this).off('click touch')
}

// vars to save user input for local storage
let saq = [],
	mcq	= []
function checkAns() {
	saq = []
	mcq = []
	const qu = this.parentElement.parentElement.parentElement
	let corrAns,
		userAns
	if (qu.classList.contains("mcq")) {
		qu.querySelector(".correct").classList.remove("show")
		qu.querySelector(".incorrect").classList.remove("show")
		if (this.classList.contains('selected')) {
			this.classList.remove("selected")
			// get all MCQ and SAQ user input
			$(".quizInput").each(function() {return saq.push($(this).val())})
			$(".opts").each(function() {return mcq.push($(this).find(".selected").val() || "")})
			return
		}		
		qu.querySelectorAll("input").forEach((el) => el.classList.remove("selected"))
		this.classList.add("selected")
		corrAns = qu.querySelector(".corrAns > p").innerHTML
		userAns = this.value
		corrAns = corrAns.replace(/’/g, "'") // apostrophes get rendered as quotes in .corrAns and need replacing
		corrAns = [corrAns.replace(/[“”]/g, "\"")] // double quotes need replacing too
	} else {
		corrAns = qu.querySelector(".corrAns > p").innerHTML.split(" | ")
		if (qu.querySelector(".str")) {
			corrAns = corrAns.map((e) => e.replace(/’/g, "'")), // apostrophes get rendered differenctly in input value and .corrAns div
			corrAns = corrAns.map((e) => e.replace(/[“”]/g, "\"")), // double quotes need replacing too
			userAns = qu.querySelector("input").value
		} else {
			corrAns = corrAns.map((e) => +e)
			userAns = +qu.querySelector("input").value
		}
	}
	if (corrAns.some((possAns) => possAns === userAns)) {
		qu.querySelector(".correct").classList.add("show")
	} else {
		qu.querySelector(".incorrect").classList.add("show")
	}
	// get all MCQ and SAQ user input
	$(".quizInput").each(function() {return saq.push($(this).val())})
	$(".opts").each(function() {return mcq.push($(this).find(".selected").val() || "")})
}

function hideMsg() {
	const qu = this.parentElement
	qu.querySelector(".correct").classList.remove("show")
	qu.querySelector(".incorrect").classList.remove("show")
}

function stopPropagation() {
	let codeCopy = document.querySelectorAll(".r-box button.copy-btn")
	for (let i = 0; i < codeCopy.length; i++) {
		codeCopy[i].addEventListener("click", function(event) {event.stopPropagation()})
	}
	let links = document.querySelectorAll("*:not(.panel-tab) > a")
	for (let i = 0; i < links.length; i++) {
		links[i].addEventListener("click", function(event) {event.stopPropagation()})
	}
}

plotsToPanels()

// shuffle mcq
$(".shuffle .opts.shuffle").each(function() {
	x = $(this)[0]
	for (let i = x.children.length; i >= 0; i--) {
		x.appendChild(x.children[Math.random() * i | 0])
	}
})

const subheadings = $('nav#TOC li > ul')
function truncateToc() {
	if ($(window).width() > 982) {
		if ($(window).height() < fullTocHeight) {
			subheadings.addClass("collapsed")
		} else {
			fullTocHeight = toc.clientHeight + 55
			subheadings.removeClass("collapsed")	
		}
	}
}

function noScroll() {
  window.scrollTo(0, freezeScroll);
}

let fullTocHeight, tocHeight, footerTop, tocMaxTop, tocTop, article, tocOpts, tocObserver, freezeScroll
var oldOnload = document.body.onload;

document.body.onload = function(){
  oldOnload && oldOnload()  

  <!-- quizzes -->
  $('.quizSubmit').each(function() {
	  $(this).on('click touch', checkAns)
  })
  
  $('.quizInput').each(function() {
	  $(this).val("")
	  $(this).on('input', hideMsg)
  })
  
  $('.gif').each(function() {
	  $(this).parent().addClass('init')
	  $(this).parent().on('click touch', resetGifParent)
	  $(this).on('click touch', resetGif)
	  $(this).on('click touch', function(event) {event.stopPropagation()})
  })
  
  editPanels()
  hideBox(".extra")
  hideBox(".r-box")
  if (copyDivs.length > 0) { stopPropagation() }
  
  // floating TOC
  tocTop = $("d-article").offset().top + 40.8
  article = document.querySelector("d-article")
  toc = document.querySelector(".d-contents-float > nav")

  if (toc) {
	  tocHeight = toc.clientHeight
	  fullTocHeight = toc.clientHeight + 55
	  truncateToc()
	  tocOpts = {rootMargin: -(tocHeight) + 'px 0px 1000px 0px'}
	  tocObserver = new IntersectionObserver (
		function(entries, tocObserver) {
			entries.forEach((entry) => {
				if (!entry.isIntersecting && $(window).width() > 982) {
					footerTop = $("d-appendix").offset().top
					tocMaxTop = footerTop - tocHeight
					$('.d-contents-float').addClass('stuck')
					toc.style.marginTop = tocMaxTop - tocTop - 55 + "px"
				} else {
					$('.d-contents-float').removeClass('stuck')
					toc.style.marginTop = "0px"			
				}					
			})
		},
		tocOpts
	  )
	  tocObserver.observe(article)
	  // watch resize of d-article and rerun tocObserver
	  const articleResizeObs = new ResizeObserver (
		function(entries, articleResizeObs) {
			entries.forEach((entry) => {
				if ($(window).width() > 982) {
					tocHeight = toc.clientHeight
					tocObserver.unobserve(article)					
					tocOpts = {rootMargin: -(tocHeight) + 'px 0px 1000px 0px'}
					tocObserver = new IntersectionObserver (
						function(entries, tocObserver) {
							entries.forEach((entry) => {
								if (!entry.isIntersecting && $(window).width() > 982) {
									footerTop = $("d-appendix").offset().top
									tocMaxTop = footerTop - tocHeight
									$('.d-contents-float').addClass('stuck')
									toc.style.marginTop = tocMaxTop - tocTop - 55 + "px"
								} else {
									$('.d-contents-float').removeClass('stuck')
									toc.style.marginTop = "0px"				
								}					
							})
						},
						tocOpts
					  )
					tocObserver.observe(article)
				}
			}
		)}
	  )
	  articleResizeObs.observe(article)
  }
  
  $(window).on('resize', truncateToc)
}
</script>
