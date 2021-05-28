import makeGrid from "../templates/gallery_template.hbs";
import { fetchPics } from "./fetch.js";
const debounce = require("lodash.debounce");
const basicLightbox = require("basiclightbox");
import {
  notice,
  success,
  alert,
} from "../../node_modules/@pnotify/core/dist/PNotify.js";

const gallery = document.querySelector(".gallery");
const input = document.querySelector("input");
const loadMoreButton = document.querySelector(".load-button");
const loader = document.querySelector(".loader");
let page = 0;

const options = {
  root: null,
  threshold: 0.9,
};
const observer = new IntersectionObserver(onScroll, options);

gallery.addEventListener("click", onImgClick);
input.addEventListener("input", debounce(createMarkup, 700));

function createMarkup() {
  const query = input.value;

  if (query.length === 0) {
    gallery.innerHTML = "";
    document.body.style.overflow = "hidden";
    return;
  }

  gallery.innerHTML = "";
  page = 1;
  document.body.style.overflow = "auto";
  onFetchHandler(query, page, loader);

  observer.observe(document.querySelector(".observer-trigger"));
}

function addElemsToGallery(result) {
  gallery.insertAdjacentHTML("beforeend", makeGrid(result));
  loader.classList.add("loader--is-hidden");
}

function onImgClick(e) {
  if (e.target.nodeName !== "IMG") {
    return;
  }

  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.large}" alt="${e.target.alt}">
`);

  instance.show();
}

function onScroll() {
  const query = input.value;
  page += 1;
  onFetchHandler(query, page, loader);
}

async function onFetchHandler(query, page, loader) {
  try {
    const getImages = await fetchPics(query, page, loader);
    addElemsToGallery(getImages);

    if (getImages.hits.length === 0) {
      const myNotice = alert({
        text: "No more images to fetch",
        delay: 2000,
        addClass: "warning-notice",
      });

      observer.unobserve(document.querySelector(".observer-trigger"));
      return;
    }

    //  const mySuccess = success({
    //      text: "Loaded successfully",
    //      delay: 2000,
    //      addClass: 'success-notice'
    //   });
  } catch (error) {
    loader.classList.add("loader--is-hidden");
    loadMoreButton.classList.add("load-button--is-hidden");

    const myError = notice({
      text: `${error}`,
      delay: 2000,
      addClass: "error-notice",
    });
  }
}
