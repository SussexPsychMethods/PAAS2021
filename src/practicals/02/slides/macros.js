remark.macros.online = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let show = urlParams.get("online") || true ;
  return (show)
};

remark.macros.hidden = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let show = urlParams.get("hide") || true ;
  return (!show)
};
