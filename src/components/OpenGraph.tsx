import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import graphData from '../graph.json';

// Define the type for graphData to ensure TypeScript compatibility
interface GraphData {
  [key: string]: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
}

const OpenGraph: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Cast graphData to GraphData to avoid TypeScript errors
  const data = graphData as GraphData;
  
  const ogData = data[path] || data['/']; // Default to home if route not found

  return (
    <Helmet>
      <title>{ogData.title}</title>  
      <meta property="og:title" content={ogData.title} />
      <meta property="og:description" content={ogData.description} />
      <meta property="og:image" content={ogData.image} />
      <meta property="og:url" content={ogData.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="VideoID Host" />
    </Helmet>
  );
};

export default OpenGraph;