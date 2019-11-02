function hashCode(s) {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
}
function isValid(p) {
  if (!p) {
    return null;
  }
  return hashCode(p) === -1307947986;
}

var isVerified = sessionStorage.getItem("isVerified");

if (!isVerified || isVerified === "false") {
  var p = window.prompt("Psst what's the password?");

  if (!isValid(p)) {
    sessionStorage.setItem("isVerified", "false");
    window.location.replace("https://trangerthings.com/401.html");
  } else {
    sessionStorage.setItem("isVerified", "true");
  }
}
