import React from "react"
import Navbar from "../components/Navbar"
import ProductModal from "../components/ProductModal"

export default function ProductsPage() {

  return (
    <>
      <Navbar/>
      <main>
        <section>
          <div className="max-w-7xl m-auto py-10">
            <button className="btn" onClick={()=>document.getElementById('product-modal').showModal()}>Add</button>
            <ProductModal/>
          </div>
        </section>
      </main>
    </>
  )
}
