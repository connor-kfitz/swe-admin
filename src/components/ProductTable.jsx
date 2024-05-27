
export default function ProductTable({ products, deleteProductRef, transformProductData }) {
  return (
    <table
      className="min-w-full text-left text-sm font-light text-surface dark:text-white">
      <thead
        className="border-b border-neutral-200 bg-white font-medium dark:border-white/10 dark:bg-body-dark">
        <tr>
          <th scope="col" className="px-6 py-4">#</th>
          <th scope="col" className="px-6 py-4">Name</th>
          <th scope="col" className="px-6 py-4">Model #</th>
          <th scope="col" className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr
            className={"border-b border-neutral-200 dark:border-white/10 " + (index % 2 === 0 ? "bg-black/[0.02]" : "")} key={index}>
            <td className="whitespace-nowrap px-6 py-4 font-medium w-0">{index + 1}</td>
            <td className="whitespace-nowrap px-6 py-4 w-0">{product.name}</td>
            <td className="whitespace-nowrap px-6 py-4">{product.model}</td>
            <td className="whitespace-nowrap w-0">
              <button className="btn h-8 min-h-0 px-3 mr-3" onClick={() => {
                document.getElementById('delete-modal').showModal();
                deleteProductRef.current = product;
              }}>Delete</button>
              <button className="btn h-8 min-h-0 px-3 mr-3" onClick={() => transformProductData(product)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
