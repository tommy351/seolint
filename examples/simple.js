const seolint = require('..');

const linter = new seolint.Linter();
const options = {
  rules: {
    'a-rel': true,
    head: true,
    'img-alt': true,
    'max-strong': true,
    'only-one-h1': true
  }
};

try {
  const { errors } = linter.lintString(
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

  if (errors.length) {
    for (const { message, location, name } of errors) {
      console.log(
        `${
          location ? `[${location.line}:${location.col}] ` : ''
        }${name}: ${message}`
      );
    }
  }
} catch (err) {
  console.error(err);
}
