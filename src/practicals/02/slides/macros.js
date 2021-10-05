remark.macros.online = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let show = urlParams.get("online") || false ;
  return (show)
};

remark.macros.hidden = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let show = urlParams.get("hide") || false ;
  return (!show)
};
