/*
*
On selection toutes les images des projets, et leurs data via l'Api
*/
function galleryImages(categoryId) {
    fetch('http://localhost:5678/api/works', {
        headers: {  // Entêtes de la requête
            'Accept': 'application/json'  // Accepte les réponses au format JSON
        }
    })
        .then(response => response.json())  // Convertit la réponse en JSON
        .then(data => {
            const images = data;  // Récupère les images depuis les données
            const galleryFilteredImages = images.filter(image => image.categoryId === categoryId || categoryId === 0);  // Filtre les images en fonction de l'ID de la catégorie
            const galleryDiv = document.querySelector('.gallery');
            galleryDiv.innerHTML = '';  // Vide la galerie
            galleryFilteredImages.forEach(image => {
                const img = document.createElement('img');
                img.src = image.imageUrl;
                img.alt = image.title;
                galleryDiv.appendChild(img);  // Ajoute les images filtrées à la galerie
            });
        })
        .catch(error => {
            console.error(error);
        });

}

let userToken = sessionStorage.getItem('userToken');
let previousModal = null;

/**
 * Ici on configure le mode connecté
 */
function setConnectedMode() {
    // Création de l'icône et du conteneur de modal
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('icon');

    const iconElement = document.createElement('i');
    iconElement.classList.add('fa-solid');
    iconElement.classList.add('fa-pen-to-square');

    const divModal = document.createElement('div');
    divModal.classList.add('modal');
    divModal.id = 'modal';
    iconDiv.appendChild(iconElement);
    iconDiv.appendChild(divModal);
    // Ajout de l'icône et de la galerie dans la section du portfolio
    const sectionPortfolio = document.getElementById('portfolio');
    sectionPortfolio.appendChild(iconDiv);
    const galleryDiv = document.createElement('div');
    galleryDiv.classList.add('gallery');
    sectionPortfolio.appendChild(galleryDiv);
    // Écouteur d'événement pour l'ouverture de la modal
    iconElement.addEventListener('click', function () {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.id = 'modal';
        document.body.appendChild(modal);
        const galleryImages = document.querySelectorAll('.gallery img');
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttonContainer');
        // Bouton d'ajout d'une photo
        const btnAddPic = document.createElement('button');
        btnAddPic.textContent = 'Ajouter une photo';
        buttonContainer.appendChild(btnAddPic);
        // Bouton x supprimer tout la galerie.
        const btnDltPic = document.createElement('button');
        btnDltPic.textContent = 'Supprimer la galerie';
        buttonContainer.appendChild(btnDltPic);
        modal.appendChild(buttonContainer);
        buttonContainer.classList.add('button-container');
        // Affichage des images dans la modal
        galleryImages.forEach((image) => {

            const container = document.createElement('div');
            container.classList.add('image-container');
            
            const modalImage = document.createElement('img');
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            container.appendChild(modalImage);
            // Supprimer une image
            const deleteIconDiv = document.createElement('div');
            deleteIconDiv.classList.add('icon');

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid');
            deleteIcon.classList.add('fa-trash');
            deleteIcon.classList.add('delete-icon');
            modalImage.parentElement.appendChild(deleteIcon);

            const description = document.createElement('p');
            description.textContent = 'éditer';
            modalImage.parentElement.appendChild(description);

            modal.appendChild(container);
            // Écouteur d'événement pour la suppression de l'image
            deleteIcon.addEventListener('click', function () {
                // Requête DELETE à l'API
                fetch(`http://localhost:5678/api/works/$(id)`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer $(userToken)'
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            // Supprimer l'image de la modal
                            modalImage.remove();
                            deleteIcon.remove();
                        } else {
                            console.error('Erreur lors de la requête DELETE');
                        }
                    })
                    .catch((error) => {
                        console.error('Erreur de connexion ou de requête fetch', error);
                    });
            });
        });

        modal.style.display = 'block';
        // Ouverture de la 2ème modal pour ajouter une photo
        btnAddPic.addEventListener('click', function openAddPicModal() {
            if (previousModal) {
                previousModal.remove();
            }
            const addPicModal = document.createElement('div');
            addPicModal.classList.add('add-pic-modal');
            document.body.appendChild(addPicModal);

            const backArrow = document.createElement('i');
            backArrow.classList.add('fas', 'fa-arrow-left', 'back-arrow');
            addPicModal.appendChild(backArrow);
            backArrow.addEventListener('click', function () {
                addPicModal.style.display = 'none';
            });
            const formContainer = document.createElement('div');
            formContainer.classList.add('form-container');
            addPicModal.appendChild(formContainer);

            const imageForm = document.createElement('form');
            imageForm.classList.add('image-form');
            formContainer.appendChild(imageForm);

            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.name = 'image';
            imageForm.appendChild(imageInput);

            const titleForm = document.createElement('form');
            titleForm.classList.add('title-form');
            formContainer.appendChild(titleForm);

            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.name = 'title';
            titleInput.placeholder = 'Title';
            titleForm.appendChild(titleInput);

            const categoryForm = document.createElement('form');
            categoryForm.classList.add('category-form');
            formContainer.appendChild(categoryForm);

            const categoryInput = document.createElement('input');
            categoryInput.type = 'text';
            categoryInput.name = 'category';
            categoryInput.placeholder = 'Categories';
            categoryForm.appendChild(categoryInput);

            const submitButton = document.createElement('button');
            submitButton.textContent = 'ajouter une photo';
            formContainer.appendChild(submitButton);

            const galleryDiv = document.createElement('div');
            galleryDiv.classList.add('gallery');
            sectionPortfolio.appendChild(galleryDiv);

            submitButton.addEventListener('click', function () {
                const selectedImage = imageInput.files[0];
                const title = titleInput.value;
                const category = categoryInput.value;

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('gallery-image');

                const galleryImage = document.createElement('img');
                galleryImage.src = URL.createObjectURL(selectedImage);
                galleryImage.alt = title;

                imageContainer.appendChild(galleryImage);

                galleryDiv.appendChild(imageContainer);

                addPicModal.style.display = 'none';
            });

            addPicModal.style.display = 'block';
        });
    });
}



