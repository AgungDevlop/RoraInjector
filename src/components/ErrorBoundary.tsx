import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  // Update state so the next render will show the fallback UI
  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  // Log the error to an error reporting service or console for debugging
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo }); // Simpan error dan errorInfo ke state
    console.error('Uncaught error:', error, errorInfo);
    // Anda bisa mengirim error ke layanan pelaporan error di sini jika ada
  }

  public render() {
    if (this.state.hasError) {
      // Jika ada fallback custom, gunakan itu
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Tampilkan pesan error yang lebih spesifik
      return (
        <div className="text-center text-red-500 p-4">
          <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
          <p className="mb-2">
            {this.state.error?.message || 'Maaf, terjadi kesalahan yang tidak terduga.'}
          </p>
          {this.state.error && (
            <div className="text-left bg-gray-100 p-4 rounded text-black mb-4 max-w-2xl mx-auto">
              <p className="font-bold">Detail Error:</p>
              <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
              {this.state.errorInfo && (
                <>
                  <p className="font-bold mt-2">Stack Trace:</p>
                  <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          )}
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    // Jika tidak ada error, render children
    return this.props.children;
  }
}

export default ErrorBoundary;