import './App.css';
import { BrowserRouter as Router} from 'react-router-dom';
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
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
    )
}

export default App;
