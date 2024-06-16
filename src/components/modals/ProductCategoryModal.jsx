import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, doc, setDoc, Timestamp, serverTimestamp, query, where, getDocs, updateDoc } from "firebase/firestore";

class ProductCategory {
  constructor(name) {
    this.name = name;
  }
}
export default function ProductCategoryModal({ editProductCategoryData, setEditProductCategoryData, setProductCategories }) {

  const [postData, setPostData] = useState(new ProductCategory(""));
  const [formErrors, setFormErrors] = useState({ name: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('product-category-modal').addEventListener("close", () => {
      setPostData(new ProductCategory(""));
      setEditProductCategoryData(null);
    });
  });;

  useEffect(() => {
    if (editProductCategoryData) setPostData({ ...editProductCategoryData });
  }, [editProductCategoryData]);

  function handleFormChange(event) {
    const { name, value } = event.currentTarget;
    setPostData((prev) => ({ ...prev, [name]: value }));
  }

  async function updateProductsCategories() {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("category", "==", editProductCategoryData.name));
    const querySnapshot = await getDocs(q);
    let products = [];
    querySnapshot.forEach((doc) => {
      products.push(doc.id);
    });
    products.map(async (product) => {
      const productRef = doc(db, "products", product);
      await updateDoc(productRef, {
        category: postData.name
      })
    })
  }

  async function addProductCategory(event) {
    event.preventDefault();
    if (!checkEmptyFormFields()) return;
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "productCategories"), {
        ...postData,
        'createdAt': serverTimestamp()
      })
      setProductCategories((previous) => [...previous,
      {
        ...postData,
        'createdAt': Timestamp.fromDate(new Date()),
        'id': docRef.id
      }]);
      document.getElementById('product-category-modal').close();
    } catch (error) {
      console.log('Failed to add article', error);
    }
    setLoading(false);
  }

  async function editProductCategory(event) {
    event.preventDefault();
    if (!checkEmptyFormFields()) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "productCategories", editProductCategoryData.id), {
        ...postData,
        'createdAt': new Timestamp(editProductCategoryData.createdAt.seconds, editProductCategoryData.createdAt.nanoseconds)
      });
      setProductCategories((previous) => previous.map((product) => {
        if (editProductCategoryData.id === product.id) {
          return {
            ...postData,
            'id': editProductCategoryData.id,
            'createdAt': new Timestamp(editProductCategoryData.createdAt.seconds, editProductCategoryData.createdAt.nanoseconds)
          }
        } else {
          return product;
        }
      }))
      await updateProductsCategories();
      document.getElementById('product-category-modal').close();
    } catch (error) {
      console.log('Failed to add article', error);
    }
    setLoading(false);
  }

  function checkEmptyFormFields() {
    if (postData.name) return true;
    setFormErrors({ name: postData.name ? false : true });
    return false;
  }

  return (
    <dialog id="product-category-modal" className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-6">Add Article</h3>
        <div>
          <form method="dialog">
            <label className="form-control w-full mb-6">
              <div className="label">
                <span className="label-text">Name</span>
                <span className="label-text-alt"><i>Required</i></span>
              </div>
              <input name="name" onChange={handleFormChange} value={postData.name} type="text" className={"input input-bordered w-full" + (formErrors.name ? " border-red-600" : "")} />
            </label>
            <div className="flex justify-end mt-10">
              <button className="btn mr-3">Close</button>
              {editProductCategoryData ?
                <button className="btn" onClick={editProductCategory}>
                  Edit
                  {loading && <span className="loading loading-spinner w-4"></span>}
                </button>
                :
                <button className="btn" onClick={addProductCategory}>
                  Add
                  {loading && <span className="loading loading-spinner w-4"></span>}
                </button>
              }
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}
