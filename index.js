//Fetch data from API url
async function fetchData(url) {
  const response = await fetch(url);
  console.log("Fetch response:", response);
  return response.json();
}

//Gets and shows any images
function renderImage(artObject) {
  const artImage = document.querySelector("#artwork-image");
  artImage.src = artObject.webImage.url;
}

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

//Calculate total height based on the image height
function calcContainerHeight() {
  const imgHeight = document.querySelector("#artwork-image").clientHeight;
  console.log("img =", imgHeight);

  const calendarInfoHeight =
    document.querySelector(".calendar-info").clientHeight;
  console.log("info =", calendarInfoHeight);

  const container = document.querySelector(".container");
  const totalHeight = container.clientHeight + imgHeight + calendarInfoHeight;
  console.log("total =", totalHeight);

  container.style.height = `${totalHeight}px`;
  console.log(container.style.height);
}

function renderDataBack(artObjectDetails) {
  const {
    label,
    plaqueDescriptionEnglish,
    subTitle,
    physicalMedium,
    principalOrFirstMaker,
    dating,
  } = artObjectDetails;

  const artObjectInfo = document.querySelectorAll(".artwork-info dd");
  console.log(artObjectInfo);
  artObjectInfo[0].textContent = principalOrFirstMaker;
  artObjectInfo[1].textContent = label.title;
  artObjectInfo[2].textContent = dating.presentingDate;
  artObjectInfo[3].textContent = physicalMedium;
  artObjectInfo[4].textContent = subTitle;

  const artObjectTitle = document.querySelector(".artwork-description h3");
  artObjectTitle.textContent = label.title;

  const artObjectDescription = document.querySelectorAll(
    ".artwork-description p"
  );
  console.log(plaqueDescriptionEnglish);
  artObjectDescription[0].textContent = plaqueDescriptionEnglish;
  artObjectDescription[1].textContent = label.description;
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
    culture: "nl",
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
  };
  const url = `https://www.rijksmuseum.nl/api/en/collection?key=${searchObj.key}&involvedMaker=Rembrandt+van+Rijn`;

  try {
    const { artObjects } = await fetchData(url);
    console.log("Fetch results:", artObjects);
    // const artwork = artObjects[Math.floor(Math.random() * artObjects.length)];
    const artObject = artObjects[0];

    renderImage(artObject);
    renderDataFront(artObject);
    calcContainerHeight();

    //https://www.rijksmuseum.nl/api/nl/collection/SK-C-5?key=[api-key]
    const artObjectURL = `${artObjects[0].links.self}?key=${searchObj.key}`;
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
