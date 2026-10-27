export default function Logo3D({ className = '' }: { className?: string }) {
  return (<span className={`relative inline-block font-sora font-extrabold tracking-tight ${className}`}>
    <span aria-hidden className="logo3d-ext absolute inset-0">ZimBeats</span>
    <span className="logo3d-face relative">ZimBeats</span></span>)
}
