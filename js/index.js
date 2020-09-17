"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const filmPodaci = {};
const filmZanr = {};
const filmZanrBP = {};
const filmOcjena = {};

/*****Dohvaćanje podataka*****/

const kontolaRezultata = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'https://api.themoviedb.org/3/discover/movie?api_key=5945a0abd9acd913047172b2e6571d3e&sort_by=popularity.desc&include_adult=false&include_video=false&page=1';
    filmPodaci.search = new Pretrazivanje(query);
    yield filmPodaci.search.getResults();
    ucitajViseFilmova(filmPodaci.search.result);
});
const zanroviRezultati = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'https://api.themoviedb.org/3/genre/movie/list?api_key=5945a0abd9acd913047172b2e6571d3e';
    filmZanr.search = new Pretrazivanje(query);
    yield filmZanr.search.dohvatiZanroviRezultati();
});
const ruletRezultati = (generirajId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `https://api.themoviedb.org/3/discover/movie?api_key=5945a0abd9acd913047172b2e6571d3e&with_genres=${generirajId}`;
    filmZanrBP.search = new Pretrazivanje(query);
    yield filmZanrBP.search.dohvatiRezultateRuleta();
    generiranjeFilmaPoZanru(filmZanrBP.search.generirajId.data.results);
});
class Pretrazivanje {
    constructor(query) {
        this.query = query;
    }
    getResults() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios(`${this.query}`);
                this.result = res.data.results;
            }
            catch (error) {
                alert(error);
            }
        });
    }
    dohvatiZanroviRezultati() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gen = yield axios(`${this.query}`);
                this.genre = gen;
            }
            catch (error) {
                alert(error);
            }
        });
    }
    dohvatiRezultateRuleta() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const genId = yield axios(`${this.query}`);
                this.generirajId = genId;
            }
            catch (error) {
                alert(error);
            }
        });
    }
}
const maksimalnaDuzinaNaziva = 25;
const limitMovieTitle = (title) => {
    if (title.length > maksimalnaDuzinaNaziva) {
        return (title.slice(0, maksimalnaDuzinaNaziva - 3) + "...");
    }
    else
        return title;
};
const ogranicenjeGodineFilma = (year) => {
    return (year.slice(0, 4));
};
const ucitavanjeFilmova = document.querySelector('.prikazi-filmove');
const gumbUcitajVise = document.querySelector('.gumb-ucitajvise');
const navigacija = document.getElementById("navigacija");
const sadrzajZamucenePozadine = document.querySelector('.sadrzaj-zamucene-pozadine');
const element = document.querySelector('.gumb-ucitajvise');
const gumbRulet = document.querySelector('.gumb-rulet');

/*****rendera filmove u li-jeve*****/

const ucitajFilm = (movie, i) => {
    const markup = `
    <li class="film-okvir movie" data-itemid=${i}>
        <div class="slika-filma"><img src ="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}"></div>
        <div class="naziv-filma">${limitMovieTitle(movie.title)} (${ogranicenjeGodineFilma(movie.release_date)})</div>
        <div class="jezik-filma">Language: ${movie.original_language}</div>
        <div class="ocjena-filma">Rating: ${movie.vote_average}</div>
    </li>
    `;
    ucitavanjeFilmova.insertAdjacentHTML('beforeend', markup);
};
let pocetniFilm = 0, zavrsniFilm = 3;
const ucitajViseFilmova = (filmovi) => {
    //console.log(filmovi);
    for (pocetniFilm; pocetniFilm <= zavrsniFilm; pocetniFilm++) {
        ucitajFilm(filmovi[pocetniFilm], pocetniFilm);
    }
    //filmovi.forEach(ucitajFilm);
};
/*****gumb za učitavanje reda filmova******/

gumbUcitajVise.addEventListener('click', e => {
    e.preventDefault();
    zavrsniFilm += 4;
    ucitajViseFilmova(filmPodaci.search.result);
    if ((zavrsniFilm + 4) > 20) {
        element.parentNode.removeChild(element);
    }
});

/*****render za određeni film u overlay*****/

