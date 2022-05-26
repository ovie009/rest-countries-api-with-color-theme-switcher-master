$(document).ready(function () {
    const request = new XMLHttpRequest();
    let fullCountryData;
    let countries; // variable to store countries
    let card; // variable to store card element
    let main = $('main'); // main tag varaible
    let loadSuccess = false; // variable to store the load status of API
    let filterVisible = false; // variable to store visibility state of filter dropdown
    let sortVisible = false; // variable to store visibility state of sort dropdown
    let sortValue = 'nameASC';
    let filterValue = 'All';
    // console.log(main);
    request.open("GET", "https://restcountries.com/v3.1/all"); //open API request
    request.send(); // send API request
    request.onload = () =>{ // checking if the request data has loaded
        if (request.status === 200) { // if status of request is successful i.e === 200
            loadSuccess = true; // set loadSuccess variable equal to true
            fullCountryData = JSON.parse(request.response); // equate countries varaible to JSON data
            countries = JSON.parse(request.response); // equate countries varaible to JSON data
            
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
            let filterValue = filterListItem.innerText;
            countries = fullCountryData;
            countries = filterCountry(filterValue, countries);
            sortCountry(sortValue, countries);
            appendCard(countries);
            $('#filter-dropdown').slideUp(); //remove filter dropdown
            filterVisible = false; // update filter dropdown state
            console.log(filterValue);
        })

        function appendCard(countryArray) {
            $('.card').remove()            
            // loop through countires array
            countryArray.forEach(country => {
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
                // card element
                card = `<div class="card">
                    <div class="img-wrapper">
                        <img src="${countryFlag}" alt="flag">
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

                console.log(filteredCountries)
                return filteredCountries;

            } else {
                return countriesArray;
            }
        }
    }
});