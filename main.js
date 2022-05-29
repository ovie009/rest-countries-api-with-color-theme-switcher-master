let countries; // variable to store countries
let selectedCountry;  // variable to store the selected country being displayed
let fullCountryData;
let card; // variable to store card element
let main = $('main'); // main tag varaible
let loadSuccess = false; // variable to store the load status of API
let filterVisible = false; // variable to store visibility state of filter dropdown
let sortVisible = false; // variable to store visibility state of sort dropdown
let sortValue = 'nameASC'; // default sort value
let filterValue = 'All'; // default filter value
let searchValue = ''; // default search value
let searching = false; // value to detect if user ios currently searching
let viewCountry = false; // // value to detect if user has clicked to view on a country
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

        // if any of the items in the filter dropdown is clicked
        $('.filter-list-items').click(function () {
            let filterListItem = this; // select the element that was clicked
            let filterValue = filterListItem.id; // select its id
            // the id is equall to the regions in the country array
            countries = fullCountryData; // reset country value
            
            // if searching is true
            if (searching === true) {
                // let countries varable be equall to 
                // the searched resuilt and not full country data
                countries = searchCountry(searchValue, countries);
            } 
            
            // now filter the provided list of countires
            countries = filterCountry(filterValue, countries);
            // sort the filtered result according to the preselected sortValue
            sortCountry(sortValue, countries);
            $('#filter-dropdown').slideUp(); //remove filter dropdown
            filterVisible = false; // update filter dropdown state
            setTimeout(() => {
                // appedn countries
                appendCard(countries);
            }, 1000);
        })

        //  oninput in search input field, run this function
        $('#search').on('propertychange input', function (e) {
            // variable to detect change in value
            var valueChanged = false;
        
            // if value is unchanged
            if (e.type=='propertychange') {
                valueChanged = e.originalEvent.propertyName=='value';
            } else { // if value is changed
                //  set valueChanged as true
                valueChanged = true;
            }

            // run block opf code if valueChanged is true
            if (valueChanged) {
                /* Code goes here */
                // select the value in the search field
                searchValue = $('#search').val();
                // convert the inputed string to lower case
                searchValue = searchValue.toLowerCase();
                // convert the input string to capitalize 
                // i.e only first letter is in uppercase
                searchValue = searchValue.charAt(0).toUpperCase() + searchValue.slice(1);
                // console log search value
                console.log(searchValue);
                // resetting country data, so the search is performed in the full data
                countries = fullCountryData;
                // search countries
                countries = searchCountry(searchValue, countries);
                sortCountry(sortValue, countries);
                // wait 1 second and append search result
                setTimeout(() => {
                    // append country as a card
                    appendCard(countries);
                }, 1000);
            }
        });

        // if any of the sort list items is clicked
        $('.sort-list-items').click(function () {
            let sortListItem = this; // select clicked element
            let sortValue = sortListItem.id; // selct element id
            // where id is equal to the sort value
            sortCountry(sortValue, countries); // sort countries
            $('#sort-dropdown').slideUp(); //remove sort dropdown
            sortVisible = false; // update sort dropdown state
            // append card of sorted countries after 1 second
            setTimeout(() => {
                appendCard(countries);
            }, 1000);
            // console.log('running');
            // console.log({sortListItem});
        })

        // if scroll up button is clicked
        $(".scroll-up").click(function(){
            // run function scroll to top
            scrollToTop();
        });
    }
});

// function to remove scroll-up button when scrolling down and replace it back when scrolling up 
var lastScrollTop = 0; // variable to store scroll height
window.addEventListener("scroll", function(){
    // if selected country page is not in view, proceed with the function
    if (viewCountry === false) {
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop){ // when scrolling down
            document.querySelector('.scroll-up').style.display = 'none';
        } else { // when scrolling up
            document.querySelector('.scroll-up').style.display = 'block';
        }
        //if st is less than or equal to 0, let lastScrollTop be equal to 0, else let it be equal to st
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

    } else { // if selected country page is in view, dont display the button
        document.querySelector('.scroll-up').style.display = 'none';
    }
}, false);

// select country be cca3 code (a unique code for each country)
function selectCountryByCode(code, countriesArray) {

    // filter country according to code passed into the function
    selectedCountry = countriesArray.filter(
        (country) => country.cca3 === code
    );

    // console selected country data
    console.log(selectedCountry)
    // return the selected country
    return selectedCountry;

}

// function to select country name with country code
function selectCountryNameFromCode(code, countriesArray) {
    // country name
    let countryName;
    // filter country according to country code
    // a single country data should be returned
    let countryByCode = countriesArray.filter(
        (country) => country.cca3 === code
    );

    // assign country name value
    countryName = countryByCode[0].name.common;
    // return country name
    return countryName;

}

// if a card is clicked
function clickCard(code) {
    // console.log("🚀 ~ file: main.js ~ line 144 ~ code", code)
    // select country by the code passed into the function
    selectedCountry = selectCountryByCode(code, countries);
    changeView('country', selectedCountry)
}

