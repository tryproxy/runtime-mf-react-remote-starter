import { RemoteErrorFallback } from '@/shared/ui/remote-error-fallback';
import type { HostTelemetry } from '@platform/runtime-mf-contract';
import { Component, type ErrorInfo, type ReactNode } from 'react';

type RemoteErrorBoundaryProps = {
  children: ReactNode;
  telemetry?: HostTelemetry;
};

type RemoteErrorBoundaryState = {
  error: Error | null;
};

export class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  state: RemoteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RemoteErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.telemetry) {
      this.props.telemetry.captureException(error, {
        source: 'react-error-boundary',
        componentStack: info.componentStack,
      });
      return;
    }

    console.error('[RemoteErrorBoundary]', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <RemoteErrorFallback
          message={this.state.error.message}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
