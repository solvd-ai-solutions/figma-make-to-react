import React from 'react'

export interface GeneratedProps {
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  text6?: string
}
export default function Generated(props: GeneratedProps) {
  return (
        <html><head></head><body><div className="custom-section">
      <header className="header">
        <nav className="nav">
          <div className="nav-item">{props.text1 ?? "Home"}</div>
          <div className="nav-item">{props.text2 ?? "About"}</div>
          <div className="nav-item">{props.text3 ?? "Contact"}</div>
        </nav>
      </header>
      <main className="main">
        <section className="hero">
          <h1 className="title">{props.text4 ?? "Welcome to Your App"}</h1>
          <p className="subtitle">{props.text5 ?? "Built with Figma Make"}</p>
        </section>
      </main>
      <footer className="footer">
        <p>{props.text6 ?? "© 2024 Your App"}</p>
      </footer>
    </div>
    
    </body></html>
  )
}
