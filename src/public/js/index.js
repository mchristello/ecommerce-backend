console.log(`Esto es desde el index.js que maneja el Front`);

// Elementos del DOM
let btnNewProduct = document.getElementById('btn_new-product');
let sectionNewProduct = document.getElementById('new_product');
let form = document.createElement('form');

let sendBtn = document.getElementById('send-btn');
let addProductBtn = document.querySelectorAll('#buy_product__btn')

// POST para agregar al carrito
const addProductToCart = async(cartId, productId) => {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await response.json();

    if(result.status === 'success') {
        Swal.fire({
            icon: 'success',
            title: 'Product added successfully',
            toast: true,
            position: 'top-right',
            timer: 1500,
            timerProgressBar: true
        })
    }
}

addProductBtn.forEach(b => {
    b.addEventListener('click', ()=> {
        const productId = b.value;
    
        addProductToCart('63c84b48eb6eb52c6f70e1eb', productId)
    })

})