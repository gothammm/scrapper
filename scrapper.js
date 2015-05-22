var request = require('request');
var cheerio = require('cheerio');
var baseUrl = require('./config.json').url;
var totalPages,
 collegeData = [],
 currentPage = 1;

/**
 * @name requestNextpage
 * @param pageNumber, page number you want to scrap
 * @description scrapes data from the html DOM
 */
function requestNextpage(pageNumber) {
  console.log('Scrapping page number: ' + currentPage);
  var currentUrl = pageNumber > 1 ?  baseUrl + '/page+' + pageNumber : baseUrl;
  console.log('Scrapping page - ' + currentUrl);
  request(currentUrl, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      if(pageNumber === 1) {
        var paginationBar = $('#pagination');
        totalPages = paginationBar.find('a').last().prev().text();
      }
      scrapeIt($);
    }
  });
}

/**
 * @name scrapeIt
 * @param $, the cheerio selector loaded with scrapped html
 * @description scrapes data from the html DOM
 */
function scrapeIt($) {
  var dataRows = $('.ranking-data tbody tr');
  dataRows.each(function(i, element) {
    var tr = $(this);
    var collegeName = tr.find('.school-name');
    var tuitionFee = tr.find('.search_tuition_display');
    collegeData.push({
      collegeName: collegeName.text().trim(),
      fees: tuitionFee.text().trim()
    });
  });
  currentPage += 1;
  if(currentPage > totalPages) {
    finalData();
  } else {
    requestNextpage(currentPage);
  }
}

/**
 * @name finalData
 * @description finally called after scrapping data.
 */
function finalData() {
  console.log('-------- Scrapping complete --------');
  console.log('Total colleges scrapper - ' + collegeData.length);
}

//Start the scrapper
requestNextpage(currentPage);
