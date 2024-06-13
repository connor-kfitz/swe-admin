export default function DeleteConfirmationModal({deleteRef, deleteFunction}) {
  return (
    <dialog id="delete-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Confirmation</h3>
        <p className="py-4">Are you sure you want to delete this product?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn mr-3">Close</button>
            <button className="btn" onClick={() => {
              deleteFunction(deleteRef.current)
              deleteRef.current = {}
            }}>Delete</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}