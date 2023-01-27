// const socket = io();

console.log(`Esto es desde el index.js que maneja el Front`);


// Socket que recibre productos y actualiza el front

// socket.on('getProducts', (products) => {
//     products.sort((a, b) =>{
//         return b.price - a.price;
//     })
// })

// socket.on('getProducts', (productsFromBack) => {
//     let cardContainer = document.getElementById('card__container');

//     let card = document.createElement('div')
//     card.setAttribute(`class`, `cards`)
    
//     cardContainer.innerHTML = '';

//     productsFromBack.map((p) => {
//         card.innerHTML += `<div class="card__item">
//                                 <img class="card__img" src="${p.thumbnail}">
//                                 <hr>
//                                 <div class="card__body">
//                                     <p>${p.title}</p>
//                                     <p><b>${p.description}</b></p>
//                                     <p>Price: $<i>${p.price}</i></p>
//                                     <p>Stock Available: ${p.stock}</p>
//                                 </div>
//                             </div>`;
//         cardContainer.appendChild(card);
//     })
// })

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

    console.log(result.payload);

    // if(result)

    if(result.Status === 'Success') {
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
        console.log(productId);
    
        addProductToCart('63c84b48eb6eb52c6f70e1eb', productId)
    })

})