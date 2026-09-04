import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log privately to console in development
    console.error("Critical interface error captured by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <div className="error-card panel">
            <div className="error-icon-wrap">
              <AlertTriangle size={36} className="error-icon" />
            </div>
            <span className="eyebrow">// CRITICAL OVERRIDE</span>
            <h2>SYSTEM INTERRUPTION</h2>
            <p>The interface encountered an unexpected error during execution.</p>
            <button className="btn btn-primary" onClick={this.handleReset}>
              <RotateCcw size={16} /> RETURN TO BASE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
