import { Component, lazy, ReactNode, Suspense } from 'react'
const Scene3D = lazy(() => import('./Scene3D'))
class Safe extends Component<{ children: ReactNode }, { bad: boolean }> {
  state = { bad: false }
  static getDerivedStateFromError() { return { bad: true } }
  render() { return this.state.bad ? null : this.props.children }
}
export default function Scene3DLazy() { return <Safe><Suspense fallback={null}><Scene3D /></Suspense></Safe> }
