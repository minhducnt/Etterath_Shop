import store from '@/redux/store';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { GoogleOAuthProvider } from '@react-oauth/google';

import '../styles/index.scss';

if (typeof window !== 'undefined') {
    require('bootstrap/dist/js/bootstrap');
}

if (typeof window !== 'undefined') {
    ReactModal.setAppElement('body');
}

// Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function App({ Component, pageProps }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <Provider store={store}>
                <Elements stripe={stripePromise}>
                    <div id="root">
                        <Component {...pageProps} />
                    </div>
                </Elements>
            </Provider>
        </GoogleOAuthProvider>
    );
}
