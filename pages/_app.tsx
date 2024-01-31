import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Theme from '@/components/Theme';
import '@/styles/globals.css'
import '@/styles/pokeslider.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <> 
      <ThemeProvider theme={Theme}>
        <Layout>
          <CssBaseline />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  )
}
