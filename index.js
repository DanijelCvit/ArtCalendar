//Fetch data from API url
async function fetchData(url) {
  const response = await fetch(url);
  console.log("Fetch response:", response);
  return response.json();
}

//Shows the selected image
function renderImage(artObject) {
  const artImage = document.querySelector("#artwork-image");
  artImage.src = artObject.webImage.url;
}

//Calculates and display current date, artist and artwork name
function renderDataFront(artObject) {
  const date = document.querySelectorAll(".date");
  const today = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    today
  );
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    today
  );

  date[0].textContent = today.getDate();
  date[1].textContent = weekday;
  date[2].textContent = month;

  //Make Sundays number red
  if (weekday === "Sunday") {
    date[0].style.color = "#dd0000";
  }

  const artistName = document.querySelector(".name-artist-artwork h3");
  artistName.textContent = artObject.principalOrFirstMaker;

  const artworkName = document.querySelector(".name-artist-artwork p");
  artworkName.textContent = artObject.title;
}

//Calculates total card height based on the current image height
function calcContainerHeight() {
  const imgHeight = document.querySelector("#artwork-image").clientHeight;
  const calendarInfoHeight =
    document.querySelector(".calendar-info").clientHeight;

  const container = document.querySelector(".container");
  const totalHeight = container.clientHeight + imgHeight + calendarInfoHeight;
  container.style.height = `${totalHeight}px`;
}

// Displays information about the artwork show at front
function renderDataBack(artObjectDetails) {
  const {
    label,
    plaqueDescriptionEnglish,
    subTitle,
    physicalMedium,
    principalOrFirstMaker,
    dating,
    description,
    title,
  } = artObjectDetails;

  const artObjectInfo = document.querySelectorAll(".artwork-info dd");
  artObjectInfo[0].textContent = principalOrFirstMaker;
  artObjectInfo[1].textContent = label.title || title;
  artObjectInfo[2].textContent = dating.presentingDate;
  artObjectInfo[3].textContent = physicalMedium;
  artObjectInfo[4].textContent = subTitle;

  const artObjectTitle = document.querySelector(".artwork-description h3");
  artObjectTitle.textContent = label.title || title;

  const artObjectDescription = document.querySelectorAll(
    ".artwork-description p"
  );
  artObjectDescription[0].textContent = plaqueDescriptionEnglish || description;
  artObjectDescription[1].textContent = label.description;
}

function getRandomChar() {
  const unicode = Math.floor(Math.random() * 26) + 97;
  const char = String.fromCharCode(unicode);

  return char;
}

function getRandomObject(results, pageCount) {
  // console.log({ results, pageCount });

  const page = Math.floor(Math.random() * Math.floor(results / pageCount));
  const index = Math.floor(Math.random() * pageCount);

  // console.log({ page, index });
  return { page, index };
}

function displayResults(artObjects) {
  // Remove any existing search results
  const searchResults = document.querySelector(".search-results");
  if (searchResults) {
    searchResults.remove();
  }

  const imgArray = artObjects.map((obj) => {
    // Create image element
    const imgElement = document.createElement("img");
    imgElement.src = obj.webImage.url;

    // Wrap image element in a container
    // const imgContainer = document.createElement("div");
    // imgContainer.classList.add("img-container");
    // imgContainer.append(imgElement);

    // Create image title
    const titleElement = document.createElement("p");
    titleElement.textContent = obj.title;

    // Add everything inside a result element
    const resultElement = document.createElement("div");
    resultElement.append(imgElement, titleElement);
    resultElement.classList.add("result");

    //Wrap everything inside a flex-container
    const containerElement = document.createElement("li");
    containerElement.append(resultElement);
    containerElement.classList.add("result-container");

    return containerElement;
  });

  // Hide day calendar
  const scene = document.querySelector(".scene");
  scene.style.display = "none";

  // Create container to hold search results
  const container = document.createElement("ul");
  container.classList.add("search-results");
  container.append(...imgArray);
  scene.parentElement.append(container);
}

async function searchArt(url) {
  const { artObjects } = await fetchData(url);

  displayResults(artObjects);

  // Print results
  console.log(artObjects);
}

//Manages retrieval and display of search queries
async function main() {
  // NOTE: THIS KEY WILL NOT BE UPLOADED TO GITHUB
  const key = config.SECRET_API_KEY;
  let searchObj = {
    // This should be obfuscated somehow
    key: key,
    // json / jsonp / xml
    format: "json",
    // nl / en
    culture: "en",
    // 0-n (result page)
    p: 0,
    // 1-100 (results per page)
    ps: 40,
    // a-z Search query
    q: "",
    // a-z Made by
    involveMaker: "",
    // a-z
    type: "",
    material: "",
    technique: "",
    "f.dating.period": " ",
    "f.normalized32Colors.hex": "",
    imgonly: true,
    toppieces: true,
    // sort by relevance / objecttype / chronologic
    // achronologic / artist ( a-z) / artistdesc (z-a)
    s: "relevance",
    searchLimit: 10000,
  };

  try {
    // searchObj.q = `${getRandomChar()}`;
    let url = `https://www.rijksmuseum.nl/api/${searchObj.culture}/collection?key=${searchObj.key}&q=${searchObj.q}&involveMaker=${searchObj.involveMaker}`;

    // const results = await fetchData(url);
    // console.log("Fetch results:", results);

    // Get  the total number of results
    // const { countFacets: resultsCount } = results;

    // Get a random page and item number from results range
    // const { page, index } = getRandomObject(
    //   Math.min(resultsCount.hasimage, searchObj.searchLimit),
    //   searchObj.ps
    // );

    // Fetch art object from random selected page and index
    // searchObj.p = page;
    // url = `https://www.rijksmuseum.nl/api/${searchObj.culture}/collection?key=${searchObj.key}&p=${searchObj.p}`;
    // const { artObjects } = await fetchData(url);
    // const artObject = artObjects[index];

    // console.log("Random object: ", artObject);
    // renderImage(artObject);
    // renderDataFront(artObject);
    // calcContainerHeight();

    // Get detailed info of art object
    //url format: https://www.rijksmuseum.nl/api/nl/collection/SK-C-5?key=[api-key]
    // const artObjectURL = `${artObjects[index].links.self}?key=${searchObj.key}`;
    // const { artObject: artObjectDetails } = await fetchData(artObjectURL);
    // //console.log("Fetch results:", artObjectDetails);

    // renderDataBack(artObjectDetails);

    //Flip Calendar card after mouse click
    // const calendarCard = document.querySelector(".card");
    // calendarCard.onclick = () => {
    //   calendarCard.classList.toggle("card-is-flipped");
    // };

    //Get search results after hitting "Enter"
    const searchField = document.getElementById("searchField");
    searchField.onkeyup = (event) => {
      console.log(searchField.value);
      if (event.key !== "Enter" || !searchField.value.trim()) {
        console.log("Invalid input");
        return;
      }
      searchObj.involveMaker = searchField.value.trim();
      url = `https://www.rijksmuseum.nl/api/${searchObj.culture}/collection?key=${searchObj.key}&toppieces=${searchObj.toppieces}&imgonly=${searchObj.imgonly}&ps=${searchObj.ps}&q=${searchObj.q}&involveMaker=${searchObj.involveMaker}`;
      console.log(url);
      searchArt(url);
    };
  } catch (error) {
    console.log("Something went wrong:", error);
  }
}

//Call main function after loading page
window.addEventListener("load", main);
