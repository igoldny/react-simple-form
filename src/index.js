import React, { Component } from 'react';
import { isEmpty, pick, isEqual, pickBy } from 'lodash';

const validate = {
  required: value => !!value,
  email: value => value && /\S+@\S+\.\S+/.test(value),
  maxLength: (value, { maxLength }) =>
    value && value.length && value.length <= maxLength,
  min: (value, { min }) => !min || Number(value) >= min,
  max: (value, { max }) => !max || Number(value) <= max
};

function deepMap(children, fun) {
  return React.Children.map(children, child => {
    if (child && child.props && child.props.children) {
      return React.cloneElement(fun(child), {
        children: deepMap(child.props.children, fun)
      });
    }

    return fun(child);
  });
}

function isValid(value, validations) {
  if (isEmpty(validations)) return true;

  return (
    Object.keys(validations)
      .map(key => validate[key](value, validations))
      .filter(field => !field).length === 0
  );
}

function isFormValid(state = {}, validations = {}) {
  const formValidations = Object.keys(validations);
  const validatedFields =
    Object.keys(state).filter(
      key => !!validations[key] && isValid(state[key], validations[key])
    ) || [];
  return validatedFields.length >= formValidations.length;
}

function getValidationsOnly(validations) {
  return pick(validations, ['required', 'email', 'maxLength', 'min', 'max']);
}

const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = props.defaults || {};
  }

  componentWillReceiveProps({ defaults }) {
    if (!isEqual(this.props.defaults, defaults)) {
      this.setState(prevState => ({
        ...prevState,
        ...pickBy(defaults, (value, key) => this.props.defaults[key] !== value)
      }));
    }
  }

  onSubmit(event, type) {
    event.preventDefault();
    event.stopPropagation();

    if (
      this.state &&
      type === 'submit' &&
      isFormValid(this.state, this.validations)
    ) {
      if (this.props.action) {
        fetch(this.props.action, {
          method: 'POST',
          body: this.state
        }).then(result => {
          if (result.message) {
            this.setState({
              message: result.message,
              messageType: result.messageType
            });
          }
          return this.props.onSubmit(result);
        });
      }
      this.props.onSubmit(this.state);
    }
  }

  onChange(props, event) {
    event.stopPropagation && event.stopPropagation();
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [props.name]: value
    });
  }

  resetForm = event => {
    event.preventDefault();
    this.setState(this.props.defaults);
    this.props.postReset && this.props.postReset();
  };

  addChangeHandler(child) {
    if (child && child.props && child.props.name) {
      const { name } = child.props;
      const validations = getValidationsOnly(child.props);
      if (!isEmpty(validations)) {
        this.validations = {
          ...this.validations,
          [name]: validations
        };
      }

      return React.cloneElement(child, {
        ...child.props,
        value: this.state[name],
        checked: !!this.state[name],
        onChange: compose(
          this.onChange.bind(this, child.props),
          child.props.onChange
        )
      });
    }

    if (child && child.props && child.props.type === 'submit') {
      return React.cloneElement(child, {
        ...child.props,
        disabled: !(this.state && isFormValid(this.state, this.validations)),
        onClick: e => this.onSubmit(e, 'submit')
      });
    }

    if (
      child &&
      child.props &&
      child.type &&
      child.type.target === 'button' &&
      child.props.reset
    ) {
      return React.cloneElement(child, {
        ...child.props,
        onClick: this.resetForm
      });
    }

    return child;
  }

  render() {
    return (
      <form
        className={this.props.className}
        onSubmit={this.onSubmit.bind(this)}
      >
        {deepMap(this.props.children, this.addChangeHandler.bind(this))}
        {this.state.message && (
          <span data-message-type={this.state.messageType}>
            {this.state.message}
          </span>
        )}
      </form>
    );
  }
}
