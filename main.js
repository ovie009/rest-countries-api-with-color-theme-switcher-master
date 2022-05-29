let countries; // variable to store countries
let selectedCountry;  // variable to store the selected country being displayed
let fullCountryData;
let card; // variable to store card element
let main = $('main'); // main tag varaible
let loadSuccess = false; // variable to store the load status of API
let filterVisible = false; // variable to store visibility state of filter dropdown
let sortVisible = false; // variable to store visibility state of sort dropdown
let sortValue = 'nameASC';
let filterValue = 'All';
let searchValue = '';
let searching = false;
let viewCountry = false;
$(document).ready(function () {
    const request = new XMLHttpRequest();
    // console.log(main);
    request.open("GET", "https://restcountries.com/v3.1/all"); //open API request
    request.send(); // send API request
    request.onload = () =>{ // checking if the request data has loaded
        if (request.status === 200) { // if status of request is successful i.e === 200
            loadSuccess = true; // set loadSuccess variable equal to true
            fullCountryData = JSON.parse(request.response); // equate countries varaible to JSON data
            countries = JSON.parse(request.response); // equate countries varaible to JSON data
            // console.log("🚀 ~ file: main.js ~ line 22 ~ countries", countries[69])
            
            countries = searchCountry(searchValue, countries);
            countries = filterCountry(filterValue, countries);
            sortCountry(sortValue, countries);
            appendCard(countries);
            // appendCard(countries);

        } else {
            // if API doesn't load successfully console log the error
            console.log(`error ${request.status}`)
        }

        // if filter dropdown is clicked
        $('#filter').click(function(){
            
            if (filterVisible === false) { // if filter dropdpown isn't visible
                if (sortVisible === true) { // if sort dropdpown is visible
                    $('#sort-dropdown').slideUp(); // remove sort dropdown
                    sortVisible = false; // update the state of sort dropdown
                    // wait for 500milliseconds and display filter dropdown
                    setTimeout(() => {
                        $('#filter-dropdown').slideDown(); // slideDown function changes display from none to block
                        $('#filter-dropdown').css('display', 'flex'); // set display to flex 
                        //because that is what is used to style the dropdown
                        filterVisible = true; // update filter dropdpwn state
                        return; //terminate function
                    }, 500);
                }
                // if sort drop down is invisible
                $('#filter-dropdown').slideDown(); // slideDown function changes display from none to block
                $('#filter-dropdown').css('display', 'flex');// set display to flex 
                filterVisible = true; // update filter dropdown state
            } else { // if filter dropdown is visible
                $('#filter-dropdown').slideUp(); //remove filter dropdown
                filterVisible = false; // update filter dropdown state
            }
        });
        
        // if sort dropdown is clicked
        $('#sort').click(function(){

            if (sortVisible === false) { // if sort dropdpown isn't visible
                if (filterVisible === true) { // if filter dropdpown is visible
                    $('#filter-dropdown').slideUp(); // remove filter dropdown
                    filterVisible = false; // update the state of filter dropdown
                    setTimeout(() => {
                        $('#sort-dropdown').slideDown(); // slideDown function changes display from none to block
                        $('#sort-dropdown').css('display', 'flex'); // set display to flex 
                        //because that is what is used to style the dropdown
                        sortVisible = true;  // update sort dropdpwn state
                        return;  //terminate function
                    }, 500);
                }
                // if filter drop down is invisible
                $('#sort-dropdown').slideDown(); // slideDown function changes display from none to block
                $('#sort-dropdown').css('display', 'flex'); // set display to flex
                sortVisible = true; // update filter dropdown state
            } else { // if filter dropdown is visible
                $('#sort-dropdown').slideUp(); //remove filter dropdown
                sortVisible = false;  // update filter dropdown state
            }
        });

        $('.filter-list-items').click(function () {
            let filterListItem = this;
            let filterValue = filterListItem.id;
            countries = fullCountryData;
            
            if (searching === true) {
                countries = searchCountry(searchValue, countries);
            } 
            
            countries = filterCountry(filterValue, countries);
            sortCountry(sortValue, countries);
            $('#filter-dropdown').slideUp(); //remove filter dropdown
            filterVisible = false; // update filter dropdown state
            setTimeout(() => {
                appendCard(countries);
            }, 1000);
            // console.log(filterValue);
        })

        $('#search').on('propertychange input', function (e) {
            var valueChanged = false;
        
            if (e.type=='propertychange') {
                valueChanged = e.originalEvent.propertyName=='value';
            } else {
                valueChanged = true;
            }
            if (valueChanged) {
                /* Code goes here */
                // console.log('searching');
                searchValue = $('#search').val();
                searchValue = searchValue.toLowerCase();
                searchValue = searchValue.charAt(0).toUpperCase() + searchValue.slice(1);
                console.log(searchValue);
                countries = fullCountryData;
                countries = searchCountry(searchValue, countries);
                sortCountry(sortValue, countries);
                setTimeout(() => {
                    appendCard(countries);
                }, 1000);
            }
        });

        $('.sort-list-items').click(function () {
            let sortListItem = this;
            let sortValue = sortListItem.id;
            sortCountry(sortValue, countries);
            $('#sort-dropdown').slideUp(); //remove sort dropdown
            sortVisible = false; // update sort dropdown state
            setTimeout(() => {
                appendCard(countries);
            }, 1000);
            // console.log('running');
            // console.log({sortListItem});
        })

        $(".scroll-up").click(function(){
            scrollToTop();
        });
        // console.log(str2);

        // console.log(selectCountryNameFromCode('NGA', fullCountryData))

        
    }
});

