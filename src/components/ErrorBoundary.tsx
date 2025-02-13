import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // Update state so the next render will show the fallback UI
  public static getDerivedStateFromError(error: Error): State {
    // Convert the error to Error type to ensure type safety
    return { hasError: true, error };
  }

  // Log the error to an error reporting service or console for debugging
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // You might want to send error to an error tracking service here
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render a default error message with the error details
      return (
        <div className="text-center text-red-500 p-4">
          <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
          <p>{this.state.error?.message || 'Maaf, terjadi kesalahan yang tidak terduga.'}</p>
          {this.state.error && <p>Error details: {this.state.error.toString()}</p>}
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    // If there's no error, just render the children
    return this.props.children;
  }
}

export default ErrorBoundary;