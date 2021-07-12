import 'eclipsefdn-solstice-assets'
import './src/projects'

(function($, document) {
  // Eclipse News and events
  $("#news-list-container").eclipseFdnApi({
    type: "newsItems"
  });
  $("#event-list-container").eclipseFdnApi({
    type: "filteredEvents"
  });
})(jQuery, document);