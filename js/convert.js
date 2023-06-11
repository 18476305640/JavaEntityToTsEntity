function convertJavaToTypeScript() {
  var javaCode = document.getElementById("javaCode").value;
  var typeScriptCode = parseJavaToTypeScript(javaCode);
  document.getElementById("typeScriptCode").textContent = removeEmptyLines(typeScriptCode);
}
function removeEmptyLines(code) {
  // 使用正则表达式替换空行
  var cleanedCode = code.replace(/^\s*[\r\n]/gm, '');
  return cleanedCode;
}
function parseJavaToTypeScript(javaCode) {
  // Remove import statements
  var cleanedCode = javaCode.replace(/^import\s+.*?;\s*/gm, '');

  // Remove package statement
  cleanedCode = cleanedCode.replace(/package\s+[\w.]+;\s*/, '');

  // Remove annotations
  cleanedCode = cleanedCode.replace(/@.*?\n/g, '');

  // Remove implements Serializable
  cleanedCode = cleanedCode.replace(/\s*implements\s+Serializable\s*/g, '');

  // Remove serialVersionUID property
  cleanedCode = cleanedCode.replace(/private\s+static\s+final\s+long\s+serialVersionUID\s+=\s+\d+L;/g, '');

  // Remove methods
  cleanedCode = removeJavaMethods(cleanedCode);

  // Convert Java properties to TypeScript properties
  cleanedCode = cleanedCode.replace(/private\s+(\w+)\s+(\w+)/g, 'private $2: $1');

  // Convert Java types to TypeScript types
  cleanedCode = cleanedCode.replace(/\bint|Integer|Long\b/g, 'number');
  cleanedCode = cleanedCode.replace(/\bfloat\b/g, 'number');
  cleanedCode = cleanedCode.replace(/\bdouble\b/g, 'number');
  cleanedCode = cleanedCode.replace(/\bboolean\b/g, 'boolean');
  cleanedCode = cleanedCode.replace(/\bString\b/g, 'string');

  // Remove extra semicolons
  cleanedCode = cleanedCode.replace(/;;/g, ';');

  return cleanedCode;
}

function removeJavaMethods(javaCode) {
  var methodStartRegex = /(public|private|protected)?\s*\w+\s+\w+\s*\([^{}]*\)\s*(?:(?!{)[^;])*{/g;
  var braceCounter = 0;
  var startIndex = 0;
  var cleanedCode = '';

  while (true) {
    var match = methodStartRegex.exec(javaCode);

    if (!match) {
      cleanedCode += javaCode.substring(startIndex);
      break;
    }

    cleanedCode += javaCode.substring(startIndex, match.index);
    startIndex = match.index;

    for (var i = startIndex; i < javaCode.length; i++) {
      if (javaCode[i] === '{') {
        braceCounter++;
      } else if (javaCode[i] === '}') {
        braceCounter--;

        if (braceCounter === 0) {
          startIndex = i + 1;
          break;
        }
      }
    }
  }

  return cleanedCode;
}

