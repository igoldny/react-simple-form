# React Simple Form Component

React Form is a library that helps you with form with ease.
There is no need to adjust your form or use costume html elements for inputs.
this form will handle form state management, validation, post to api.

### Installation

```sh
npm install --save react-simple-form-component
```

### Basic Example

this example will "POST" your form to action url almost like native form dose.

```js
import React from 'react';
import Form from 'react-simple-form-component';

class FormWithAction extends React.Component {
  render() {
    return (
      <Form action="http://www.api.url/login">
        <input type="email" name="email" />
        <input type="password" name="password" />
        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

### Basic Example

this example will log on form submitted data that has been updated

```js
import React from 'react';
import Form from 'react-simple-form-component';

class FormWithState extends React.Component {
  render() {
    return (
      <Form onSubmit={state => console.log(state)}>
        <input type="email" name="email" />
        <input type="password" name="password" />
        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```
