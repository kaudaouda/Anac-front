import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SubNav from './components/SubNav'
import NewsInfo from './components/NewsInfo'
import Menu from './components/Menu'

function App() {

  return (
    <>
      <SubNav />
      <NewsInfo />
      <Header />
      <Menu />
    </>
  )
}

export default App
