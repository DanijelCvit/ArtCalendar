//Fetch data from API url
async function fetchData(url) {
  const response = await fetch(url);
  console.log("Fetch response:", response);
  return response.json();
}

//Calculates and display current date, artist and artwork name
function renderDataFront(artObject) {
  // Render image
  const artImage = document.querySelector("#artwork-image");
  artImage.src = artObject?.webImage?.url;

  // Remove loading gif
  const loadingGIF = document.querySelector(".loading-gif");
  loadingGIF.style.display = "none";

  //Enable artImage
  artImage.style.display = "block";

  // Render calendar info
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

function calcTotalHeight() {
  const imgHeight = document.querySelector("#artwork-image").offsetHeight;
  const calendarInfoHeight =
    document.querySelector(".calendar-info").offsetHeight;

  const scene = document.querySelector(".scene");
  const totalHeight = imgHeight + calendarInfoHeight;
  scene.style.height = `${totalHeight}px`;
}

// Displays information about the artwork show at front
async function renderDataBack(artObjectDetails) {
  //Get detailed info for back of card

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

function getRandomObject(results, pageItems) {
  const maxPages = Math.ceil(results / pageItems);
  const minPageItems = results % pageItems;
  const page = Math.ceil(Math.random() * maxPages);
  const index =
    page === maxPages
      ? Math.floor(Math.random() * minPageItems)
      : Math.floor(Math.random() * pageItems);

  return { page, index };
}

function displayResults(artObjects, url) {
  const imgArray = artObjects.map((obj) => {
    // Create image element
    const key = url.match(/key=\w+/);
    const imgElement = document.createElement("img");
    imgElement.src = obj.webImage.url?.replace("=s0", "=w800");
    imgElement.objURL = `${obj.links.self}?${key}`;

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

  // Get search container to append results to
  const container = document.querySelector(".search-results");
  container.append(...imgArray);
}

async function searchArt(url) {
  const { artObjects } = await fetchData(url);

  if (artObjects.length) {
    displayResults(artObjects, url);
  }
  return artObjects.length;
}

//Manages retrieval and display of search queries
async function main() {
  // NOTE: THIS KEY WILL NOT BE UPLOADED TO GITHUB
  const key = config.SECRET_API_KEY;
  let query = {
    key: key,
    format: "json",
    culture: "en",
    p: 1,
    ps: 40,
    q: "",
    involveMaker: "",
    type: "",
    material: "canvas",
    technique: "",
    "f.dating.period": " ",
    "f.normalized32Colors.hex": "",
    imgonly: true,
    toppieces: true,
    s: "relevance",
    searchLimit: 10000,
    get url() {
      return `https://www.rijksmuseum.nl/api/${this.culture}/collection?key=${this.key}&material=${this.material}&technique=${this.technique}&toppieces=${this.toppieces}&imgonly=${this.imgonly}&p=${this.p}&ps=${this.ps}&q=${this.q}&involveMaker=${this.involveMaker}&s=${this.s}`;
    },
  };

  try {
    // Select random letter from [a-z] and fetch result
    query.q = getRandomChar();
    const results = await fetchData(query.url);

    // Get  the total number of results
    const { count } = results;

    // Get a random page and item number from total number
    const { page, index } = getRandomObject(
      Math.min(count, query.searchLimit),
      query.ps
    );

    // Fetch art object from random selected page and index
    query.p = page;
    const { artObjects } = await fetchData(query.url);
    const artObject = artObjects[index];
    renderDataFront(artObject);

    const artObjectURL = `${artObject.links.self}?key=${query.key}`;
    const { artObject: artObjectDetails } = await fetchData(artObjectURL);
    renderDataBack(artObjectDetails);

    // Flip Calendar card after mouse click
    const calendarCard = document.querySelector(".card");
    calendarCard.onclick = () => {
      calendarCard.classList.toggle("card-is-flipped");
    };

    //Get search results after hitting "Enter"
    const searchField = document.getElementById("searchField");

    searchField.onkeyup = async (event) => {
      query.q = searchField.value.trim();
      if (event.key !== "Enter" || !query.q) {
        return;
      }
      // Reset page to 1 for new query
      query.p = 1;
      // Remove any existing search results
      const searchResults = document.querySelector(".search-results");
      searchResults.innerHTML = "";
      const numberOfResults = await searchArt(query.url);
      if (!numberOfResults) {
        // Hide day calendar
        const scene = document.querySelector(".scene");
        scene.style.display = "none";

        // Create flex container for message
        const nothingFound = document.createElement("div");
        nothingFound.classList.add("nothing-found");

        //Create message
        const message = document.createElement("p");
        message.textContent = "Your search did not match any art objects";
        nothingFound.append(message);

        // Append it to seearch results container
        const searchResults = document.querySelector(".search-results");
        searchResults.append(nothingFound);
      }
    };

    const scrollTrigger = { previous: false, current: false };
    let numberOfResults = 1;
    window.onscroll = async () => {
      // If day calendar is visible disable infinite scroll
      const scene = document.querySelector(".scene");
      if (scene.style.display !== "none") {
        return;
      }
      scrollTrigger.previous = scrollTrigger.current;
      scrollTrigger.current =
        document.documentElement.scrollHeight - window.scrollY - 500 <=
        document.documentElement.clientHeight;

      if (!scrollTrigger.previous && scrollTrigger.current && numberOfResults) {
        query.p++;
        numberOfResults = await searchArt(query.url);
      }
    };

    const artImage = document.getElementById("artwork-image");
    artImage.onload = calcTotalHeight;

    const searchResults = document.querySelector(".search-results");
    searchResults.onclick = async (event) => {
      // Check if no image is clicked
      if (!event.target.src) {
        return;
      }
      // Show day calendar container (scene)
      const scene = document.querySelector(".scene");
      scene.style.display = "block";

      // Enable loading gif
      const loadingGIF = document.querySelector(".loading-gif");
      loadingGIF.style.display = "flex";

      const artImage = document.querySelector("#artwork-image");
      artImage.style.display = "none";

      // Hide search container
      searchResults.style.display = "none";

      // Show close button
      const closeButton = document.querySelector(".close-button");
      closeButton.style.display = "block";

      // Fetch selected artObject
      const selectedImageURL = event.target.objURL;
      const { artObject } = await fetchData(selectedImageURL);

      // Render selected artObject
      renderDataFront(artObject);
      renderDataBack(artObject);
    };

    const closeButton = document.querySelector(".close-button");
    closeButton.onclick = (event) => {
      const scene = document.querySelector(".scene");
      scene.style.display = "none";

      // Go back to search results
      searchResults.style.display = "flex";
      event.stopPropagation();
    };
  } catch (error) {
    console.log("Something went wrong:", error);
    window.location.reload(true);
  }
}
//Call main function after loading page
window.addEventListener("load", main);
