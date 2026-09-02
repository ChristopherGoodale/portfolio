export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Christopher Goodale ·{' '}
        <a
          href="https://github.com/ChristopherGoodale"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  )
}
