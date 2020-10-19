function setup() {
	const allEpisodes = getAllEpisodes();
	selectShowsFromMenu();
	makePageForShows();
	searchTheEpisodes();
	selectTheEpisodeFromList();
}
//This function is to fetch shows and episodes from an API
let rootElem = document.querySelector("#root");
const fetchDataFromAPI = (id) => {
	fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
		.then((resp) => resp.json())
		.then((data) => makePageForEpisodes(data))
		.catch((error) => console.log(`Error ${error}`));
};
/*****************************************************************************&&&**************/
//Function to display all episodes of a show
function makePageForEpisodes(episodeList) {
	function zeroPadded(episodeCode) {
		return episodeCode.toString().padStart(2, "0");
	}
	const rowDiv = document.querySelector("#rowCard");
	rowDiv.innerHTML = "";
	const selectEpisode = document.querySelector("#selectEpisode");
	selectEpisode.innerHTML = "";
	const optionalElem = document.createElement("option");
	optionalElem.innerText = "All episodes";
	selectEpisode.appendChild(optionalElem);
	episodeList.forEach((episode) => {
		const optionalElem = document.createElement("option");
		optionalElem.innerText = `S${zeroPadded(episode.season)}E${zeroPadded(
			episode.number
		)} - ${episode.name}`;
		optionalElem.value = `S${zeroPadded(episode.season)}E${zeroPadded(
			episode.number
		)}`;
		selectEpisode.appendChild(optionalElem);
		const cardDiv = document.createElement("div");
		cardDiv.className = "col-3 card";
		cardDiv.id = `S${zeroPadded(episode.season)}E${zeroPadded(episode.number)}`;
		const cardDivTitle = document.createElement("div");
		cardDivTitle.className = "cardTitle";
		const episodeName = document.createElement("h6");
		episodeName.className = "cardHeader";
		episodeName.innerText = `${episode.name} - ${cardDiv.id}`;
		const episodeImage = document.createElement("img");
		episodeName.className = "cardImage";
		if (episode.img !== null) {
			episodeImage.src = episode.image.medium;
		}
		const episodeSummary = document.createElement("p");
		episodeSummary.className = "cardText";
		episodeSummary.innerHTML = episode.summary;
		cardDiv.appendChild(episodeName);
		cardDiv.appendChild(episodeImage);
		cardDiv.appendChild(episodeSummary);
		rowDiv.appendChild(cardDiv);
	});
}
/***********************************************************************************************/
//Function to search for shows and episodes
function searchTheEpisodes() {
	const searchInputElem = document.querySelector("#searchInput");
	const inputResult = document.querySelector(".searchContent");
	const searchEp = (name) => {
		console.log(name);
		const inputText = name.target.value.toLowerCase();
		const listCards = document.querySelectorAll(".card");
		const list = Array.from(listCards);
		list.forEach((card) => {
			if (card.innerText.toLowerCase().indexOf(inputText) !== -1) {
				card.style.display = "block";
			} else {
				card.style.display = "none";
			}
		});
		let newList = list.filter((item) => item.style.display === "block");
		inputResult.textContent = `${newList.length} episodes/shows match your search`;
	};
	searchInputElem.addEventListener("input", searchEp);
}
/***********************************************************************************************/
//Function to select Episodes and shows
function selectTheEpisodeFromList() {
	const selectEpisode = document.querySelector("#selectEpisode");
	selectEpisode.addEventListener("change", selectFromMenu);
	function selectFromMenu (event) {
		const listCard = document.querySelector(".card");
		console.log(listCard);
		listCard.forEach((episode) => {
			if (event.value.target === "All episodes") {
				console.log(All episodes);
				episode.style.display = "block";
			} else {
				episode.id === event.target.value
					? (episode.style.display = "block")
					: (episode.style.display = "none");
			}
		});
	};
	
}
/*************************************************************************************************/
function selectShowsFromMenu() {
	const allShows = getAllShows();
	const sortedShows = allShows.sort((a, b) => {
		if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
			return -1;
		}
		if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
			return 1;
		}
		return 0;
	});
	const selectShow = document.querySelector("#selectShow");
	sortedShows.forEach((show) => {
		const showOptions = document.createElement("option");
		showOptions.value = show.id;
		showOptions.innerText = show.name;
		selectShow.appendChild(showOptions);
	});
	selectShow.addEventListener("change", (event) => {
		const showContents = document.querySelector("#showResult");
		if (event.target.value === "") {
			showContents.style.display = "flex";
		} else {
			fetchDataFromAPI(event.target.value);
			showContents.style.display = "none";
		}
	});
}
/*************-----------&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&-----------*************/
function makePageForShows() {
	const allShows = getAllShows();
	const showContents = document.querySelector("#searchContainer");
	const showCardRow = document.querySelector("#showResult");
	allShows.forEach((show) => {
		const showCardCol = document.createElement("div");
		showCardCol.className = "col-3 card";
		showCardCol.style.margin = "2.5rem";

		showCardCol.id = "showCard";
		const showTitle = document.createElement("h5");
		showTitle.className = "cardTitle";
		showTitle.innerText = show.name;
		const showImageCover = document.createElement("img");
		showImageCover.className = "cardImage";
		showImageCover.alt = `This is the image cover for the show ${show.name}.`;
		if (show.image !== null) {
			showImageCover.src = show.image.medium;
		}
		const showSummary = document.createElement("p");
		showSummary.className = "showText";
		showSummary.innerHTML = show.summary;
		const showDetails = document.createElement("div");
		const showDetailsList = document.createElement("ul");
		showDetailsList.style.listStyleType = "none";
		const showDetailsListItem1 = document.createElement("li");
		showDetailsListItem1.innerHTML = `Genres: ${show.genres}`;
		const showDetailsListItem2 = document.createElement("li");
		showDetailsListItem2.innerHTML = `Status: ${show.status}`;
		const showDetailsListItem3 = document.createElement("li");
		showDetailsListItem3.innerHTML = `Ratings: ${show.rating.average}`;
		const showDetailsListItem4 = document.createElement("li");
		showDetailsListItem4.innerHTML = `Run Time: ${show.runtime}`;
		showDetailsList.appendChild(showDetailsListItem1);
		showDetailsList.appendChild(showDetailsListItem2);
		showDetailsList.appendChild(showDetailsListItem3);
		showDetailsList.appendChild(showDetailsListItem4);
		showDetails.appendChild(showDetailsList);
		showCardCol.appendChild(showTitle);
		showCardCol.appendChild(showImageCover);
		showCardCol.appendChild(showSummary);
		showCardCol.appendChild(showDetails);
		showCardRow.appendChild(showCardCol);
		showContents.appendChild(showCardRow);
	});
}
window.onload = setup;
