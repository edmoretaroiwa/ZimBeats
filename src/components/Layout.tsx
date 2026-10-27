import { Link, NavLink, Outlet } from 'react-router-dom'
import Player from './Player'
import Backdrop from './Backdrop'
import { Home, Search, Upload } from './Icons'
export default function Layout() {
  const tab = ({ isActive }: { isActive: boolean }) => `flex flex-col items-center gap-0.5 text-[11px] ${isActive ? 'text-gold' : 'text-zinc-400'}`
  const top = ({ isActive }: { isActive: boolean }) => isActive ? 'text-gold' : 'text-zinc-400 hover:text-white'
  return (<div className="min-h-screen pb-44 md:pb-28"><Backdrop />
    <div className="flex h-1"><i className="flex-1 bg-green-600" /><i className="flex-1 bg-gold" /><i className="flex-1 bg-red-600" /><i className="flex-1 bg-black" /></div>
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="font-sora text-xl font-extrabold tracking-tight"><span className="bg-gradient-to-r from-gold to-flame bg-clip-text text-transparent">ZimBeats</span></Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <NavLink to="/" end className={top}>Home</NavLink><NavLink to="/upload" className={top}>Upload</NavLink></nav></div></header>
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6"><Outlet /></main>
    <Player />
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-14 grid-cols-3 items-center border-t border-line bg-bg md:hidden">
      <NavLink to="/" end className={tab}><Home />Home</NavLink>
      <Link to="/?search=1" className="flex flex-col items-center gap-0.5 text-[11px] text-zinc-400"><Search />Search</Link>
      <NavLink to="/upload" className={tab}><Upload />Upload</NavLink></nav></div>)
}
