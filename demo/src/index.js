import React, { Component } from 'react';
import { render } from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import Form from '../../src';

class Demo extends Component {
  onSubmit(form) {
    console.log(form);
    this.setState(form);
  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <h1>Basic form:</h1>
            <Form onSubmit={this.onSubmit.bind(this)}>
              <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  name="exampleInputEmail1"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
                <small id="emailHelp" class="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  class="form-control"
                  name="exampleInputPassword1"
                  id="exampleInputPassword1"
                  placeholder="Password"
                />
              </div>
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  name="exampleCheck1"
                  id="exampleCheck1"
                />
                <label class="form-check-label" for="exampleCheck1">
                  Check me out
                </label>
              </div>
              <button type="submit" class="btn btn-primary">
                Submit
              </button>
            </Form>

            <h4>Output:</h4>
            <div class="alert alert-primary" role="alert">
              {JSON.stringify(this.state || {}, null, '\t')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
