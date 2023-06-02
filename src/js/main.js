// DOM Elements
const searchList = document.querySelector(".search__list");
const defaultSearch = document.querySelector(".default__search");
const showSearchListBtn = document.querySelector(".show-btn");
const downloadImagebtn = document.querySelector(".download-btn");
const imagePopup = document.querySelector(".image__popup");
const closeImagePopupBtn = document.querySelector(".close__popup");
const previewImage = imagePopup.querySelector(".preview__image img");
let photographerName = imagePopup.querySelector(".photographer__name span");
const downloadForm = document.querySelector(".image__popup .download__form");
const showDownloadListBtn = document.querySelector(".download-btn i");
const loadMoreBtn = document.querySelector(".load-more-btn");

const apiKey = "pEUzmmnGt9nd2Teix7WPZaW3Qr6uDefhygFBxWVNAcy68eWbA3MEOXa8";
let perPage = 15;
let currentPage = 1;
const imagesElem = document.querySelector(".images");

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

// open image popup when clicked on image
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

function loadMoreImages() {
  currentPage++;
  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  getImages(apiUrl);
}

closeImagePopupBtn.addEventListener("click", closeImagePopup);
showDownloadListBtn.addEventListener("click", showDownloadList);
loadMoreBtn.addEventListener("click", loadMoreImages);

const downloadImage = (imageURL) => {
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

/**
 * get images from pexels
 */

const generateImages = (images) => {
  // let len = images.length;
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
                    <button onclick="downloadImage('${img.src.large2x}')">
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
    });
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);
