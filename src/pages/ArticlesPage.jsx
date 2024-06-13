import Navbar from "../components/navs/Navbar"
import ArticleTable from "../components/tables/ArticleTable";
import ArticleModal from "../components/modals/ArticleModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import { useState, useEffect, useRef } from "react"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { ref, deleteObject } from "firebase/storage";

export default function ArticlesPage() {

  const [articles, setArticles] = useState([]);
  const [editArticleData, setEditArticleData] = useState(null);
  const deleteArticleRef = useRef({});

  useEffect(() => {
    getArticles();
  }, [])

  useEffect(() => {
    if (editArticleData) { document.getElementById('article-modal').showModal() }
  }, [editArticleData]);

  async function getArticles() {
    const querySnapshot = await getDocs(collection(db, "articles"));
    let articles = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data['id'] = doc.id;
      articles.push(data);
    });
    setArticles(articles);
  }

  async function deleteArticle(deleteArticle) {
    await deleteFile(deleteArticle);
    await deleteDoc(doc(db, "articles", deleteArticle.id));
    setArticles((previous) => previous.filter((article) => article.id !== deleteArticle.id));
  }

  async function deleteFile(article) {
    const imageDocRef = ref(storage, article.image.path);
    await deleteObject(imageDocRef);
  }

  function transformArticleData(article) {
    const transformedArticle = JSON.parse(JSON.stringify(article));
    transformedArticle.datePublished = unixToDatePicker(transformedArticle.datePublished);
    transformedArticle.createdAt = unixToDatePicker(transformedArticle.createdAt);
    setEditArticleData(transformedArticle);
  }

  function unixToDatePicker(date) {
    if (!date) return "";
    date = new Date(date.seconds * 1000);
    return date.toISOString().slice(0, 10);
  }

  return (
    <>
      <Navbar />
      <main className="pt-6">
        <section>
          <div className="max-w-7xl m-auto py-10">
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden border rounded p-10">
                    <button className="btn min-h-0 h-10" onClick={() => document.getElementById('article-modal').showModal()}>Add</button>
                    {articles.length > 0 && <ArticleTable articles={articles} deleteArticleRef={deleteArticleRef} transformArticleData={transformArticleData} />}
                  </div>
                </div>
              </div>
            </div>
            <ArticleModal editArticleData={editArticleData} setEditArticleData={setEditArticleData} setArticles={setArticles} />
            <DeleteConfirmationModal deleteRef={deleteArticleRef} deleteFunction={deleteArticle}/>
          </div>
        </section>
      </main>
    </>
  )
}