// function to append country details if country is selected
function appendCountry(country) {
    console.log("🚀 ~ file: main.js ~ line 282 ~ appendCountry ~ country", country)
    
    let countryFlag = country[0].flags.svg; // country flag
    let countryName = country[0].name.common; // country name
    let countryPopulation = country[0].population; // country population
    // convert population to string and insert commas after every 3 digits from behind
    countryPopulation = stringifyPopulation(countryPopulation); 
    let countryRegion = country[0].region; // couintry region
    let countrySubregion = country[0].subregion; // couintry subregion
    let countryCapital; // country capital
    let countryTld = country[0].tld[0]; // couintry top level domain

    let countryNativeName; // country native name

    // block of code to select county native name, because some countries have multiple native names
    let nativeNameLanguage = Object.keys(country[0].name.nativeName);
    for (let index = 0; index < nativeNameLanguage.length; index++) {
        if (index === 0) {
            countryNativeName = ''+country[0].name.nativeName[nativeNameLanguage[index]].common;
        } else {
            countryNativeName += ', '+country[0].name.nativeName[nativeNameLanguage[index]].common;
        }
    }

    let countryCurrency; // currency currency

    // block of code to select county currency, because some countries have multiple currencies
    let currienciesList = Object.keys(country[0].currencies);
    for (let index = 0; index < currienciesList.length; index++) {
        if (index === 0) {
            countryCurrency = ''+country[0].currencies[currienciesList[index]].name;
        } else {
            countryCurrency += ', '+country[0].currencies[currienciesList[index]].name;
        }
    }

    let countryLanguages; // currency currency

    // block of code to select county language, because some countries have multiple languages
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

    let countryBorders = ''; // border countries
    // checking if country has a boarder country
    if (country[0].borders) { // if country has border COUNTRIES
        let borderList = country[0].borders;
        let borderCountryName;
        countries = fullCountryData;
        for (let index = 0; index < borderList.length; index++) {
            borderCountryName = selectCountryNameFromCode(borderList[index], countries);
            countryBorders += `<button class="border-buttons" type="button" onclick="clickCard('${borderList[index]}')">${borderCountryName}</button>`;
        }
    } else { // if copuntry has no border
        countryBorders = '<span>N/A</span>'; // if capital is unavaliable, equate to N/A
    }

    // country details element
    let countryDetails = $('.country-details-wrapper');
    // country element
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
    // remove any present country details
    $('.country-flag-wrapper').remove();
    $('.country-info-wrapper').remove();
    // add new country details
    countryDetails.append(countryElement);
}

// fnction to change view between single country and list of countries
// displayed in a row/columns of cards
function changeView(type, country) {
    // if type is equal to country i.e country is selected
    if (type === 'country') {
        // remove cards
        $('.card').remove();
        // hide filter and sort forms
        $('form').css('display', 'none');
        // show country section
        $('.country').css('display', 'flex');
        // append country content
        appendCountry(country);
        // set viewCountry variable to true
        viewCountry = true;
    } else {
        // hide form
        $('form').css('display', 'flex');
        // show form
        $('.country').css('display', 'none');
        // equate country variable to country value passed into the fuinction
        countries = country;
        // search country, if search input field has a data
        countries = searchCountry(searchValue, countries);
        // filter the corresponding country result
        countries = filterCountry(filterValue, countries);
        // sort the corresponding country result
        sortCountry(sortValue, countries);
        // append card
        appendCard(countries);
        // set viewCountry variable to false
        viewCountry = false;
    }
}

// if back button is clicked
$("#back-button").click(function(){
    // run changeView function
    changeView('card', fullCountryData);
});

// function to convert population figure to string
// with commas after every 3 digits from behind
function stringifyPopulation(num) {
    // first convert number to string
    num = num.toString();
    let firstCommaPosition = 3; // first comma position
    let secondCommaPosition = 6; // second comma position
    let thirdCommaPosition = 9; // third comma position
    let populationStringLength = num.length; // get length of string
    let b = ","; // comma to be inserted in string
    if (populationStringLength <= 3) { // if number is less than 1000
        console.log('less than a thousand'); // do nothing significant
        // return the number as string
        return num;
    } else if (populationStringLength <= 6) { // if number is less than 1,000,000
        // insert comman after 3 digit from behind
        var position = populationStringLength - firstCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        // return number as string with one comma
        return num;
        
    } else if (populationStringLength <= 9) { // if number is less than 1,000,000,000
        
        // insert comman after 3 digit from behind
        var position = populationStringLength - firstCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        
        // insert comman after 6 digit from behind
        position = populationStringLength - secondCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        // return number as string with two commas
        return num;
        
    } else if (populationStringLength <= 12) { // if number is less than 1,000,000,000,000
        
        // insert comman after 3 digit from behind
        var position = populationStringLength - firstCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        
        // insert comman after 6 digit from behind
        position = populationStringLength - secondCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        
        // insert comman after 9 digit from behind
        position = populationStringLength - thirdCommaPosition;
        num = [num.slice(0, position), b, num.slice(position)].join('');
        // return number as string with three commas
        return num;
        
        
    }
}

