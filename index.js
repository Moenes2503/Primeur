const DEBOUNCE_TIMEOUT_MS = 100;

const input = document.getElementById("autocomplete-input");
const resultsList = document.getElementById("autocomplete-results");
const dropdownArrow = document.querySelector(".autocomplete__dropdown-arrow");
const comboBox = document.querySelector(".autocomplete__container");

let currentListItemFocused = -1;

const colors = [
  "Afghanistan",
"Afrique du Sud",
"Albanie",
"Algérie",
"Allemagne",
"Andorre",
"Angola",
"Anguilla",
"Arabie Saoudite",
"Argentine",
"Arménie",
"Australie",
"Autriche",
"Azerbaidjan",
"Bahamas",
"Bangladesh",
"Barbade",
"Bahrein",
"Belgique",
"Bélize",
"Bénin",
"Biélorussie",
"Bolivie",
"Botswana",
"Bhoutan",
"Boznie-Herzégovine",
"Brésil",
"Brunei",
"Bulgarie",
"Burkina Faso",
"Burundi",
"Cambodge",
"Cameroun",
"Canada",
"Cap-Vert",
"Chili",
"Chine",
"Chypre",
"Colombie",
"Comores",
"République du Congo",
"République Démocratique du Congo",
"Cook",
"Corée du Nord",
"Corée du Sud",
"Costa Rica",
"Côte d’Ivoire",
"Croatie",
"Cuba",
"Danemark",
"Djibouti",
"Dominique",
"Egypte",
"Emirats Arabes Unis",
"Equateur",
"Erythrée",
"Espagne",
"Estonie",
"Etats-Unis d’Amérique",
"Ethiopie",
"Fidji",
"Finlande",
"France",
"Gabon",
"Gambie",
"Géorgie",
"Ghana",
"Grèce",
"Grenade",
"Guatémala",
"Guinée",
"Guinée Bissau",
"Guinée Equatoriale",
"Guyana",
"Haïti",
"Honduras",
"Hongrie",
"Inde",
"Indonésie",
"Iran",
"Iraq",
"Irlande",
"Islande",
"Israël",
"italie",
"Jamaïque",
"Japon",
"Jordanie",
"Kazakhstan",
"Kenya",
"Kirghizistan",
"Kiribati",
"Koweït",
"Laos",
"Lesotho",
"Lettonie",
"Liban",
"Liberia",
"Liechtenstein",
"Lituanie",
"Luxembourg",
"Lybie",
"Macédoine",
"Madagascar",
"Malaisie",
"Malawi",
"Maldives",
"Mali",
"Malte",
"Maroc",
"Marshall",
"Maurice",
"Mauritanie",
"Mexique",
"Micronésie",
"Moldavie",
"Monaco",
"Mongolie",
"Mozambique",
"Namibie",
"Nauru",
"Nepal",
"Nicaragua",
"Niger",
"Nigéria",
"Nioué",
"Norvège",
"Nouvelle Zélande",
"Oman",
"Ouganda",
"Ouzbékistan",
"Pakistan",
"Palau",
"Palestine",
"Panama",
"Papouasie Nouvelle Guinée",
"Paraguay",
"Pays-Bas",
"Pérou",
"Philippines",
"Pologne",
"Portugal",
"Qatar",
"République centrafricaine",
"République Dominicaine",
"République Tchèque",
"Roumanie",
"Royaume Uni",
"Russie",
"Rwanda",
"Saint-Christophe-et-Niévès",
"Sainte-Lucie",
"Saint-Marin",
"Saint-Vincent-et-les Grenadines",
"Iles Salomon",
"Salvador",
"Samoa Occidentales",
"Sao Tomé et Principe",
"Sénégal",
"Serbie",
"Seychelles",
"Sierra Léone",
"Singapour",
"Singapour",
"Singapour",
"Singapour",
"Slovaquie",
"Slovénie",
"Somalie",
"Soudan",
"Sri Lanka",
"Suède",
"Suisse",
"Suriname",
"Swaziland",
"Syrie",
"Tadjikistan",
"Taiwan",
"Tanzanie",
"Tchad",
"Thailande",
"Timor Oriental",
"Togo",
"Tonga",
"Trinité et Tobago",
"Tunisie",
"Turkménistan",
"Turquie",
"Tuvalu",
"Ukraine",
"Uruguay",
"Vanuatu",
"Vatican",
"Vénézuela",
"Vietnam",
"Yemen",
"Zambie",
"Zimbabwe",
];

let filteredResults = [...colors];

