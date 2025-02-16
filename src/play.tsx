import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PlayVideo } from "./pages/PlayVideo";
import Layout from "./Layout"; // Adjust this import path as per your project structure
import ErrorBoundary from "./components/ErrorBoundary";

const ErrorFallback = (
  <div className="text-center text-red-500 p-4">
    <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
    <p>Maaf, terjadi kesalahan yang tidak terduga.</p>
    <button
      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      onClick={() => window.location.reload()}
    >
      Muat Ulang Halaman
    </button>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Wrapping routes with Layout
    errorElement: ErrorFallback,
    children: [
      {
        path: ":id",
        element: <PlayVideo />,
        errorElement: ErrorFallback,
      },
      {
        path: "e/:id",
        element: <PlayVideo />,
        errorElement: ErrorFallback,
      },
    ],
  },
]);

// Note: This assumes you have a div with id "play-root" in your play.html
const playRoot = document.getElementById("play-root");
if (playRoot) {
  createRoot(playRoot).render(
    <React.StrictMode>
      <ErrorBoundary fallback={ErrorFallback}>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
