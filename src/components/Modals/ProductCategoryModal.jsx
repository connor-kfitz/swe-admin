import { useState, useEffect, useRef } from "react";
import { db, storage } from "../../firebase/firebase";
import { collection, addDoc, doc, setDoc, Timestamp, serverTimestamp, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

class ProductCategory {
  constructor(name, image) {
    this.name = name;
    this.image = image;
  }
}
export default function ProductCategoryModal({ editProductCategoryData, setEditProductCategoryData, setProductCategories }) {

  const [postData, setPostData] = useState(new ProductCategory("", "", "", "", { file: null, filePath: "", path: "", src: "" }, [], ""));
  const [formErrors, setFormErrors] = useState({ name: false });

  const deleteImageRef = useRef("");

  useEffect(() => {
    document.getElementById('product-category-modal').addEventListener("close", () => {
      setPostData(new ProductCategory("", { file: null, filePath: "", path: "", src: "" }));
      setEditProductCategoryData(null);
      deleteImageRef.current = "";
    });
  });;

  useEffect(() => {
    if (editProductCategoryData) setPostData({ ...editProductCategoryData, "image": { file: null, filePath: "", path: editProductCategoryData.image.path, src: editProductCategoryData.image.src }});
  }, [editProductCategoryData]);


  async function uploadFiles() {
    if (!postData.image.file) return;
    const imageRef = ref(storage, `images/productCategories/${postData.image.file.name}`);
    const upload = await uploadBytes(imageRef, postData.image.file);
    const url = await getDownloadURL(upload.ref);
    return { src: url, path: `images/productCategories/${postData.image.file.name}` };
  };

  async function deleteFile(path) {
    const imageDocRef = ref(storage, path);
    await deleteObject(imageDocRef);
  }

  function setImage(event) {
    event.preventDefault();
    deleteImageRef.current = postData.image.path;
    setPostData((previous) => ({ ...previous, 'image': { file: event.target.files[0], filePath: URL.createObjectURL(event.target.files[0]), path: "", src: "" }}));
  }

  function removeImage(event) {
    event.preventDefault();
    deleteImageRef.current = postData.image.path;
    setPostData((previous) => ({ ...previous, 'image': { file: null, filePath: "", path: "", src: "" }}));
  }

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
    try {
      const imageURL = await uploadFiles();
      const docRef = await addDoc(collection(db, "productCategories"), {
        ...postData,
        'image': imageURL,
        'createdAt': serverTimestamp()
      })
      setProductCategories((previous) => [...previous,
      {
        ...postData,
        'image': imageURL,
        'createdAt': Timestamp.fromDate(new Date()),
        'id': docRef.id
      }]);
      document.getElementById('product-category-modal').close();
    } catch (error) {
      console.log('Failed to add article', error);
    }
  }

  async function editProductCategory(event) {
    event.preventDefault();
    console.log(editProductCategoryData);
    if (!checkEmptyFormFields()) return;
    try {
      if (deleteImageRef.current) deleteFile(deleteImageRef.current);
      const imageURL = await uploadFiles();
      await setDoc(doc(db, "productCategories", editProductCategoryData.id), {
        ...postData,
        'image': imageURL ? imageURL : { src: postData.image.src, path: postData.image.path },
        'createdAt': new Timestamp(editProductCategoryData.createdAt.seconds, editProductCategoryData.createdAt.nanoseconds)
      });
      setProductCategories((previous) => previous.map((product) => {
        if (editProductCategoryData.id === product.id) {
          return {
            ...postData,
            'id': editProductCategoryData.id,
            'image': imageURL ? imageURL : { src: postData.image.src, path: postData.image.path },
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
            <div>
              <input
                className="mb-6"
                type="file"
                onChange={(event) => { if (event.target.files[0]) setImage(event) }}
              />
              <div className="flex flex-wrap">
                {(postData.image.src || postData.image.filePath) &&
                  <div className="h-36 max-h-36 mr-3 mb-3 flex">
                    <img src={postData.image.src ? postData.image.src : postData.image.filePath} alt="Upload Preview" />
                    <button className="btn h-full rounded-s-none" onClick={(event) => removeImage(event)}>X</button>
                  </div>
                }
              </div>
            </div>
            <div className="flex justify-end mt-10">
              <button className="btn mr-3">Close</button>
              {editProductCategoryData ?
                <button className="btn" onClick={editProductCategory}>Edit</button>
                :
                <button className="btn" onClick={addProductCategory}>Add</button>
              }
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}
