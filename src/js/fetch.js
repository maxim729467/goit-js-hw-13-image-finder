export const fetchPics = async function (query, page, loader) {
  const apiDetails = {
    root: "https://pixabay.com/api/",
    mainParams: "image_type=photo&orientation=horizontal",
    collection: 12,
    key: "21273112-45be21eebf5785c737b42a518",
  };

  const url = `${apiDetails.root}?${apiDetails.mainParams}&q=${query}&page=${page}&per_page=${apiDetails.collection}&key=${apiDetails.key}`;

  loader.classList.remove("loader--is-hidden");
  const response = await fetch(url);
  const data = await response.json();

  return data;
};
