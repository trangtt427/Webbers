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
  return hashCode(p) === "-1307947986";
}

var p = window.prompt("Psst what's the password?");
// console.log(hashCode(p));

if (!p || !isValid(p)) {
  // Send the user back to their last history page
  // NOTE: This might break if they're opening the page from a new tab, with no history
  window.history.back();
}
