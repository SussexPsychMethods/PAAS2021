HTMLWidgets.widget({

  name: 'quiz',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {

        let content = ""
        for(let i = 0; i < x.length; i++) {
          content = content + multiChoice(x[i])
        }
        //el.innerHTML = multiChoice(x[0]) + multiChoice(x[1])
        el.innerHTML = content
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
