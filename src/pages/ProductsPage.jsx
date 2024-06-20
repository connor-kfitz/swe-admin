import Navbar from "../components/navs/Navbar";
import ProductModal from "../components/modals/ProductModal"
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import ProductTable from "../components/tables/ProductTable";
import ProductCategoryTable from "../components/tables/ProductCategoryTable";
import ProductCategoryModal from "../components/modals/ProductCategoryModal";
import { useState, useEffect, useRef } from "react"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { ref, deleteObject } from "firebase/storage";

export default function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [editProductData, setEditProductData] = useState(null);
  const [productCategories, setProductCategories] = useState([]);
  const [editProductCategoryData, setEditProductCategoryData] = useState(null);

  const deleteRef = useRef({});

  useEffect(() => {
    getProducts();
    getProductCategories();
  },[])

  useEffect(() => {
    if (editProductData) { document.getElementById('product-modal').showModal() }
  },[editProductData]);

  useEffect(() => {
    if (editProductCategoryData) { document.getElementById('product-category-modal').showModal() }
  }, [editProductCategoryData]);

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

  async function getProductCategories() {
    const querySnapshot = await getDocs(collection(db, "productCategories"));
    let productCategories = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data['id'] = doc.id;
      productCategories.push(data);
    });
    setProductCategories(productCategories);
  }

  async function deleteItem(item) {
    if (deleteRef.current.table) {
      deleteProduct(item);
      return;
    }
    deleteProductCategory(item);
  }

  async function deleteProduct(deleteProduct) {
    await deleteFiles(deleteProduct);
    await deleteDoc(doc(db, "products", deleteProduct.id));
    setProducts((previous) => previous.filter((product) => product.id !== deleteProduct.id));
  }

  async function deleteProductCategory(deleteProductCategory) {
    await deleteDoc(doc(db, "productCategories", deleteProductCategory.id));
    setProductCategories((previous) => previous.filter((productCategory) => productCategory.id !== deleteProductCategory.id));
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

  function transformProductCategoryData(productCategory) {
    const transformedProductCategory = JSON.parse(JSON.stringify(productCategory));
    setEditProductCategoryData(transformedProductCategory);
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
                <div className="overflow-hidden border rounded p-10">
                  <h2 className="text-lg font-bold mb-6">Products</h2>
                  <button className="btn min-h-0 h-10" onClick={() => document.getElementById('product-modal').showModal()}>Add</button>
                  {products.length > 0 && <ProductTable products={products} deleteRef={deleteRef} transformProductData={transformProductData}/>}
                </div>
              </div>
            </div>
          </div>
            <ProductModal editProductData={editProductData} setEditProductData={setEditProductData} setProducts={setProducts} productCategories={productCategories} />
          </div>
        </section>
        <section>
          <div className="max-w-7xl m-auto py-10">
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden border rounded p-10">
                    <h2 className="text-lg font-bold mb-6">Product Categories</h2>
                    <button className="btn min-h-0 h-10" onClick={() => document.getElementById('product-category-modal').showModal()}>Add</button>
                    {productCategories.length > 0 && <ProductCategoryTable productCategories={productCategories} deleteRef={deleteRef} transformProductCategoryData={transformProductCategoryData}/>}
                  </div>
                </div>
              </div>
            </div>
            <ProductCategoryModal editProductCategoryData={editProductCategoryData} setEditProductCategoryData={setEditProductCategoryData} setProductCategories={setProductCategories}/>
          </div>
        </section>
        <DeleteConfirmationModal deleteRef={deleteRef} deleteFunction={deleteItem}/>
      </main>
    </>
  )
}
