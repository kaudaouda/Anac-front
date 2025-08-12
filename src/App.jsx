import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SubNav from './components/SubNav'
import NewsInfo from './components/NewsInfo'

function App() {

  return (
    <>
      <SubNav />
      <NewsInfo />
      <Header />
    </>
  )
}

export default App