let zvjezdice = `<span class='zvjezdica' id="1" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="2" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="3" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="4" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="5" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="6" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="7" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="8" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="9" onclick="spremiZvjezdice(this.id)">☆</span>
<span class='zvjezdica' id="10" onclick="spremiZvjezdice(this.id)">☆</span>`;
const ucitajPojediniFilm = (movie, i) => {
    const markup = `
    <li class="movie-ol"  data-itemid=${i}>
        <div class="film-ol-naziv">
            <div class="movie-overlay-name">${movie.title} (${ogranicenjeGodineFilma(movie.release_date)})</div>
            <a class="gumb-zatvaranja" onclick="ocistiOverlay()">&times;</a>
        </div>
        <div class="film-ol-slika" style = background-image:url("https://image.tmdb.org/t/p/w780/${movie.backdrop_path}"); alt="${movie.title}">
            <div class='rating film-zvijezdice' data-itemid=${movie.id}>
                ${zvjezdice}
            </div>    
        </div>
        <div class="film-ol-sadrzaj"><strong>Overview</strong>: ${movie.overview}</div>
        <div class="film-ol-ocjena"><b>Rating:</b> <em>${movie.vote_average}</em></div>
        <div class="film-ol-popularnost"><b>Popularity:</b> <em>${movie.popularity}</em></div>
        <div class="film-ol-jezik"><b>Language:</b> <em>${movie.original_language}</em></div>
        
    </li>
    `;
    const ucitajJedanFilm = document.querySelector('.render-a-movie');
    ucitajJedanFilm.insertAdjacentHTML('beforeend', markup);
    dohvatiOcjenu(`${parseInt(movie.id)}`);
};
/*****event listener na filmovima******/

ucitavanjeFilmova.addEventListener('click', e => {
    const id = e.target.closest('.film-okvir').dataset.itemid;
    navigacija.style.display = "block";
    const miniMarkup = `<ul class="render-a-movie"></ul>`;
    sadrzajZamucenePozadine.insertAdjacentHTML('beforeend', miniMarkup);
    ucitajPojediniFilm(filmPodaci.search.result[id], id);
});

function ocistiOverlay() {
    navigacija.style.display = "none";
    while (sadrzajZamucenePozadine.hasChildNodes()) {
        sadrzajZamucenePozadine.removeChild(sadrzajZamucenePozadine.firstChild);
    }
}

/*****da se overlay može zatvoriti s tipkom esc*****/

let escTipka = 27;
document.addEventListener('keydown', function (event) {
    if (event.keyCode == escTipka || event.which == escTipka) {
        navigacija.style.display = "none";
        while (sadrzajZamucenePozadine.hasChildNodes()) {
            sadrzajZamucenePozadine.removeChild(sadrzajZamucenePozadine.firstChild);
        }
    }
});

/*****event listener na rulet gumb*****/

gumbRulet.addEventListener('click', e => {
    e.preventDefault();
    navigacija.style.display = "block";
    const miniMarkup = `<div class="forma-polozaj-x"><a class="forma-izlaz" onclick="ocistiOverlay()">&times;</a></div><div class="forma-zanrovi"></div>`;
    sadrzajZamucenePozadine.insertAdjacentHTML('beforeend', miniMarkup);
    generirajZanrove(filmZanr.search.genre.data.genres);
    const buttonMarkup = `<button class="odabir-zanra">Roll</button>`;
    sadrzajZamucenePozadine.insertAdjacentHTML('beforeend', buttonMarkup);
    document.querySelector('.forma-polje').checked = true;
});
/*****rendera žanrove*****/
const generirajZanrove = (zanr) => {
    zanr.forEach(prikaziZanr);
};
const prikaziZanr = (zanr) => {
    const formaZanra = document.querySelector('.forma-zanrovi');
    const markup = `
    <div class="radio-grupa">
    <input type="radio" class="forma-polje" name="genre-type" value=${zanr.id} id="${zanr.name}">
    <label for="${zanr.name}" class="radio-tekst">
        <span class="radio-gumb"></span>
        ${zanr.name}
    </label>
</div>
    `;
    formaZanra.insertAdjacentHTML('beforeend', markup);
};
/*****event listener na roll gumb*****/
sadrzajZamucenePozadine.addEventListener('click', e => {
    let generirajId = 0;
    if (e.target.matches('.odabir-zanra')) {
        const ele = document.getElementsByName('genre-type');
        for (let k = 0; k < ele.length; k++) {
            if (ele[k].checked)
            generirajId = ele[k].value;
        }
        brisanjeListeZanrova();
        const miniMarkup = `<ul class="render-a-movie"></ul>`;
        sadrzajZamucenePozadine.insertAdjacentHTML('beforeend', miniMarkup);
        ruletRezultati(generirajId);
    }
});
/*****brisanje childova diva s klasom "sadrzaj-zamucene-pozadine"*****/

const brisanjeListeZanrova = () => {
    while (sadrzajZamucenePozadine.hasChildNodes()) {
        sadrzajZamucenePozadine.removeChild(sadrzajZamucenePozadine.firstChild);
    }
};

/*****rendera film iz odabranog žanra*****/

