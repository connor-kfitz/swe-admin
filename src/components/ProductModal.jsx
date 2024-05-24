import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProductModal() {

  const [postData, setPostData] = useState({
    name: '',
    model: '',
    description: '',
    features: [],
    videoURL: '',
    images: [],
    specifications: [],
    table: [["", ""], ["", ""], ["", ""]]
  })

  const [feature, setFeature] = useState("");
  const [specification, setSpecification] = useState("")
  const [imageUpload, setImageUpload] = useState();

  async function uploadFile () {
    if (!imageUpload) return;
    const imageRef = ref(storage, `images/${imageUpload.name}`);
    const upload = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(upload.ref);
  };

  function handleFormChange(event) {
    const {name, value} = event.currentTarget
    setPostData((prev) => ({...prev, [name]: value}))
  }

  function addFeature(event) {
    event.preventDefault();
    if (!feature) return;
    setPostData((previous) => ({...previous, ['features']: [...previous.features, feature]}))
    setFeature("");
  }

  function deleteFeature(event, deleteIndex) {
    event.preventDefault();
    setPostData((previous) => ({...previous, ['features']: [...previous.features.filter((feature, index) => index !== deleteIndex)]}));
  }

  function addSpecification(event) {
    event.preventDefault();
    if (!specification) return;
    setPostData((previous) => ({...previous, ['specifications']: [...previous.specifications, specification]}));
    setSpecification("");
  }

  function deleteSpecification(event, deleteIndex) {
    event.preventDefault();
    setPostData((previous) => ({...previous, ['specifications']: [...previous.specifications.filter((specification, index) => index !== deleteIndex)]}));
  }

  async function addProduct(event) {
    event.preventDefault();
    try {
        await addDoc(collection(db, "products"), {
            postData
        })
        document.getElementById('product-modal').close()
    } catch {
        console.log('Failed to add product');
    }
  }

  function addTableRow(event) {
    event.preventDefault();
    setPostData((previous) => ({...previous, ['table']: [...previous.table, new Array(postData.table[0].length).fill("")]}));
  }

  function addTableColumn(event) {
    event.preventDefault();
    const newTable = postData.table.map(row => ([...row, ""]));
    setPostData((previous) => ({...previous, ['table']: newTable}));
  }

  function deleteTableRow(event, row) {
    event.preventDefault();
    if (postData.table.length <= 2) return;
    const newTable = postData.table.filter((oldRow, index) => index !== row);
    setPostData((previous) => ({...previous, ['table']: newTable}));

  }

  function deleteTableColumn(event, column) {
    event.preventDefault();
    if (postData.table[0].length <= 2) return;
    const newTable = postData.table.map((oldRow) => oldRow.filter((oldColum, index) => index !== column));
    setPostData((previous) => ({...previous, ['table']: newTable}));
  }

  function updateTableCell(event, updateRow, updateColumn) {
    const newTable = postData.table.map((row, rowIndex) => row.map((col, colIndex) => updateRow === rowIndex && updateColumn === colIndex ? event.target.value : col));
    setPostData((previous) => ({...previous, ['table']: newTable}));
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
                {postData.features.map((feature, index) => (
                  <li className="flex" key={index}>
                    <input disabled type="text" className="input input-bordered w-full mb-3 mr-4" value={feature}/>
                    <button className="btn" onClick={(event) => deleteFeature(event, index)}>Delete</button>
                  </li>
                ))}
              </ul>
            </label>
            <label className="form-control w-full mb-3">
              <div className="label"> 
                <span className="label-text">Specifications:</span>
              </div>
              <div className="flex mb-3">
                <input onChange={(event) => setSpecification(event.target.value)} value={specification} type="text" className="input input-bordered w-full mr-4"/>
                <button className="btn px-6" onClick={addSpecification}>Add</button>
              </div>
              <ul>
                {postData.specifications.map((specification, index) => (
                  <li className="flex" key={index}>
                    <input disabled type="text" className="input input-bordered w-full mb-3 mr-4" value={specification}/>
                    <button className="btn" onClick={(event) => deleteSpecification(event, index)}>Delete</button>
                  </li>
                ))}
              </ul>
            </label>
            <label className="form-control w-full mb-6">
              <div className="label"> 
                <span className="label-text">Video URL:</span>
              </div>
              <input name="videoURL" type="text" onChange={handleFormChange} className="input input-bordered w-full"/>
            </label>
            <div className="mb-3">
              <input
                type="file"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                }}
              />
              <button onClick={uploadFile}>Upload</button>
            </div>
            <label className="form-control w-full mb-3">
              <div className="label"> 
                <span className="label-text">Specifications Table:</span>
              </div>
            </label>
            <div className="mb-3">
                <button className="btn mr-3" onClick={addTableRow}>Add Row</button>
                <button className="btn" onClick={addTableColumn}>Add Column</button>
              </div>
              <table className="table border-2 mb-3">
              {postData.table.map((row, rowIndex) => (
                <tr className={rowIndex % 2 === 0 ? "bg-base-200" : null}>
                  {row.map((cell, colIndex) => (
                    <td className="border-2 p-0" key={colIndex}><input value={cell} onChange={(event) => updateTableCell(event, rowIndex, colIndex)} className="w-full text-center bg-inherit p-3 input rounded-none"/></td>
                  ))}
                  <td className="p-0 border-2"><button className="block w-full py-4 px-3" onClick={(event) => (deleteTableRow(event, rowIndex))}>Delete</button></td>
                </tr>
              ))}
              <tr>
                {Array(postData.table[0].length).fill(0).map((cell, index) => (
                  <td className="p-0 border-2"><button className="block w-full py-4 px-3" onClick={(event) => deleteTableColumn(event, index)}>Delete</button></td>
                ))}
              </tr>
              </table>
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