// function to append country cards
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

// function to sort country, require sortvalue and countries array
function sortCountry(value, countriesArray) {
    
    if (value === 'nameASC') { // sort according to ascending order of names
        countriesArray.sort((a, b) => {
            if (a.name.common < b.name.common) return -1;
            return 1;
        });

    } else if (value === 'nameDESC') { // sort according to descending order of names
        countriesArray.sort((a, b) => {
            if (a.name.common > b.name.common) return -1;
            return 1;
        });

    } else if (value === 'populationASC') { // sort according to ascending order of population
        countriesArray.sort((a, b) => a.population - b.population);

    } else if (value === 'populationDESC') { // sort according to descending order of names
        countriesArray.sort((a, b) => b.population - a.population);
        
    } else { //else return
        return;
    }
}

// function to filter country, require filter value and countries array
function filterCountry(value, countriesArray) {
    // if value is not equal to 'All'
    if (value !== 'All') {
        // filter country according to the filter value received
        let filteredCountries = countriesArray.filter(
            (country) => country.region == value
        );

        // return the filtered array
        return filteredCountries;

    } else { // if value is equal to 'All', do not filter
        // return country value like it is.
        return countriesArray;
    }
}

// sfunction to search country
function searchCountry(value, countriesArray) {
    // if search field is not empty
    if (value !== '') {
        // filter country array according to search input
        let searchedCountries = countriesArray.filter(
            (country) => country.name.common.startsWith(value)
        );

        // set searching variable as true
        // this variable would be used to control to filtered result
        // whether to filter whole country data or searched country data 
        searching = true;

        // return searched country
        return searchedCountries;

    } else { // else do not search
        // searching is equal to false
        searching = false;
        // return country array
        return countriesArray;
    }
}

// function to scroll to top
function scrollToTop() {
    // scroll to nav
    document.querySelector('nav').scrollIntoView({behavior: "smooth", block: "start"});
}

// let themme be equall to dark mode by default
let theme;
function switchTheme() {
    // console.log('Theme Sitching')
    // select theme buttons
    let themeButton = $('#theme-switcher');
    theme = getCookie('theme');
    // remove children elements in theme button
    themeButton.empty()
    if (theme === 'darkMode') { // if its currently on dark mode
        theme = 'lightMode'; // set theme controller variable as 'lightMode'
        // content to be added to theme button
        let content = `<ion-icon name="moon"></ion-icon>Dark Mode`;
        // append content to theme button
        themeButton.append(content);
    } else {
        theme = 'darkMode'; // set theme controller variable as 'darkMode'
        // content to be added to theme button
        let content = `<ion-icon name="sunny"></ion-icon>Light Mode`;
        // append content to theme button
        themeButton.append(content);
    }
    
    setThemeColors(theme);
    setCookie('theme', theme, 30);
    
    console.log(getCookie('theme'));
}

function setThemeColors(theme) {
    // select background color of desired theme
    background = myFunction_get(`${theme}Background`);
    // set background color of the page
    myFunction_set('background', background);
    
    // select element backgound color of desired theme
    elements = myFunction_get(`${theme}Elements`);
    // set element background color of the page
    myFunction_set('elements', elements);
    
    // select input backgound color of desired theme
    inputs = myFunction_get(`${theme}Inputs`);
    // set input background color of the page
    myFunction_set('inputs', inputs);
    
    // select text color of desired theme
    text = myFunction_get(`${theme}Text`);
    // set text color of the page
    myFunction_set('text', text);
    
    // select hover background color of desired theme
    hover = myFunction_get(`${theme}Hover`);
    // set hover background color of the page
    myFunction_set('hover', hover);
}

// Get the root element
var r = document.querySelector(':root'); // css root variable
let background; // css body background color varaible
let elements; // css elements background color varaible
let inputs; // css inputs background color varaible
let text; // css text color varaible
let hover; // css hover background color varaible for dropdowns

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

// function to setCookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// functionto get cookie
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

// functionto check cookie
function checkCookie() {
    let theme = getCookie("theme");
    if (theme == "") {
        theme = 'darkMode';
        console.log('running');
        setCookie('theme', theme, 30)
    }
    setThemeColors(theme);

    if (theme === 'lightMode') {
        // select theme buttons
        let themeButton = $('#theme-switcher');
        theme = getCookie('theme');
        // remove children elements in theme button
        themeButton.empty()
        // content to be added to theme button
        let content = `<ion-icon name="moon"></ion-icon>Dark Mode`;
        // append content to theme button
        themeButton.append(content);
    }
}

// check for cookies
checkCookie();