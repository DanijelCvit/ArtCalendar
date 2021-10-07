//Fetch data from API url
async function fetchData(url) {
  const response = await fetch(url);
  console.log("Fetch response:", response);
  return response.json();
}

//Gets and shows any images
function renderImage(artwork) {
  const artImage = document.querySelector("#artwork-image img");
  console.log(artwork.length);
  artImage.src = artwork.webImage.url;
}

function renderData(artwork) {
  const artistName = document.querySelector("#artist-artwork-name h3");
  const artworkName = document.querySelector("#artist-artwork-name p");
  artistName.textContent = artwork.principalOrFirstMaker;
  artworkName.textContent = artwork.title;
}

//Manages retrieval and display of search queries
async function main() {
  // NOTE: THIS KEY WILL NOT BE UPLOADED TO GITHUB
  const key = config.SECRET_API_KEY;
  let searchObj = {
    key: key, // This should be obfuscated somehow
    format: "json", // json / jsonp / xml
    culture: "nl", // nl / en
    p: 0, // 0-n (result page)
    ps: 10, // 1-100 (results per page)
    q: "", // a-z Search query
    involveMaker: "", // a-z Made by
    type: "", // a-z
    material: "",
    technique: "",
    "f.dating.period": " ",
    "f.normalized32Colors.hex": "",
    imgonly: false, // true / false
    toppieces: false, // true / false
    s: "relevance", // sort by relevance / objecttype / chronologic / achronologic / artist ( a-z) / artistdesc (z-a)
  };
  const url = `https://www.rijksmuseum.nl/api/nl/collection?key=${searchObj.key}&involvedMaker=Rembrandt+van+Rijn`;

  try {
    const { artObjects } = await fetchData(url);
    console.log("Fetch results:", artObjects);
    const artwork = artObjects[Math.floor(Math.random() * artObjects.length)];

    renderImage(artwork);
    renderData(artwork);
  } catch (error) {
    console.log("Something went wrong:", error.message);
  }
}

//Call main function after loading page
window.addEventListener("load", main);