const generiranjeFilmaPoZanru = (ruletFilmova) => {
    const markup = `
    <li>
        <div class="film-ol-naziv">
            <div class="movie-overlay-name">${ruletFilmova[0].title} (${ogranicenjeGodineFilma(ruletFilmova[0].release_date)})</div>
            <a class="gumb-zatvaranja" onclick="ocistiOverlay()">&times;</a>
        </div>
        <div class="film-ol-slika" style=background-image:url("https://image.tmdb.org/t/p/w780/${ruletFilmova[0].backdrop_path}") alt="${ruletFilmova[0].title}">
            <div class='rating film-zvijezdice' data-itemid=${ruletFilmova[0].id}>
                ${zvjezdice}
            </div>         
	    </div>
        <div class="film-ol-sadrzaj"><strong>Overview</strong>: ${ruletFilmova[0].overview}</div>
        <div class="film-ol-ocjena"><b>Rating:</b> <em>${ruletFilmova[0].vote_average}</em></div>
        <div class="film-ol-popularnost"><b>Popularity:</b> <em>${ruletFilmova[0].popularity}</em></div>
        <div class="film-ol-jezik"><b>Language:</b> <em>${ruletFilmova[0].original_language}</em></div>   
    </li>
    `;
    const ucitajJedanFilm = document.querySelector('.render-a-movie');
    ucitajJedanFilm.insertAdjacentHTML('beforeend', markup);
    dohvatiOcjenu(`${parseInt(ruletFilmova[0].id)}`);
};
// Check we can access localstorage
if (!window.localStorage) {
    console.log('Unable to access LS');
}
class Ocjene {
    constructor() {
        this.ocjene = [];
    }
    addUpdateRate(id, filmID) {
        let index = -1;
        let trazilo;
        for (trazilo = 0; trazilo <= filmOcjena.ocjene.ocjene.length; trazilo++) {
            if (parseInt(filmOcjena.ocjene.ocjene[trazilo].filmID) === filmID) {
                index = trazilo;
                break;
            }
        }
        if (index >= 0) {
            filmOcjena.ocjene.ocjene[trazilo].id = id;
            this.persistData();
        }
    }
    saveMovieData(filmID) {
        const id = 0;
        const rate = { id, filmID };
        this.ocjene.push(rate);
        // Perist data in localStorage
        this.persistData();
        return rate;
    }
    findRate(filmID) {
        let ocjena = 0, trazilo;
        for (trazilo = 0; trazilo <= filmOcjena.ocjene.ocjene.length; trazilo++) {
            if (parseInt(filmOcjena.ocjene.ocjene[trazilo].filmID) === parseInt(filmID)) {
                ocjena = parseInt(filmOcjena.ocjene.ocjene[trazilo].id);
                break;
            }
        }
        return ocjena;
    }
    fillSessionStorage() {
        let sessionStorage = [];
        for (let i = 0; i < filmOcjena.ocjene.ocjene.length; i++) {
            sessionStorage.push(filmOcjena.ocjene.ocjene[i].filmID);
        }
        return sessionStorage;
    }
    /* deteleAll(){
        this.ocjene.splice(0, 5);
        this.persistData();
    }  */
    persistData() {
        localStorage.setItem('ocjene', JSON.stringify(this.ocjene));
    }
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('ocjene'));
        if (storage)
            this.ocjene = storage;
    }
}
let sessionStorage = [];
function pocetnaFunkcija() {
    sessionStorage = filmOcjena.ocjene.fillSessionStorage();
}
function spremiZvjezdice(id) {
    let filmID = parseInt(document.querySelector('.rating').dataset.itemid);
    let prvi = filmOcjena.ocjene.findRate(filmID);
    filmOcjena.ocjene.addUpdateRate(id, filmID);
    let drugi = filmOcjena.ocjene.findRate(filmID);
    if (prvi !== drugi || prvi !== 1) {
        dohvatiOcjenu(filmID);
    }
    else if (prvi === drugi && prvi === 1) {
        id = 0;
        filmOcjena.ocjene.addUpdateRate(id, filmID);
        const zvjezdice = document.getElementsByClassName("zvjezdica");
        zvjezdice[0].style.color = "black";
    }
    /* const deleteAll = () => {filmOcjena.ocjene.deteleAll();}
    deleteAll(); */
}
function dohvatiOcjenu(filmID) {
    if (sessionStorage.includes(filmID) == false) {
        filmOcjena.ocjene.saveMovieData(filmID);
        sessionStorage.push(filmID);
    }
    else {
        let a = filmOcjena.ocjene.findRate(filmID);
        const zvjezdice = document.getElementsByClassName("zvjezdica");
        for (var i = 0; i < zvjezdice.length; i++) {
            if (i >= a) {
                zvjezdice[i].style.color = "black";
            }
            else {
                zvjezdice[i].style.color = "orange";
            }
        }
    }
}
window.addEventListener('load', () => {
    filmOcjena.ocjene = new Ocjene();
    //restore
    filmOcjena.ocjene.readStorage();
    pocetnaFunkcija();
    kontolaRezultata();
    zanroviRezultati();
    //console.log(sessionStorage);
});