var lastScrollTop = 0;
// function to remove scroll-up button when scrolling down and replace it back when scrolling up 
window.addEventListener("scroll", function(){
    if (viewCountry === false) {
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop){ // when scrolling down
            document.querySelector('.scroll-up').style.display = 'none';
        } else { // when scrolling up
            document.querySelector('.scroll-up').style.display = 'block';
        }
        //if st is less than or equal to 0, let lastScrollTop be equal to 0, else let it be equal to st
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    } else {
        document.querySelector('.scroll-up').style.display = 'none';
    }
}, false);

function selectCountryByCode(code, countriesArray) {

    selectedCountry = countriesArray.filter(
        (country) => country.cca3 === code
    );

    console.log(selectedCountry)
    return selectedCountry;

}

function selectCountryNameFromCode(code, countriesArray) {
    let countryName;
    let countryByCode = countriesArray.filter(
        (country) => country.cca3 === code
    );

    countryName = countryByCode[0].name.common;
    return countryName;

}

function clickCard(code) {
    // console.log('running');
    // console.log("🚀 ~ file: main.js ~ line 144 ~ code", code)
    selectedCountry = selectCountryByCode(code, countries);
    changeView('country', selectedCountry)
}

function appendCountry(country) {
    console.log("🚀 ~ file: main.js ~ line 282 ~ appendCountry ~ country", country)
    
    let countryFlag = country[0].flags.svg; // country flag
    let countryName = country[0].name.common; // country name
    let countryPopulation = country[0].population; // country population
    countryPopulation = stringifyPopulation(countryPopulation);
    let countryRegion = country[0].region; // couintry region
    let countrySubregion = country[0].subregion; // couintry subregion
    let countryCapital; // country capital
    let countryTld = country[0].tld[0]; // couintry top level domain

    let countryNativeName; // country native name
    let nativeNameLanguage = Object.keys(country[0].name.nativeName);
    for (let index = 0; index < nativeNameLanguage.length; index++) {
        if (index === 0) {
            countryNativeName = ''+country[0].name.nativeName[nativeNameLanguage[index]].common;
        } else {
            countryNativeName += ', '+country[0].name.nativeName[nativeNameLanguage[index]].common;
        }
    }

    let countryCurrency; // currency currency
    let currienciesList = Object.keys(country[0].currencies);
    for (let index = 0; index < currienciesList.length; index++) {
        if (index === 0) {
            countryCurrency = ''+country[0].currencies[currienciesList[index]].name;
        } else {
            countryCurrency += ', '+country[0].currencies[currienciesList[index]].name;
        }
    }

    let countryLanguages; // currency currency
    let languageList = Object.keys(country[0].languages);
    for (let index = 0; index < languageList.length; index++) {
        if (index === 0) {
            countryLanguages = ''+country[0].languages[languageList[index]];
        } else {
            countryLanguages += ', '+country[0].languages[languageList[index]];
        }
    }
    // console.log("🚀 ~ file: main.js ~ line 216 ~ appendCountry ~ countryLanguages", countryLanguages)

    // checking if country has a capital
    if (country[0].capital) { // if country has capital
        countryCapital = country[0].capital; // equate countryCapital variable top the capital in the JSON array    
    } else {
        countryCapital = 'N/A'; // if capital is unavaliable, equate to N/A
    }

    let countryBorders = '';
    // checking if country has a boarder country
    if (country[0].borders) { // if country has border COUNTRIES
        let borderList = country[0].borders;
        let borderCountryName;
        countries = fullCountryData;
        for (let index = 0; index < borderList.length; index++) {
            borderCountryName = selectCountryNameFromCode(borderList[index], countries);
            countryBorders += `<button type="button" onclick="clickCard('${borderList[index]}')">${borderCountryName}</button>`;
        }
    } else {
        countryCapital = 'N/A'; // if capital is unavaliable, equate to N/A
    }




    let countryDetails = $('.country-details-wrapper');
    let countryElement = `<div class="country-flag-wrapper">
        <img src="${countryFlag}" alt="country flag" class="country-flag">
    </div>
    <div class="country-info-wrapper">
        <h3>${countryName}</h3>
        <div class="details-wrapper">
            <section>
                <div><h4>Native Name:</h4><span>
                    ${countryNativeName}
                </span> </div>
                <div><h4>Population:</h4><span>${countryPopulation}</span> </div>
                <div><h4>Region:</h4><span>${countryRegion}</span> </div>
                <div><h4>Sub Region:</h4><span>${countrySubregion}</span> </div>
                <div><h4>Capital:</h4><span>${countryCapital}</span> </div>
            </section>
            <section>
                <div><h4>Top Level Domain:</h4><span>${countryTld}</span> </div>
                <div><h4>Curriencies:</h4><span>${countryCurrency}</span> </div>
                <div><h4>Language:</h4><span>${countryLanguages}</span> </div>
            </section>
        </div>
        <section class="border-section">
            <h4 class="border-heading">Border Countires</h4>
            <div class="border-countries-wrapper">
                ${countryBorders}
            </div>
        </section>
    </div>`;
    $('.country-flag-wrapper').remove();
    $('.country-info-wrapper').remove();
    countryDetails.append(countryElement);
}

