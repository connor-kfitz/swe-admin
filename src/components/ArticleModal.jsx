import { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, doc, setDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

class Article {
  constructor(title, author, datePublished, body, image, tags, createdAt) {
    this.title = title;
    this.author = author;
    this.datePublished = datePublished;
    this.body = body;
    this.image = image;
    this.tags = tags;
    this.createdAt = createdAt;
  }
}

export default function ArticleModal({ editArticleData, setEditArticleData, setArticles }) {

  const [postData, setPostData] = useState(new Article("", "", "", "", { file: null, filePath: "", path: "", src: "" }, [], ""));
  const [formErrors, setFormErrors] = useState({ title: false, author: false, datePublished: false, body: false });
  const [tag, setTag] = useState("");

  const deleteImageRef = useRef("");

  useEffect(() => {
    document.getElementById('article-modal').addEventListener("close", () => {
      setPostData(new Article("", "", "", "", {file: null, filePath: "", path: "", src: ""}, [], ""));
      setTag("");
      setEditArticleData(null);
      deleteImageRef.current = "";
    });
  });;

  useEffect(() => {
    if (editArticleData) setPostData({ ...editArticleData, "image": { file: null, filePath: "", path: editArticleData.image.path, src: editArticleData.image.src }});
  }, [editArticleData]);

  async function uploadFiles() {
    if (!postData.image.file) return;
    const imageRef = ref(storage, `images/articles/${postData.image.file.name}`);
    const upload = await uploadBytes(imageRef, postData.image.file);
    const url = await getDownloadURL(upload.ref);
    return { src: url, path: `images/articles/${postData.image.file.name}`};
  };

  async function deleteFile(path) {
    const imageDocRef = ref(storage, path);
    await deleteObject(imageDocRef);
  }

  function setImage(event) {
    event.preventDefault();
    deleteImageRef.current = postData.image.path;
    setPostData((previous) => ({ ...previous, 'image': { file: event.target.files[0], filePath: URL.createObjectURL(event.target.files[0]), path: "", src: "" } }));
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

  function addTag(event) {
    event.preventDefault();
    if (!tag) return;
    setPostData((previous) => ({ ...previous, 'tags': [...previous.tags, tag] }));
    setTag("");
  }

  function deleteTag(event, deleteIndex) {
    event.preventDefault();
    setPostData((previous) => ({ ...previous, 'tags': [...previous.tags.filter((tag, index) => index !== deleteIndex)] }));
  }

  async function addArticle(event) {
    event.preventDefault();
    if (!checkEmptyFormFields()) return;
    try {
      const imageURL = await uploadFiles();
      const docRef = await addDoc(collection(db, "articles"), {
        ...postData,
        'image': imageURL,
        'datePublished': Timestamp.fromDate(new Date(postData.datePublished)),
        'createdAt': serverTimestamp()
      })
      setArticles((previous) => [...previous, 
        { ...postData, 
        'image': imageURL, 
        'datePublished': docRef.datePublished, 
        'createdAt': docRef.createdAt,
        'id': docRef.id 
        }]);
      document.getElementById('article-modal').close();
    } catch (error) {
      console.log('Failed to add article', error);
    }
  }

  async function editArticle(event) {
    event.preventDefault();
    if (!checkEmptyFormFields()) return;
    try {
      if (deleteImageRef.current) deleteFile(deleteImageRef.current);
      const imageURL = await uploadFiles();
      await setDoc(doc(db, "articles", editArticleData.id), {
        ...postData,
        'image': imageURL ? imageURL : { src: postData.image.src, path: postData.image.path },
        'datePublished': Timestamp.fromDate(new Date(postData.datePublished)),
        'createdAt': Timestamp.fromDate(new Date (editArticleData.createdAt))
      });

      setArticles((previous) => previous.map((product) => {
        if (editArticleData.id === product.id) {
          return { ...postData,
                  'id': editArticleData.id,
                  'image': imageURL ? imageURL : { src: postData.image.src, path: postData.image.path },
                  'datePublished': Timestamp.fromDate(new Date(postData.datePublished)),
                  'createdAt': Timestamp.fromDate(new Date(editArticleData.createdAt))
                }
        } else {
          return product;
        }
      }))
      document.getElementById('article-modal').close();
    } catch (error) {
      console.log('Failed to add article', error);
    }
  }

  function checkEmptyFormFields() {
    if (postData.title && postData.author && postData.datePublished && postData.body) return true;
    setFormErrors({ title: postData.title ? false : true, author: postData.author ? false : true, datePublished: postData.datePublished ? false : true, body: postData.body ? false : true });
    return false;
  }

  return (
    <dialog id="article-modal" className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-6">Add Article</h3>
        <div>
          <form method="dialog">
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Title</span>
                <span className="label-text-alt"><i>Required</i></span>
              </div>
              <input name="title" onChange={handleFormChange} value={postData.title} type="text" className={"input input-bordered w-full" + (formErrors.title ? " border-red-600" : "")} />
            </label>
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Author</span>
                <span className="label-text-alt"><i>Required</i></span>
              </div>
              <input name="author" onChange={handleFormChange} value={postData.author} type="text" className={"input input-bordered w-full" + (formErrors.author ? " border-red-600" : "")} />
            </label>
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Date</span>
                <span className="label-text-alt"><i>Required</i></span>
              </div>
              <input name="datePublished" onChange={handleFormChange} value={postData.datePublished} type="date" className={"input input-bordered w-full" + (formErrors.datePublished ? " border-red-600" : "")} />
            </label>
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Body</span>
                <span className="label-text-alt"><i>Required</i></span>
              </div>
              <textarea name="body" onChange={handleFormChange} value={postData.body} className={"textarea textarea-bordered" + (formErrors.body ? " border-red-600" : "")}></textarea>
            </label>
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Tags</span>
              </div>
              <div className="flex mb-3">
                <input onChange={(event) => setTag(event.target.value)} value={tag} type="text" className="input input-bordered w-full mr-4" />
                <button className="btn px-6" onClick={addTag}>Add</button>
              </div>
              <ul>
                {postData.tags.map((tag, index) => (
                  <li className="flex" key={index}>
                    <input disabled type="text" className="input input-bordered w-full mb-3 mr-4" value={tag} />
                    <button className="btn" onClick={(event) => deleteTag(event, index)}>Delete</button>
                  </li>
                ))}
              </ul>
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
                    <img src={postData.image.src ? postData.image.src : postData.image.filePath} alt="Upload Preview"/>
                    <button className="btn h-full rounded-s-none" onClick={(event) => removeImage(event)}>X</button>
                  </div>
                }
              </div>
            </div>
            <div className="flex justify-end mt-10">
              <button className="btn mr-3">Close</button>
              {editArticleData ?
                <button className="btn" onClick={editArticle}>Edit</button>
                :
                <button className="btn" onClick={addArticle}>Add</button>
              }
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}
