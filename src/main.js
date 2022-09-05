// const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${sogn}`);
// const API_KEY = '487e6a8c-4bc8-4784-ba54-7f37b69ea759';
const API_KEY = '487e6a8c-4bc8-4784-ba54-7f37b69ea759'
const URL_API_RANDOM = 'https://api.thecatapi.com/v1/images/search';
// const API = ['https://api.thecatapi.com/v1/images/search', `?limit=6`].join('');
const URL_API_FAVOURITES = `https://api.thecatapi.com/v1/favourites?api_key=${API_KEY}`;
const URL_API_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=${API_KEY}`;
const URL_API_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('errorMessage')
const getImages = document.getElementById('getImages');
let value = '';

const wrapper = document.querySelector('.wrapper');
const contaImg = document.querySelector('.image');
const cancelBtn = document.getElementById('cancel_btn');
const fileName = document.querySelector('.file_name');
const inputBtn = document.querySelector('#image_input');
const content = document.querySelector('.content');
const loader = document.querySelector('.loader');
const img = document.getElementById('image');
const gradient_img = document.querySelector('.gradient_img');
const span_message = document.querySelector('.span_message');

const preloader = document.querySelector('.preload');

const regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/
const toTop = document.querySelector('.to_top');


window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
        toTop.classList.add('active');
    } else {
        toTop.classList.remove('active');
    }
})

setInterval(async function brandRandom() {
    const response = await fetch(`${URL_API_RANDOM}`);
    const data = await response.json();
    const image = document.getElementById('brand')
    image.src = data[0].url;
    image.alt = data[0].id;
    document.getElementById('brand_name').innerHTML = data[0].id;
    // console.log(image)
}, 5000)

async function loadRandomCats() {
    const name = document.getElementById('btn_name');

    if (getImages.value == 'Gif Image') {
        value = '?mime_types=gif';
        name.innerHTML = `Get gif image`
    } else {
        value = '';
        name.innerHTML = `Reload`
    }
    try {
        const getImgNumber = document.getElementById('getImgNumber');
        const valueInput = getImgNumber.value;

        const response = await fetch(`${URL_API_RANDOM}?limit=${valueInput}`);
        // const response = await fetch(`${URL_API_RANDOM}` + `${value}`);
        const data = await response.json();
        // console.log("random image", data);
        if (response.status !== 200) {
            spanError.innerText = `Error ${response.status} ${data.message}. Cannot read properties of undefined (reading "url")`;
        } else {
            const cRandom = document.getElementById('container_random');
            cRandom.innerHTML = '';

            for (let i = 0; i < data.length; i++) {
                const url_image = data[i];
                cRandom.innerHTML += `
                    <article class="container">
                        <div class="macro">
                            <img class="macro_image" src= ${url_image.url} alt=${data[i].id}>
                            <div class="macro_bottom">
                                <span id="image_id">${data[i].id}</span>
                                <button class="btn_saveToFavourite" id="saveAsFavourite">Save as Favourite</button>
                            </div>
                        <div class="gradient_img"></div>
                        </div>
                    </article>
                `;
            }

            const buttonsNode = document.getElementsByClassName('btn_saveToFavourite');
            const btns = Array.from(buttonsNode);
            // console.log("btns", btns)

            for (let i = 0; i < btns.length; i++) {
                const element = btns[i];
                element.onclick = () => {
                    saveFavouritesCat(`${data[i].id}`);
                    element.classList.add('active');
                }
            }
        }


    } catch (err) {
        console.log(new Error(err.message));
    }
}

async function loadFavouritesCats() {
    const response = await fetch(URL_API_FAVOURITES, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY
        }
    });
    const data = await response.json();
    // console.log("Save Favourites", data);

    if (response.status !== 200) {
        spanError.innerHTML = `Error ${response.status} ${data.message}. Cannot read properties of undefined (reading "url")`;
    } else {
        const section = document.getElementById('favourite_images');
        const container = document.createElement('div');
        container.className = 'container_favourites'
        const toRender = [];
        section.innerHTML = "";

        const topTitle = document.createElement('div');
        topTitle.className = 'topfavourites_title';

        const span = document.createElement('span');
        // span.className = 'favourites_title'
        const spanH1 = document.createTextNode("Favourites cats");
        span.appendChild(spanH1);
        const spanText = document.createTextNode("Hide Galery");
        const button = document.createElement('button');
        button.className = 'btn_showElementts'
        let isShow = true;
        button.onclick = () => {
                if (isShow) {
                    document.querySelector('.container_favourites').style.display = 'none';
                    isShow = false;
                    document.querySelector('.btn_showElementts').innerHTML = 'Show Galery';
                } else {
                    document.querySelector('.container_favourites').style.display = 'block';
                    isShow = true;
                    document.querySelector('.btn_showElementts').innerHTML = 'Hide Galery';
                }
            },
            button.append(spanText);
        topTitle.append(span, button);
        section.append(topTitle);

        data.forEach((item) => {
            const art = document.createElement('article');
            art.className = 'container';
            const divDots = document.createElement('div');
            divDots.className = 'dots'
            const circleA = document.createElement('div');
            circleA.className = 'circle'
            circleA.id = 'a'
            const circleB = document.createElement('div');
            circleB.className = 'circle'
            circleB.id = 'b'
            const circleC = document.createElement('div');
            circleC.className = 'circle'
            circleC.id = 'c'

            const divMacro = document.createElement('div');
            divMacro.className = 'macro'
            const img = document.createElement('img');
            img.className = 'macro_image'
            const divGradient = document.createElement('div');
            divGradient.className = 'gradient_img';
            const div = document.createElement('div');
            div.className = 'macro_bottom'
            const span = document.createElement('span');
            const btn = document.createElement('button');
            btn.className = 'btn_deleteFavourite'
            btn.onclick = () => deleteFavouritesCat(item.id);
            const textBtn = document.createTextNode('Delete as Favourite');

            img.src = item.image.url;
            img.alt = item.image.id;
            span.innerHTML = item.image.id;

            art.append(divMacro);
            divDots.append(circleA, circleB, circleC);
            btn.append(textBtn);
            div.append(span, btn)
            divMacro.append(divDots, img, divGradient, div);
            toRender.push(art);
            container.append(...toRender)
            section.appendChild(container);
        });

    }
}

// "78p", "1-k8cAwvJ", "247","8ji"
async function saveFavouritesCat(id) {
    const response = await fetch(URL_API_FAVOURITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({
            image_id: id,
        })
    })
    const data = await response.json();
    // console.log("Save favourites", response);

    if (response.status !== 200) {
        spanError.innerHTML = `Error ${response.status} ${data.message}. Cannot read properties of undefined (reading "url")`;
    } else {
        console.log('Cat is Save as Favourite')
        loadFavouritesCats();
    }

}

async function deleteFavouritesCat(id) {
    const response = await fetch(URL_API_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY
        }
    });
    const data = await response.json();


    if (response.status !== 200) {
        spanError.innerHTML = `Error ${response.status} ${data.message}. Cannot read properties of undefined (reading "url")`;
    } else {
        console.log('Cat is Delete of Favourite')
        document.querySelector('.btn_saveToFavourite').classList.remove('active')

        loadFavouritesCats();
    }
}

async function uploadCatPhoto() {
    loader.classList.add('active');
    preloader.classList.add('active');
    gradient_img.classList.add('active');
    span_message.classList.remove('active');
    document.querySelector('.upload_image').classList.add('active');
    document.querySelector('.span_upload').classList.add('active');

    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form);
    // console.log(formData.get('file')); 

    const res = await fetch(URL_API_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/formdata',
            'x-api-key': API_KEY,
        },
        body: formData,
    });

    console.log("cannot upload the file");
    loader.classList.remove('active')
    preloader.classList.remove('active');
    gradient_img.classList.remove('active');
    span_message.innerText = `Error. Cannot upload the file`;
    span_message.classList.add('active');
    document.querySelector('.upload_image').classList.remove('active');
    document.querySelector('.span_upload').classList.remove('active');

    function clearMacro() {
        img.src = "";
        contaImg.style.display = "none";
        contaImg.classList.remove('active')
        content.classList.remove('active')
        wrapper.classList.remove('active')
        span_message.classList.remove('active');
        preloader.classList.remove('active');

    }
    setTimeout(clearMacro, 8000);

    const data = await res.json();
    // console.log("data", data);

    if (res.status !== 200 && res.status !== 201) {
        loader.classList.remove('active')
        gradient_img.classList.remove('active');
        span_message.innerText = `Error ${res.status} ${data.message}. Cannot upload the file`;
        span_message.classList.add('active');
    } else {
        console.log('Upload successfully');
        saveFavouritesCat(data.id);
        loader.classList.remove('active')
        preloader.classList.remove('active');

        gradient_img.classList.remove('active');
        span_message.classList.add('active');
        span_message.innerText = `The file was uploaded successfully`;

        function clearParams() {
            img.src = "";
            contaImg.style.display = "none";
            contaImg.classList.remove('active')
            content.classList.remove('active')
            wrapper.classList.remove('active')
            span_message.classList.remove('active');
            preloader.classList.remove('active');

        }

        setTimeout(clearParams, 4000)
    }
}

function uploadAImage() {
    inputBtn.click();

}
inputBtn.addEventListener('change', function () {
    contaImg.style.display = "block";
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const result = reader.result;
            img.src = result;
            contaImg.classList.add('active')
            content.classList.add('active')
            wrapper.classList.add('active')
        }
        cancelBtn.addEventListener('click', function () {
            img.src = "";
            contaImg.style.display = "none";
            contaImg.classList.remove('active')
            content.classList.remove('active')
            wrapper.classList.remove('active')
            loader.classList.remove('active')
            preloader.classList.remove('active');
            span_message.classList.remove('active');

        })
        reader.readAsDataURL(file)

    }
    if (this.value) {
        let valueStore = this.value.match(regExp);
        fileName.textContent = valueStore;
    }
});

loadRandomCats();
loadFavouritesCats();