// DOM Elements
const heroBg = document.querySelector(".hero");
const searchList = document.querySelector(".search__list");
const defaultSearch = document.querySelector(".default__search");
const showSearchListBtn = document.querySelector(".show-btn");
const imagesElem = document.querySelector(".images");
const downloadImagebtn = document.querySelector(".download-btn");
const imagePopup = document.querySelector(".image__popup");
const closeImagePopupBtn = document.querySelector(".close__popup");
const previewImage = imagePopup.querySelector(".preview__image img");
let photographerName = imagePopup.querySelector(".photographer__name span");
const downloadForm = document.querySelector(".image__popup .download__form");
const showDownloadListBtn = document.querySelector(".download-btn i");
const loadMoreBtn = document.querySelector(".load-more-btn");
const filterBtn = document.querySelector(".filter__btn");
const filterArea = document.querySelector(".filter__area");
const filterSelectElem = document.querySelectorAll(".filter__item select");
const filterSelectOptions = document.querySelectorAll(".filter__item option");
const searchInput = document.querySelector(".input__search");

const apiKey = "pEUzmmnGt9nd2Teix7WPZaW3Qr6uDefhygFBxWVNAcy68eWbA3MEOXa8";
let perPage = 15;
let currentPage = 1;
let searchTerm = null;
let imageOrient = null;
let imageSize = null;

showSearchListBtn.addEventListener("mouseenter", () => {
  searchList.style.display = "block";
  showSearchListBtn.classList.replace(
    "ri-arrow-down-s-line",
    "ri-arrow-up-s-line"
  );
});

searchList.addEventListener("mouseleave", () => {
  searchList.style.display = "none";
  showSearchListBtn.classList.replace(
    "ri-arrow-up-s-line",
    "ri-arrow-down-s-line"
  );
});

function openImagePopup(image, name) {
  imagePopup.classList.add("show");
  previewImage.src = image;
  photographerName.innerText = name;
}

function closeImagePopup() {
  imagePopup.classList.remove("show");
}

function showDownloadList() {
  if (showDownloadListBtn.classList.contains("ri-arrow-down-s-line")) {
    downloadForm.classList.add("show");
    showDownloadListBtn.classList.replace(
      "ri-arrow-down-s-line",
      "ri-arrow-up-s-line"
    );
  } else {
    downloadForm.classList.remove("show");
    showDownloadListBtn.classList.replace(
      "ri-arrow-up-s-line",
      "ri-arrow-down-s-line"
    );
  }
}

// function changeBgImage(images) {
//   const randomImage = Math.floor(Math.random() * images.length);
//   const imageURL = images[randomImage].src.landscape;
//   heroBg.style.background = `url(${imageURL})`;
//   heroBg.style.backgroundRepeat = "no-repeat";
//   heroBg.style.backgroundSize = "cover";
//   heroBg.style.backgroundPosition = "center center";
//   heroBg.setAttribute("loading", "lazy");
// }

function loadMoreImages() {
  currentPage++;

  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiUrl = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&orientation=${imageOrient}&page=${currentPage}&per_page=${perPage}`
    : apiUrl;
  getImages(apiUrl);
}

const downloadImage = (event, imageURL) => {
  event.stopPropagation();
  fetch(imageURL)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "");
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      alert("something went wrong while downloading the image");
    });
};

const filterImages = (filterValue) => {
  console.log(filterValue);
  imagesElem.innerHTML = "";
  imageOrient = filterValue;
  getImages(
    `https://api.pexels.com/v1/search?query=${searchTerm}&orientation=${imageOrient}&page=${currentPage}&per_page=${perPage}`
  );
};

/**
 * get images from pexels
 */

const generateImages = (images) => {
  // changeBgImage(images);
  imagesElem.innerHTML += images
    .map(
      (
        img
      ) => `<li class="image__holder" onclick="openImagePopup('${img.src.large2x}','${img.photographer}')">
              <img src="${img.src.large2x}" alt="${img.alt}" loading="lazy" />
              <div class="image__details">
                <div class="photographer">
                  <div class="photographer__info">
                    <i class="ri-user-line"></i>
                    <span>${img.photographer}</span>
                  </div>
                  <div class="btns">
                    <button onclick="downloadImage(event, '${img.src.large2x}')">
                      <i class="ri-download-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            </li>`
    )
    .join(" ");
};

const getImages = (apiURL) => {
  imagesElem.classList.remove("error");
  loadMoreBtn.innerText = "Loading...";
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        generateImages(data.photos);
        loadMoreBtn.style.display = "block";
        loadMoreBtn.innerText = "Load More";
      } else {
        loadMoreBtn.style.display = "none";
        loadMoreBtn.parentElement.style.margin = "2rem 0";
      }
    })
    .catch(() => {
      imagesElem.classList.add("error");
      imagesElem.innerHTML = `<div class="error-msg">Oops! Something went wrong! Please try again.</div>`;
      loadMoreBtn.style.display = "none";
    });
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

const searchImages = (e) => {
  if (e.key === "Enter") {
    filterBtn.style.display = "block";
    searchTerm = e.target.value;
    imagesElem.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&orientation=portrait&page=${currentPage}&per_page=${perPage}`
    );
  }
};

closeImagePopupBtn.addEventListener("click", closeImagePopup);
showDownloadListBtn.addEventListener("click", showDownloadList);
loadMoreBtn.addEventListener("click", loadMoreImages);
filterBtn.addEventListener("click", () => {
  filterBtn.classList.toggle("active");
  filterArea.classList.toggle("show");
});
searchInput.addEventListener("keyup", searchImages);

filterSelectElem[0].addEventListener("input", () => {
  const selectedValue = filterSelectElem[0].value;

  filterImages(selectedValue);
});

// horizontal == landscape , vertical == horizontal
