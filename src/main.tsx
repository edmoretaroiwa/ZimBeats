import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import { PlayerProvider } from './components/PlayerContext'
import Home from './pages/Home'
import SongPage from './pages/SongPage'
import UploadPage from './pages/UploadPage'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><PlayerProvider><Routes><Route element={<Layout />}>
    <Route path="/" element={<Home />} /><Route path="/song/:id" element={<SongPage />} />
    <Route path="/upload" element={<UploadPage />} /></Route></Routes></PlayerProvider></BrowserRouter></React.StrictMode>)
