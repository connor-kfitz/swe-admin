export default function Navbar() {
  return (
    <nav className="navbar bg-base-100 max-w-7xl m-auto">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">SWExposures</a>
      </div>
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal px-1">
          <li><a>Products</a></li>
          <li><a>Articles</a></li>
          <li><a>Testimonials</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn">Logout</button>
      </div>
    </nav>
  )
}
