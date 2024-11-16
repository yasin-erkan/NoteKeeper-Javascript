const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// 1----! Extraction d'éléments associés à partir de HTML
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup-box .popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector(".settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector(".popup button");

// Création de variables pour la mise à jour des notes

let isUpdate = false;
let updateId;

// * Extraire des notes du stockage local

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// * Lorsque vous cliquez sur l'icône d'ajout, une fenêtre contextuelle s'ouvrira.
addBox.addEventListener("click", () => {
  // Nous avons rendu la popup visible
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  //Empêcher le défilement des pagesayfa kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});

// * Lorsque vous cliquez sur l'icône de fermeture, la fenêtre contextuelle se ferme.
closeIcon.addEventListener("click", () => {
  // Supprimer la pop-op!
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  //Activer le défilement des pages
  document.querySelector("body").style.overflow = "auto";
});

// ! Fonction qui s'exécutera lorsque le formulaire sera soumis
form.addEventListener("submit", (e) => {
  // Nous avons annulé l'actualisation de la page
  e.preventDefault();
  // Nous avons accédé aux valeurs dans les entrées(Inputs)
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];
  // supprimé les espaces
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();
  //vérifié si les entrées étaient vides, si elles étaient pleines, nous avons créé un objet note et l'avons envoyé aux paramètres régionaux.
  if (title && description) {
    const date = new Date();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    //Si nous sommes en mode édition, mettez à jour la note, sinon ajoutez une nouvelle note.
    if (isUpdate) {
      //Si nous sommes en mode mise à jour, mettez à jour le contenu de l'élément concerné
      notes[updateId] = noteInfo;
      // fermé la mode mise à jour
      isUpdate = false;
    } else {
      notes.push(noteInfo);
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    // ramené la fenêtre contextuelle à son état précédent
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    popupTitle.textContent = "Add Note";
    button.textContent = "Add Note";

    document.querySelector("body").style.overflow = "auto";
  }
  // effacé le contenu des entrées(inputs)
  titleInput.value = "";
  descriptionInput.value = "";
  // Rendre les notes après l'ajout d'une note
  showNotes();
});

// Fonction qui fournit la fonction de suppression de notes
function deleteNote(noteId) {
  if (confirm(" Are You sure you want to delete?")) {
    //Supprimer la note spécifiée du tableau de notes
    notes.splice(noteId, 1);
    // Mettre à jour le stockage local(localStorage)
    localStorage.setItem("notes", JSON.stringify(notes));
    // rendré  les notes
    showNotes();
  }
}

// Fonction de mise à jour des notes

function updateNote(noteId, title, description) {
  isUpdate = true;
  updateId = noteId;
  // Rendré la popup visable encore
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  popupTitle.textContent = "Update Note";
  button.textContent = "Update Note";
  form.elements[0].value = title;
  form.elements[1].value = description;
}

// Fonction qui affiche le contenu du menu
function showMenu(elem) {
  // parentElement est utilisé pour accéder à l'élément scope d'un élément puisque nous n'avons pas eu besoin d'ajouter une classe au conteneur de l'icône cliqué ici, nous avons accédé au conteneur de cet élément avec parentElement.

  // ajouté la classe show à l'élément scope
  elem.parentElement.classList.add("show");
  //Supprimer la classe d'affichage si vous cliquez ailleurs que dans le menu
  document.addEventListener("click", (e) => {
    // Supprimez la classe show si l'élément cliqué n'est pas une balise i ou si la portée n'est pas égale à l'élément. La raison pour laquelle vous utilisez 'I' ici est que la propriété tagName est considérée comme en majuscule.
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// ! Fonction qui rend les notes à l'écran

function showNotes() {
  // S'il n'y a pas de notes, arrêtez la fonction
  if (!notes) return;

  // Supprimer les notes précédemment ajoutées
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Imprimez une carte de notes à l'écran pour chaque élément du tableau de notes
  notes.forEach((note, id) => {
    let liTag = `   <li class="note">
        <div class="details">
          <p>${note.title} </p>
          <span>${note.description} </span>
        </div>

        <div class="bottom-content">
          <span>${note.date} </span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded" ></i>
                <ul class="menu">
            <li onclick='updateNote(${id}, "${note.title}", "${note.description}")'><i class="bx bx-edit"></i> Edit</li>
            <li onclick='deleteNote(${id})'><i class="bx bx-trash"></i> Delete</li>
          </ul>
          </div>
        </div>
      </li>`;
    // La méthode insertAdjacentHTML est utilisée pour ajouter séquentiellement un certain élément à la section Html. Cette méthode nous demande d'écrire la structure derrière laquelle un élément sera ajouté, puis de spécifier le contenu de l'élément à ajouter.
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

// Quelques modalités de suppression et d'édition

wrapper.addEventListener("click", (e) => {
  // Si l'icône du menu '...' est cliquée, exécutez la fonction showMenu
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  // Si vous cliquez sur l'icône de suppression, exécutez la fonction deleteNote
  else if (e.target.classList.contains("bx-trash")) {
    // dataset est utilisé pour attribuer une propriété à un élément. Dans cet exemple, nous avons attribué l'identifiant.
    const noteId = parseInt(e.target.closest(".note").dataset.id, 10);
    deleteNote(noteId);
  } else if (e.target.classList.contains("bx-edit")) {
    // Düzenleme işlemi yapılacak kapsam elemana eriş
    const noteElement = e.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    // Accès aux valeurs de titre et de description
    const title = noteElement.querySelector(".details p").innerText;
    const description = noteElement.querySelector(".details span").innerText;

    updateNote(noteId, title, description);
  }
});
document.addEventListener("DOMContentLoaded", () => showNotes());

// ! Closest et parentElement sont utilisés pour accéder au conteneur des éléments. Closest nous demande de spécifier la propriété de l'élément auquel nous voulons accéder directement dans parentElement, nous devons accéder aux éléments scope un par un.
