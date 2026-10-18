"use client";

import { Component, type ReactNode } from "react";

// The 3D wizard is decoration: if WebGL, the model or its decoder fails to load, hide it
// instead of taking the page down with it.
export default class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Wizard scene failed to load", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
