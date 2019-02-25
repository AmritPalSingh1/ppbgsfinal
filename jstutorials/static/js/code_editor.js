var html = CodeMirror.fromTextArea(document.getElementById("html"), {
  mode: "xml",
  theme: "dracula",
  lineNumbers: true
});
var js = CodeMirror.fromTextArea(document.getElementById("js"), {
  mode: "javascript",
  theme: "dracula",
  lineNumbers: true
});

function compile() {
  var html_final = html.getValue();
  var js_final = js.getValue();
  var result = document.getElementById("result").contentWindow.document;
  result.open();
  result.writeln(html_final + "<script>" + js_final + "</script>");
  result.close();
}
compile();
