import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { StyleSheetManager } from 'styled-components'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <Suspense fallback={<div>Loading...</div>}>
            <StyleSheetManager shouldForwardProp={(prop)=>prop!== "shake"}>
                <App />
            </StyleSheetManager>
        </Suspense>
    </Provider>
)
