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
    `<!DOCTYPE html>
<html>
<head>
  <title>Example</title>
</head>
<body>
  <h1>Important</h1>
  <img src="foo.jpg">
  <h1>Very important</h1>
  <a href="http://example.com">Example</a>
  <h1>Really important</h1>
</body>
</html>`,
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
