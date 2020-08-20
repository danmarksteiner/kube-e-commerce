import 'bootstrap/dist/css/bootstrap.css';
// Custom App Component
// Acts like a wrapper for the app so we can include global bootstrap css file
// Ref - https://github.com/vercel/next.js/blob/canary/errors/css-global.md
export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
