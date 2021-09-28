remark.macros.lincoln = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let show = urlParams.get("inperson") || "false";

  if (show == "true") {
    return "true";
  } else {
    return "false";
  }
};


remark.macros.dan = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let show = urlParams.get("online") || "false";

  if (show == "true") {
    return "true";
  } else {
    return "false";
  }
};
