import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Header';
import { ClaudeCodeDashboard } from './pages/ClaudeCodeDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-space-black">
          <Header />
          <main>
            <ClaudeCodeDashboard />
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