function changeView(type, country) {
    if (type === 'country') {
        $('.card').remove();
        $('form').css('display', 'none');
        $('.country').css('display', 'flex');
        viewCountry = true;
        appendCountry(country);
    } else {
        $('form').css('display', 'flex');
        $('.country').css('display', 'none');
        countries = country;
        countries = searchCountry(searchValue, countries);
        countries = filterCountry(filterValue, countries);
        sortCountry(sortValue, countries);
        viewCountry = false;
        appendCard(countries);
    }
}

$("#back-button").click(function(){
    changeView('card', fullCountryData);
});

function stringifyPopulation(num) {
    
    num = num.toString();
    let firstCommaPosition = 3;
    let secondCommaPosition = 6;
    let thirdCommaPosition = 9;
    let populationStringLength = num.length;
    if (populationStringLength <= 3) {
        // continue;                    
    } else if (populationStringLength <= 6) {

        var b = ",";
        var position = populationStringLength - firstCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        return num;
        
    } else if (populationStringLength <= 9) {
        var b = ",";
        
        var position = populationStringLength - firstCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        
        position = populationStringLength - secondCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        return num;
        
    } else if (populationStringLength <= 12) {
        
        var b = ",";
        var position = populationStringLength - firstCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        
        position = populationStringLength - secondCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        
        position = populationStringLength - thirdCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        return num;
        
        
    }
}