/** 
 * Ici on va créer les boutons et les filtres pour gerer les differents projets
*/

function createFilterButtons(categories) {
    const buttonsDiv = document.querySelector('.filter-buttons');
    const showAllButton = document.createElement('button');
    showAllButton.textContent = 'Tous';  // Texte du bouton "Tous"
    showAllButton.addEventListener('click', function () {
        galleryImages(0);  // Affiche toutes les images (categoryId = 0)
    });
    buttonsDiv.appendChild(showAllButton);  // Ajoute le bouton "Tous" au div des boutons de filtre

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;  // Texte du bouton de la catégorie

        button.addEventListener('click', function () {
            galleryImages(category.id);  // Filtre les images en fonction de l'ID de la catégorie
        });

        buttonsDiv.appendChild(button);  // Ajoute le bouton au div des boutons de filtre
    });
}
/**
 * Ici on configure le mode déconnecté
 */
function setDisconnectedMode(categories) {
    const sectionPortfolio = document.getElementById('portfolio');
    const filterDiv = document.createElement('div');
    filterDiv.classList.add('filter-buttons');
    sectionPortfolio.appendChild(filterDiv);
    const galleryDiv = document.createElement('div');
    galleryDiv.classList.add('gallery');
    sectionPortfolio.appendChild(galleryDiv);
    createFilterButtons(categories);
}
fetch('http://localhost:5678/api/categories', {
    headers: {  // Entêtes de la requête
        'Accept': 'application/json'  // Accepte les réponses au format JSON
    }
})
    .then(response => response.json())  // Converti la réponse en JSON
    .then(data => {
        const categories = data;  // Récupère les catégories depuis les données
        if (userToken) {
            console.log('token!!!!!!!!!!')
            setConnectedMode();
        }
        else {
            console.log('pas de token---------')
            setDisconnectedMode(categories);
            // Crée les boutons de filtre si l'utilisateur n'est pas connecté
        }
        galleryImages(0);  // Applique le filtre initial pour afficher toutes les images
    })
    .catch(error => {
        console.error(error);
    });










