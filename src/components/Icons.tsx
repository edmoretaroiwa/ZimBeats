const I = ({ d, c = 'w-5 h-5' }: { d: string; c?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={c}><path d={d} /></svg>
type P = { c?: string }
export const Play = (p: P) => <I {...p} d="M8 5v14l11-7z" />
export const Pause = (p: P) => <I {...p} d="M6 5h4v14H6zm8 0h4v14h-4z" />
export const Next = (p: P) => <I {...p} d="M6 18l8.5-6L6 6zm10-12v12h2V6z" />
export const Prev = (p: P) => <I {...p} d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
export const Vol = (p: P) => <I {...p} d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0014 8v8a4.5 4.5 0 002.5-4z" />
export const Share = (p: P) => <I {...p} d="M18 16a3 3 0 00-2.4 1.2l-6.3-3.7a3 3 0 000-2.9l6.3-3.7A3 3 0 1015 5.6l-6.3 3.7a3 3 0 100 5.4l6.3 3.7A3 3 0 1018 16z" />
export const Down = (p: P) => <I {...p} d="M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z" />
export const Home = (p: P) => <I {...p} d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
export const Search = (p: P) => <I {...p} d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 109.5 16a6.5 6.5 0 004.2-1.6l.3.3v.8l5 5 1.5-1.5zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
export const Upload = (p: P) => <I {...p} d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
