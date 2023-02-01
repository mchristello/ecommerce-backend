console.log(`Testing to check`);

let deleteProductBtn = document.querySelectorAll('#delete_btn');

// DELETE para eliminar del carrito
const deleteProduct = async(cid, pid)=> {
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result = await response.json()
    
    if(result.Status === 'Success') {
        Swal.fire({
            icon: 'success',
            title: 'Product deleted successfully',
            toast: true,
            position: 'top-right',
            timer: 1500,
            timerProgressBar: true
        })
    }
}

deleteProductBtn.forEach((b) => {
    b.addEventListener("click", () => {
        const pid = b.value;

        deleteProduct("63c84b48eb6eb52c6f70e1eb", pid);
    });
});