let isDropDownOpen = false;

function openDropdown() {
  isDropDownOpen = true;
  resultsList.classList.add("visible");
  dropdownArrow.classList.add("expanded");
  comboBox.setAttribute("aria-expanded", "true");
}

function closeDropdown() {
  isDropDownOpen = false;
  resultsList.classList.remove("visible");
  dropdownArrow.classList.remove("expanded");
  comboBox.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-activedescendant", "");
}

function outsideClickListener(event) {
  const dropdownClicked = [
    input,
    dropdownArrow,
    ...resultsList.childNodes
  ].includes(event.target);

  if (!dropdownClicked) {
    closeDropdown();
  }
}

document.addEventListener("click", outsideClickListener);

input.addEventListener("click", openDropdown);

dropdownArrow.addEventListener("click", event => {
  event.preventDefault();
  if (!isDropDownOpen) {
    openDropdown();
  } else {
    closeDropdown();
  }
});

function setResults(results) {
  if (Array.isArray(results) && results.length > 0) {
    const innerListItems = results
      .map(
        (item, index) =>
          `<li class="autocomplete-item" id="autocomplete-item-${index}" role="listitem" tabindex="0">${item}</li>`
      )
      .join("");
    resultsList.innerHTML = innerListItems;
    currentListItemFocused = -1;
  }
}

function focusListItem(listItemNode) {
  const id = listItemNode.id;
  input.setAttribute("aria-activedescendant", id);
  listItemNode.focus();
}

function selectValue(listItemNode) {
  const value = listItemNode.innerText;
  input.value = value;
  input.removeAttribute("aria-activedescendant");
  listItemNode.setAttribute("aria-selected", "true");
  input.focus();
  closeDropdown();
}

resultsList.addEventListener("click", event => {
  if ([...resultsList.childNodes].includes(event.target)) {
    selectValue(event.target);
  }
});

function handleKeyboardEvents(event) {
  const listItems = resultsList.childNodes;
  let itemToFocus = null;

  // Prevent defaitt if needed
  if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
    event.preventDefault();
  }

  switch (event.key) {
    case "ArrowDown":
      if (currentListItemFocused < listItems.length - 1) {
        if (!isDropDownOpen) {
          openDropdown();
        }
        currentListItemFocused = currentListItemFocused + 1;
        itemToFocus = listItems.item(currentListItemFocused);
        focusListItem(itemToFocus);
      }
      break;
    case "ArrowUp":
      if (currentListItemFocused > 0) {
        currentListItemFocused = currentListItemFocused - 1;
        itemToFocus = listItems.item(currentListItemFocused);
        focusListItem(itemToFocus);
      }
      break;
    case "Home":
      if (currentListItemFocused > 0) {
        currentListItemFocused = 0;
        itemToFocus = listItems.item(currentListItemFocused);
        focusListItem(itemToFocus);
      }
      break;
    case "End":
      if (currentListItemFocused < listItems.length - 1) {
        currentListItemFocused = listItems.length - 1;
        itemToFocus = listItems.item(currentListItemFocused);
        focusListItem(itemToFocus);
      }
      break;
    case "Enter":
      if (!isDropDownOpen) {
        openDropdown();
      } else {
        if (listItems[currentListItemFocused].innerText) {
          selectValue(listItems[currentListItemFocused]);
        }
      }
      break;
    case "Escape":
      if (isDropDownOpen) {
        closeDropdown();
      }
      break;
    default:
      if (event.target !== input) {
        if (/([a-zA-Z0-9_]|ArrowLeft|ArrowRight)/.test(event.key)) {
          // If list item is focused and user presses an alphanumeric key, or left or right
          // Focus on the input instead
          input.focus();
        }
      }
      break;
  }
}

input.addEventListener("keydown", handleKeyboardEvents);
resultsList.addEventListener("keydown", handleKeyboardEvents);

setResults(colors);

let bounce = undefined;
function debounce(callback) {
  clearTimeout(bounce);
  bounce = setTimeout(() => {
    callback();
  }, [DEBOUNCE_TIMEOUT_MS]);
}

function filter(value) {
  if (value) {
    const regexToFilterBy = new RegExp(`^${value}.*`, "gi");
    filteredResults = colors.filter(color => regexToFilterBy.test(color));
  } else {
    filteredResults = [...colors];
  }
  setResults(filteredResults);
}

input.addEventListener("input", event => {
  const value = event.target.value;

  debounce(() => {
    filter(value);
    if (!isDropDownOpen) {
      openDropdown();
    }
  });
});
