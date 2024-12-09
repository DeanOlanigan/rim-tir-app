import './App.css';
import { BrowserRouter as Router} from 'react-router-dom';
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './providers/ThemeProvider';
import WebSocketProvider from './providers/WebSocketProvider';

function App() {
    return (
        <WebSocketProvider>
            <ThemeProvider>
                <Router>
                    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
                        <Header />
                        <main style={{ height: '100%' }}>
                            <AppRoutes />
                        </main>
                    </div>
                </Router>
            </ThemeProvider>
        </WebSocketProvider>
    )
}

export default App;
