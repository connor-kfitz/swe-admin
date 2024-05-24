import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function ProductModal() {

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    description: '',
    videoURL: ''
  })

  function handleFormChange(event) {
    const {name, value} = event.currentTarget
    setFormData((prev) => ({...prev, [name]: value}))
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
                <span className="label-text">Video URL:</span>
              </div>
              <input name="videoURL" type="text" onChange={handleFormChange} className="input input-bordered w-full"/>
            </label>
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
