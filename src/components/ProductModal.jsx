import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProductModal() {

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    description: '',
    videoURL: ''
  })

  const [imageUpload, setImageUpload] = useState();

  const [feature, setFeature] = useState("");
  const [features, setFeatures]= useState([]);

  async function uploadFile () {
    if (!imageUpload) return;
    const imageRef = ref(storage, `images/${imageUpload.name}`);
    const upload = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(upload.ref);
  };

  function handleFormChange(event) {
    const {name, value} = event.currentTarget
    setFormData((prev) => ({...prev, [name]: value}))
  }

  function addFeature(event) {
    event.preventDefault();
    if (!feature) return;
    setFeatures((previous) => [...previous, feature]);
    setFeature("");
  }

  function deleteFeature(event, deleteIndex) {
    event.preventDefault();
    setFeatures(features.filter((feature, index) => index !== deleteIndex));
  }

  async function addProduct(event) {
    event.preventDefault();
    try {
        await addDoc(collection(db, "products"), {
            formData
        })
        document.getElementById('product-modal').close()
    } catch {
        console.log('Failed to add product');
    }
  }

  return (
    <dialog id="product-modal" className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-6">Add Product</h3>
        <div>
          <form method="dialog">
            <label className="form-control w-full mb-3">
              <div className="label"> 
                <span className="label-text">Name:</span>
              </div>
              <input name="name" onChange={handleFormChange} type="text" className="input input-bordered w-full"/>
            </label>
            <label className="form-control w-full mb-3">
              <div className="label"> 
                <span className="label-text">Model:</span>
              </div>
              <input name="model" onChange={handleFormChange} type="text" className="input input-bordered w-full"/>
            </label>
            <label className="form-control w-full mb-3">
              <div className="label"> 
                <span className="label-text">Description:</span>
              </div>
              <textarea name="description" onChange={handleFormChange} className="textarea textarea-bordered"></textarea>
            </label>
            <label className="form-control w-full mb-3">
              <div className="label"> 
                <span className="label-text">Features:</span>
              </div>
              <div className="flex mb-3">
                <input onChange={(event) => setFeature(event.target.value)} value={feature} type="text" className="input input-bordered w-full mr-4"/>
                <button className="btn px-6" onClick={addFeature}>Add</button>
              </div>
              <ul>
                {features.map((feature, index) => (
                  <li className="flex" key={index}>
                    <input disabled type="text" className="input input-bordered w-full mb-3 mr-4" value={feature}/>
                    <button className="btn" onClick={(event) => deleteFeature(event, index)}>Delete</button>
                  </li>
                ))}
              </ul>

            </label>
            <label className="form-control w-full mb-3">
              <div className="label"> 
                <span className="label-text">Video URL:</span>
              </div>
              <input name="videoURL" type="text" onChange={handleFormChange} className="input input-bordered w-full"/>
            </label>
            <div className="App">
              <input
                type="file"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                }}
              />
              <button onClick={uploadFile}>Upload</button>
            </div>
            <div className="flex justify-end mt-10">
              <button className="btn mr-3">Close</button>
              <button className="btn" onClick={addProduct}>Add</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}
