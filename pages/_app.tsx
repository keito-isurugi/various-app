import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';
import { ThemeProvider } from '@mui/material/styles';
import { StylesProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Theme from '@/components/Theme';
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <> 
    <StylesProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <Layout>
          <CssBaseline />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </StylesProvider>
    </>
  )
}
