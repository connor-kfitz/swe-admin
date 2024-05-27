import Navbar from "../components/Navbar"
import ProductModal from "../components/ProductModal"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useState, useEffect, useRef } from "react"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";
import ProductTable from "../components/ProductTable";

export default function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [editProductData, setEditProductData] = useState(null);

  const deleteProductRef = useRef({});

  useEffect(() => {
    getProducts();
  },[])

  useEffect(() => {
    if (editProductData) { document.getElementById('product-modal').showModal() }
  },[editProductData]);

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
    await deleteFiles(deleteProduct);
    await deleteDoc(doc(db, "products", deleteProduct.id));
    setProducts((previous) => previous.filter((product) => product.id !== deleteProduct.id));
  }

  async function deleteFiles(product) {
    for (const image of product.images) {
      const imageDocRef = ref(storage, image.path);
      await deleteObject(imageDocRef);
    }
  }

  function transformProductData(product) {
    const transformedProduct = JSON.parse(JSON.stringify(product));
    transformedProduct.table = objectToNestedArray(transformedProduct.table);
    setEditProductData(transformedProduct);
  }

  function objectToNestedArray(object) {
    let nestedArray = [];
    for (const row in object) { 
      nestedArray.push(object[row]); 
    }
    return nestedArray;
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
                  <button className="btn mb-6 min-h-0 h-10" onClick={() => document.getElementById('product-modal').showModal()}>Add</button>
                  {products.length > 0 && <ProductTable products={products} deleteProductRef={deleteProductRef} transformProductData={transformProductData}/>}
                </div>
              </div>
            </div>
          </div>
          <ProductModal editProductData={editProductData} setEditProductData={setEditProductData} setProducts={setProducts}/>
          <DeleteConfirmationModal deleteProductRef={deleteProductRef} deleteProduct={deleteProduct} />
          </div>
        </section>
      </main>
    </>
  )
}
