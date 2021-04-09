import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { ApolloProvider } from '@apollo/client'
import {
  FlexBox,
  MainContent,
  PageContainer,
  theme,
} from '../components/styled-components/styled'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { LogoMenuAndSideNav } from '../components/layout/sideNav'
import { TopNav } from '../components/layout/topNav'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { createApolloClient } from '../lib/apolloClient'
import { initializeFirebase } from '../lib/firebaseClient'
import nookies from 'nookies'
import LoginModal from '../components/layout/loginModal'
import { ConfirmationDialogProvider } from '../lib/dialogHookProvider'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Nunito Sans', sans-serif;
    background-color: ${theme.colors.primaryLight}
  }
  * {
    font-family: 'Nunito Sans', sans-serif;
  }
  // Uploadcare file uploader widget styling.
  .uploadcare--button_primary, .uploadcare--widget__button_type_open { 
    background-color: ${theme.colors.primaryDark};
    border-color: ${theme.colors.primaryDark};
    :focus {
      background-color: ${theme.colors.primaryDark};
      border-color: ${theme.colors.primaryDark};
    }
    :hover {
      cursor: pointer;
      background-color: ${theme.colors.pureBlack};
    }}
`

// initializeFirebase returns ref to firebase.auth()
const firebaseAuth = initializeFirebase()
const apolloClient = createApolloClient()

export default function App({ Component, pageProps }) {
  const [authed, setAuthed] = useState<boolean>(false)

  useEffect(() => {
    if (nookies.get().token) {
      console.log('Has nookie, so authed')
      setAuthed(true)
    } else {
      console.log('No nookie, not authed and clear cache')
      setAuthed(false)
      apolloClient.resetStore()
    }
    const unsubscribe = firebaseAuth.onIdTokenChanged(async (user) => {
      console.log('onIdTokenChanged')
      nookies.destroy(null, 'token')
      if (!user) {
        console.log('Not authed and clear cache')
        setAuthed(false)
        apolloClient.resetStore()
      } else {
        console.log('Authed - get new token')
        const newToken = await user.getIdToken()
        nookies.set(null, 'token', newToken)
        setAuthed(true)
      }
    })

    return () => unsubscribe()
  }, [])

  // force refresh the token every 30 minutes while mounted
  // https://github.com/colinhacks/next-firebase-ssr/blob/master/auth.tsx
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log('refreshing token...')
      const user = firebaseAuth.currentUser
      if (user) await user.getIdToken(true)
    }, 30 * 60 * 1000)

    return () => clearInterval(handle)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>SpotMe Fitness Admin Dashboard</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&family=Nunito:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <GlobalStyle />
      <ApolloProvider client={apolloClient}>
        <ConfirmationDialogProvider>
          <PageContainer>
            <LogoMenuAndSideNav />
            <FlexBox align="center">
              <TopNav />
              <MainContent>
                {authed && <Component {...pageProps} />}
              </MainContent>
              <ToastContainer style={{ width: '360px' }} />
            </FlexBox>
            <LoginModal isOpen={!authed} />
          </PageContainer>
        </ConfirmationDialogProvider>
      </ApolloProvider>
    </ThemeProvider>
  )
}
