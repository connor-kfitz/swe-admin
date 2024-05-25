import React, { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import ProductModal from "../components/ProductModal"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProductsPage() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  },[])

  async function getProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    let products = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data['id'] = doc.id;
      products.push(data);
    });
    setProducts(products);
  }

  async function deleteProduct(deleteProduct) {
    await deleteDoc(doc(db, "products", deleteProduct.id));
    setProducts((previous) => previous.filter((product) => product.id !== deleteProduct.id))
  }

  function addProductClientSide(product) {
    setProducts((previous) => [...previous, product]);
  }

  return (
    <>
      <Navbar/>
      <main className="pt-6">
        <section>
          <div className="max-w-7xl m-auto py-10">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden border rounded p-10 pb-16">
                  <button className="btn mb-6 min-h-0 h-10" onClick={()=>document.getElementById('product-modal').showModal()}>Add</button>
                  <table
                    className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                    <thead
                      className="border-b border-neutral-200 bg-white font-medium dark:border-white/10 dark:bg-body-dark">
                      <tr>
                        <th scope="col" className="px-6 py-4">#</th>
                        <th scope="col" className="px-6 py-4">Name</th>
                        <th scope="col" className="px-6 py-4">Model #</th>
                        <th scope="col" className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          className={"border-b border-neutral-200 dark:border-white/10 " + (index % 2 === 0 ? "bg-black/[0.02]" : "")} key={index}>
                          <td className="whitespace-nowrap px-6 py-4 font-medium w-0">{index + 1}</td>
                          <td className="whitespace-nowrap px-6 py-4">{product.name}</td>
                          <td className="whitespace-nowrap px-6 py-4">{product.model}</td>
                          <td className="whitespace-nowrap w-0">
                            <button className="btn h-8 min-h-0 px-3 mr-3" onClick={() => deleteProduct(product)}>Delete</button>
                            <button className="btn h-8 min-h-0 px-3 mr-3">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <ProductModal addProductClientSide={addProductClientSide}/>
          </div>
        </section>
      </main>
    </>
  )
}