function appendCard(countryArray) {
    $('.card').remove()            
    // loop through countires array
    countryArray.forEach(country => {
        let countryCode = country.cca3; // country code
        let countryFlag = country.flags.svg; // country flag
        let countryName = country.name.common; // country name
        let countryPopulation = country.population; // country population
        let countryRegion = country.region; // couintry region
        
        let countryCapital; // country capital
        // checking if country has a capital
        if (country.capital) { // if country has capital
            countryCapital = country.capital[0]; // equate countryCapital variable top the capital in the JSON array    
        } else {
            countryCapital = 'N/A'; // if capital is unavaliable, equate to N/A
        }

        // if (country.name.common == 'Belgium') {
        //     console.log("🚀 ~ file: main.js ~ line 158 ~ appendCard ~ country", country);
        //     console.log("🚀 ~ file: main.js ~ line 158 ~ appendCard ~ country", country.currencies[Object.keys(country.currencies)].name);
            
        //     let test = country.name;
        //     console.log("🚀 ~ file: main.js ~ line 158 ~ appendCard ~ country", test.nativeName[Object.keys(test.nativeName)[0]].common);
        // }



        countryPopulation = stringifyPopulation(countryPopulation);

        // card element
        card = `<div class="card" id="${countryCode}" onclick="clickCard('${countryCode}')">
            <div class="img-wrapper">
                <img src="${countryFlag}" alt="flag" loading="lazy">
            </div>
            <div class="text-wrapper">
                <h3>${countryName}</h3>
                <section>
                    <div><h4>Population:</h4><span>${countryPopulation}</span> </div>
                    <div><h4>Region:</h4><span>${countryRegion}</span> </div>
                    <div><h4>Capital:</h4><span>${countryCapital}</span> </div>
                </section>
            </div>
        </div>`;
        // append card to main tag
        main.append(card);
    });
}

function sortCountry(value, countriesArray) {
    if (value === 'nameASC') {
        countriesArray.sort((a, b) => {
            if (a.name.common < b.name.common) return -1;
            return 1;
        });

    } else if (value === 'nameDESC') {
        countriesArray.sort((a, b) => {
            if (a.name.common > b.name.common) return -1;
            return 1;
        });

    } else if (value === 'populationASC') {
        countriesArray.sort((a, b) => a.population - b.population);

    } else if (value === 'populationDESC') {
        countriesArray.sort((a, b) => b.population - a.population);
        
    } else {
        return;
    }
}

function filterCountry(value, countriesArray) {
    if (value !== 'All') {
        let filteredCountries = countriesArray.filter(
            (country) => country.region == value
        );

        // console.log(filteredCountries);
        return filteredCountries;

    } else {
        return countriesArray;
    }
}

function searchCountry(value, countriesArray) {
    if (value !== '') {
        let searchedCountries = countriesArray.filter(
            (country) => country.name.common.startsWith(value)
        );

        // console.log(searchedCountries);
        searching = true;
        return searchedCountries;

    } else {
        searching = false;
        return countriesArray;
    }
}

function scrollToTop() {
    // $('nav').scrollIntoView({behavior: "smooth", block: "start"});
    document.querySelector('nav').scrollIntoView({behavior: "smooth", block: "start"});
}

let theme = 'darkMode'
function switchTheme() {
    console.log('Theme Sitching')
    let themeButton = $('#theme-switcher');
    themeButton.empty()
    if (theme === 'darkMode') {
        theme = 'lightMode';
        let content = `<ion-icon name="moon"></ion-icon>Dark Mode`;
        themeButton.append(content);
    } else {
        theme = 'darkMode';
        let content = `<ion-icon name="sunny"></ion-icon>Light Mode`;
        themeButton.append(content);
    }

    background = myFunction_get(`${theme}Background`);
    myFunction_set('background', background);

    elements = myFunction_get(`${theme}Elements`);
    myFunction_set('elements', elements);
    
    inputs = myFunction_get(`${theme}Inputs`);
    myFunction_set('inputs', inputs);
    
    text = myFunction_get(`${theme}Text`);
    myFunction_set('text', text);

    hover = myFunction_get(`${theme}Hover`);
    myFunction_set('hover', hover);
}

// Get the root element
var r = document.querySelector(':root');
let background;
let elements;
let inputs;
let text;
let hover;

// Create a function for getting a variable value
function myFunction_get(variableName) {
  // Get the styles (properties and values) for the root
  var rs = getComputedStyle(r);
  let variableValue = rs.getPropertyValue(`--${variableName}`);
  return variableValue;
}

// Create a function for setting a variable value
function myFunction_set(variableName, variableValue) {
  // Set the value of variable --blue to another value (in this case "lightblue")
  r.style.setProperty(`--${variableName}`, variableValue);
}