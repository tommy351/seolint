const seolint = require('..');

const linter = new seolint.Linter();
const options = {
  rules: {
    'a-rel': true,
    'img-alt': true,
    'max-strong': true,
    'only-one-h1': true
  }
};

try {
  const result = linter.lintString(
    `
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <img src="foo.jpg">
</body>
</html>
`,
    options
  );

  console.log('result', result);
} catch (err) {
  console.error(err);
}
