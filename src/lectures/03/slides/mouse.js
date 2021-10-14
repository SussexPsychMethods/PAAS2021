function addMouseTracker(elem) {
  elem.mouse = {x : 0, y : 0, buttons : 0, targetElement : null, hasFocus: false};
  elem.mouse.interactiveElements = [];
  elem.getInteractiveElement = findElement;
  elem.addEventListener("mousedown", 
    function(event) {
      this.mouse.buttons = event.buttons;
      this.mouse.x = event.offsetX;
      this.mouse.y = event.offsetY;
      this.mouse.targetElement = this.getInteractiveElement(event.offsetX, event.offsetY);
      if (this.mouse.targetElement != null) {
        this.mouse.targetElement.startAction(event);
      }
    });
  elem.addEventListener("mouseup", 
    function(event) {
      this.mouse.buttons = event.buttons;
      if (this.mouse.targetElement != null) {
        this.mouse.targetElement.endAction(event);
        this.mouse.targetElement = null;
      }
    });
  elem.addEventListener("mousemove", 
    function(event) {
      this.mouse.hasFocus = true;
      this.mouse.x = event.offsetX;
      this.mouse.y = event.offsetY;
      if (this.mouse.targetElement != null) {
        this.mouse.targetElement.continueAction(event);
      } else {
        var interactiveElement = this.getInteractiveElement(event.offsetX, event.offsetY)
        if (interactiveElement != null) {
          this.style.cursor = interactiveElement.getActionLabel(event.offsetX - interactiveElement.x, event.offsetY - interactiveElement.y);
        } else {
          this.style.cursor = "initial";
        }
      }
    });
  elem.addEventListener("mouseout", 
    function(event) {
      this.mouse.hasFocus = false;
    });
  elem.addInteractiveElement = function(obj) {
      this.mouse.interactiveElements.push(obj);
    };
}

function findElement(x, y) {
  for (var i = this.mouse.interactiveElements.length - 1; i >= 0; --i) {
    if (x < this.mouse.interactiveElements[i].x + this.mouse.interactiveElements[i].getWidth() && x > this.mouse.interactiveElements[i].x &&
        y < this.mouse.interactiveElements[i].y + this.mouse.interactiveElements[i].getHeight() && y > this.mouse.interactiveElements[i].y) {
      return this.mouse.interactiveElements[i];
    }
  }
  return null;
}