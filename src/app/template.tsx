export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in animation-duration-150 ease-out fill-mode-both">
      {children}
    </div>
  )
}
