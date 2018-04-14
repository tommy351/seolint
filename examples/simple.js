const seolint = require('..');

const linter = new seolint.Linter({
  rules: {
    'img-alt': true
  }
});

const result = linter.lintString(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <img src="foo.jpg">
</body>
</html>
`);

console.log('result', result);
