import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<div className='text-blue-500 font-bold'>Hello, Kael!</div>
		</StrictMode>,
	);
}
