import { useState } from "react";

export default function DeleteConfirmationModal({deleteRef, deleteFunction}) {

  const [loading, setLoading] = useState(false);

  return (
    <dialog id="delete-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Confirmation</h3>
        <p className="py-4">Are you sure you want to delete this product?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn mr-3">Close</button>
            <button className="btn" onClick={async () => {
              setLoading(true);
              await deleteFunction(deleteRef.current);
              deleteRef.current = {}
              setLoading(false);
            }}>
              Delete
              {loading && <span className="loading loading-spinner w-4"></span>}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
