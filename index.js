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
  console.log({ results, pageCount });
  const page = Math.floor(Math.random() * Math.floor(results / pageCount));
  const index = Math.floor(Math.random() * pageCount);

  console.log({ page, index });
  return { page, index };
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
    ps: 10,
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
    imgonly: false,
    toppieces: false,
    // sort by relevance / objecttype / chronologic
    // achronologic / artist ( a-z) / artistdesc (z-a)
    s: "relevance",
    searchLimit: 10000,
  };

  try {
    searchObj.q = `${getRandomChar()}`;
    let url = `https://www.rijksmuseum.nl/api/${searchObj.culture}/collection?key=${searchObj.key}&q=${searchObj.q}&involveMaker=${searchObj.involveMaker}`;

    const results = await fetchData(url);

    console.log("Fetch results:", results);
    // const result = artObjects[Math.floor(Math.random() * artObjects.length)];
    const { countFacets: resultsCount } = results;
    const { page, index } = getRandomObject(
      Math.min(resultsCount.hasimage, searchObj.searchLimit),
      searchObj.ps
    );

    searchObj.p = page;
    url = `https://www.rijksmuseum.nl/api/${searchObj.culture}/collection?key=${searchObj.key}&&p=${searchObj.p}`;
    const { artObjects } = await fetchData(url);
    const artObject = artObjects[index];

    renderImage(artObject);
    renderDataFront(artObject);
    calcContainerHeight();

    //https://www.rijksmuseum.nl/api/nl/collection/SK-C-5?key=[api-key]
    const artObjectURL = `${artObjects[index].links.self}?key=${searchObj.key}`;
    const { artObject: artObjectDetails } = await fetchData(artObjectURL);
    console.log("Fetch results:", artObjectDetails);

    renderDataBack(artObjectDetails);

    //Get search results after hitting "Enter"
    const searchField = document.getElementById("searchField");
    searchField.onkeyup = (event) => {
      console.log(searchField.value);
      if (event.key === "Enter") {
        searchField.value = "";
      }
    };

    //Flip Calendar card after mouse click
    const calendarCard = document.querySelector(".card");

    calendarCard.onclick = () => {
      calendarCard.classList.toggle("card-is-flipped");
    };
  } catch (error) {
    console.log("Something went wrong:", error);
  }
}

//Call main function after loading page
window.addEventListener("load", main);
