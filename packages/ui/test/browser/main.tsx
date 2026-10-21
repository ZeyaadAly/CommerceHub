import { createRoot } from 'react-dom/client';
import { Compositions } from './compositions.js';
import './fixture.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing test fixture root');
createRoot(root).render(<Compositions />);
