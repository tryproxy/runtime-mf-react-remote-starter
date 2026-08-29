import { RemoteErrorFallback } from '@/shared/ui/remote-error-fallback';
import { Component, type ErrorInfo, type ReactNode } from 'react';

type RemoteErrorBoundaryProps = {
  children: ReactNode;
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
