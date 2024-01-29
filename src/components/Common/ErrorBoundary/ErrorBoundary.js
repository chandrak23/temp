import React, { Component } from "react";
import "./style.scss";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(/* error */) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(/* error */) {
    this.setState({
      hasError: true,
    });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="page-not-found-wrapper errorPageNotFound">
          <div className="blurbg" />
          <div className="error-logo-wrapper">{/* <img src={notCKFoundLogo} alt="" /> */}</div>

          <div className="internalError-heading">
            <h3 className="error-heading">Oops, Something went wrong…</h3>
          </div>
          <div className="usefullLinks-container">
            <div className="internalError-texts">
              <p>This page didn’t load correctly, due to an error. Please try again later.</p>
            </div>
            <div className="error-button-wrapper">
              <a href={"/"} className="internalError-button">
                Go Back
              </a>
            </div>
          </div>
        </div>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
