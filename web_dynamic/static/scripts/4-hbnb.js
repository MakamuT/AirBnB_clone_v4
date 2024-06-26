$(document).ready(init);

const HOST = '0.0.0.0';
const selectedAmenities = {};

function init () {
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      selectedAmenities[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete selectedAmenities[$(this).attr('data-name')];
    }
    const amenityNames = Object.keys(selectedAmenities);
    $('.amenities h4').text(amenityNames.sort().join(', '));
  });

  apiStatus();
  searchPlacesAmenities();
}

function apiStatus () {
  const apiUrl = `http://${HOST}:5001/api/v1/status/`;
  $.get(apiUrl, (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}

function searchPlacesAmenities () {
  const placesUrl  = `http://${HOST}:5001/api/v1/places_search/`;
  $.ajax({
    url: placesUrl ,
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ amenities: Object.values(selectedAmenities) }),
    success: function (response) {
      $('SECTION.places').empty();
      for (const r of response) {
        const placeHTML = ['<article>',
          '<div class="title_box">',
        `<h2>${r.name}</h2>`,
        `<div class="price_by_night">$${r.price_by_night}</div>`,
        '</div>',
        '<div class="information">',
        `<div class="max_guest">${r.max_guest} Guest(s)</div>`,
        `<div class="number_rooms">${r.number_rooms} Bedroom(s)</div>`,
        `<div class="number_bathrooms">${r.number_bathrooms} Bathroom(s)</div>`,
        '</div>',
        '<div class="description">',
        `${r.description}`,
        '</div>',
        '</article>'];
        $('SECTION.places').append(article.join(''));
      }
    },
    error: function (error) {
      console.log(error);
    }
  });
}
