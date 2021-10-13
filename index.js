//Fetch data from API url
async function fetchData(url) {
  const response = await fetch(url);
  console.log("Fetch response:", response);
  return response.json();
}

//Gets and shows any images
function renderImage(artwork) {
  const artImage = document.querySelector("#artwork-image img");
  artImage.src = artwork.webImage.url;
}

function renderData(artwork) {
  const artistName = document.querySelector(".name-artist-artwork h3");
  const artworkName = document.querySelector(".name-artist-artwork p");
  const date = document.querySelectorAll(".date");
  const today = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    today
  );
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    today
  );

  //Make Sundays number red
  if (weekday === "Sunday") {
    date[0].style.color = "#dd0000";
  }
  date[0].textContent = today.getDate();
  date[1].textContent = weekday;
  date[2].textContent = month;
  artistName.textContent = artwork.principalOrFirstMaker;
  artworkName.textContent = artwork.title;
}

//Calculate total height based on the image height
function calcContainerHeight() {
  const imgHeight = document.querySelector("#artwork-image").clientHeight;
  console.log("img =", imgHeight);

  const calendarInfoHeight =
    document.querySelector(".calendar-info").clientHeight;
  console.log("info =", calendarInfoHeight);

  const totalHeight = imgHeight + calendarInfoHeight;
  console.log("total =", totalHeight);

  const container = document.querySelector(".container");
  container.style.height = `${totalHeight}px`;
  console.log(container.style.height);
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
    // const artwork = artObjects[Math.floor(Math.random() * artObjects.length)];
    const artwork = artObjects[0];

    renderImage(artwork);
    renderData(artwork);
    calcContainerHeight();

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
    console.log("Something went wrong:", error.message);
  }
}

//Call main function after loading page
window.addEventListener("load", main);
