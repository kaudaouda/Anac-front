import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SubNav from './components/SubNav'
import NewsInfo from './components/NewsInfo'
import Menu from './components/Menu'
import BigHeader from './components/BigHeader'
import Faq from './components/Faq'
import Footer from './components/Footer'

function App() {

  return (
    <>
      <SubNav />
      <NewsInfo />
      <Header />
      <Menu />
      <BigHeader />
      <Faq />
      <Footer />
    </>
  )
}

export default App
