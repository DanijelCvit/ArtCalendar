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

function getRandomObject(results, pageCount) {
  const page = Math.floor(Math.random() * Math.floor(results / pageCount));
  const index = Math.floor(Math.random() * pageCount);

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
    console.log(`Fetch results for '${query.q}:'`, results);

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

    console.log("Random object: ", artObject);
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
    searchField.onkeyup = (event) => {
      query.q = searchField.value.trim();
      console.log(searchField.value);
      if (event.key !== "Enter" || !query.q) {
        console.log("Invalid input");
        return;
      }

      // Reset page to 1 for new query
      query.p = 1;

      // Remove any existing search results
      const searchResults = document.querySelector(".search-results");
      searchResults.innerHTML = "";
      searchArt(query.url);
    };

    const scrollTrigger = { previous: false, current: false };
    window.onscroll = () => {
      // If day calendar is visible disable infinite scroll
      const scene = document.querySelector(".scene");
      if (scene.style.display !== "none") {
        return;
      }

      scrollTrigger.previous = scrollTrigger.current;
      scrollTrigger.current =
        document.documentElement.scrollHeight - window.scrollY - 500 <=
        document.documentElement.clientHeight;

      if (!scrollTrigger.previous && scrollTrigger.current) {
        console.log(
          `%c` + JSON.stringify(scrollTrigger),
          "color:white; background-color:green; padding: 0 5px;"
        );

        query.p++;
        searchArt(query.url);
      } else {
        console.log(
          `%c` + JSON.stringify(scrollTrigger),
          "color:white; background-color:red; padding: 0 5px;"
        );
      }
    };

    const searchResults = document.querySelector(".search-results");
    searchResults.onclick = async (event) => {
      // Show day calendar container (scene)
      const scene = document.querySelector(".scene");
      scene.style.display = "block";
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
      calcContainerHeight();
      renderDataBack(artObject);
    };

    const closeButton = document.querySelector(".close-button");
    closeButton.onclick = (event) => {
      const scene = document.querySelector(".scene");
      scene.style.display = "none";
      // Hide search container
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
