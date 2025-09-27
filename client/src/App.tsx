import { getSampleLinks } from './routes';

function App() {
  return (
    <>
      <h1>@tableau/embedding-api-react samples</h1>
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <h2>Main Application Pages:</h2>
        <ul>
          <li><a href="/home">Home Page - メインランディングページ</a></li>
          <li><a href="/performance">Performance Dashboard - ダッシュボード分析</a></li>
          <li><a href="/pulse">Pulse Metrics - メトリクス監視</a></li>
        </ul>
      </div>
      <h2>Embedding API Samples:</h2>
      {getSampleLinks()}
    </>
  );
}

export default App;
