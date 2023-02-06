import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';
import { ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Theme from '@/components/Theme';

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
