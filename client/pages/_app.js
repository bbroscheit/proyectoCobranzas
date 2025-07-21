import "@/styles/globals.css";
import { FacturacionProvider } from './context/FacturacionContext.js';
import Layout from "./components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <FacturacionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FacturacionProvider>
  );
}
