/*!
 * community.js by Christopher Guindon - @chrisguindon
 * Copyright 2013 Eclipse Foundation
 * projects.js by Yi Liu - @yiliu
 * Copyright 2020 Eclipse Foundation
 * http://www.eclipse.org/org/documents/epl-v10.php
 */

import "numeral";
import List from 'list.js';

const EclipseProjectList = (function ($) {
  if ($('.eclipsefdn-project-list').length) {

    $.ajax({
      type: 'GET',
      url: '/js/projects.json',
      dataType: 'json',
      cache: true,
      success: function (data) {
        var projectInfos = [];

        var val = 20;
        $('.progress-bar')
        .css('width', val + '%')
        .attr('aria-valuenow', val);

        var i = 0;

        $.each(data, function (key, value) {
          if (value.state === 'Archived') {
              return true;
            }
          
            i++;
            var val = 20 + (i / Object.keys(data).length) * 80;

            $('.progress-bar')
              .css('width', val + '%')
              .attr('aria-valuenow', val);
            var title = stringJanitor(value.name);
            var id = stringJanitor(value.project_id);
            var link = value.url;
            if (!validateUrl(link)) {
              link = 'http://projects.eclipse.org/projects/' + id;
            }
            var desc = stringJanitor(value.summary, {
              cut: true,
              ellipsis:
                ' [&hellip;] <br><a href="' + link + '"> Read more&hellip;</a>',
            });

            var projectInfo = {};
            projectInfo.link = value.url;
            if (!validateUrl(projectInfo.link)) {
              projectInfo.link = 'http://projects.eclipse.org/projects/' + id;
            }
            projectInfo.logo =
              value.logo || '//fakeimg.pl/400x200/f5f5f5/000/?text=' + title; //; || 'https://placeholdit.imgix.net/~text?txtsize=42&txt=' + title + '&w=200&h=80&bg=f5f5f5&txtclr=000000' ; //|| 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            projectInfo.id = id;
            projectInfo.name = title;
            projectInfo.logo_alt = title;

            projectInfo.project_state = value.state;

            projectInfo.labels = '';

            projectInfo.description = desc;
            projectInfo.fullDescription = stringJanitor(value.summary);
            projectInfo.version = 'none';
            if (value.releases[0]) {
              projectInfo.version = value.releases[0].name;
            }
            
            projectInfo.downloadUrl = value.url;

            projectInfo.projectUrl = "";
            if (projectInfo.id === "ecd.openvsx") {
              projectInfo.projectUrl = '<a href="/projects/open-vsx">Project Page ></a>';
            }

            projectInfo.category = getCategory(id);

            projectInfo.release = title;
            projectInfo.status = title;

            projectInfos.push(projectInfo);

            i++;
        });

        var options = {
            item: '<li class="col-md-8 col-sm-12"><div class="featured-projects-item">\
                        <div class="featured-projects-item-category category labels"> </div>\
                        <div class="featured-projects-item-content match-height-item">\
                        <a href="#" class="link">\
                        <img class="featured-projects-item-img img-responsive logo logo_alt" alt="project">\
                        </a>\
                        <div class="featured-projects-item-text">\
                        <p class="featured-projects-item-heading name"> </p><span class="labels"></span>\
                        <p class="fullDescription" style="display:none;"></p>\
                        <p class="description"></p>\
                        <p><a class="downloadUrl" href="#">Get Started ></a></p>\
                        <span class="projectUrl"></span>\
                        </div>\
                        </div>\
                        <hr>\
                        <div class="details">\
                            <p class="downloads" style="display:none;"></p>\
                            <p>Latest release: <strong class="version"></strong></p>\
                            <p>Project status: <strong class="project_state"></strong></p>\
                        </div>\
                        </li>',
            valueNames: [
              'name', 
              'description', 
              'fullDescription', 
              'projectUrl',
              'status',
              'category', 
              {
                name: 'logo',
                attr: 'src',
              },
              'version', 
              {
                name: 'link',
                attr: 'href',
              }, 
              {
                name: 'downloadUrl', 
                attr: 'href',
              }, 
              {
                name: 'logo_alt', 
                attr: 'alt',
              },
              'labels', 
              'project_state',
            ],
        };

        var ecd_cft = projectInfos.find((el) => el.id === 'ecd.cft');
        var ecd_orion = projectInfos.find((el) => el.id === 'ecd.orion');
        projectInfos.push(
          projectInfos.splice(projectInfos.indexOf(ecd_cft), 1)[0]
        );
        projectInfos.push(
          projectInfos.splice(projectInfos.indexOf(ecd_orion), 1)[0]
        );
        
        var list = new List('project-list', options, projectInfos);

        for (var i in list.visibleItems) {
            var elem = list.visibleItems[i].elm;
            var logoElem = $('img.logo', elem);

            if (logoElem.attr('src').includes('fakeimg')) {
                logoElem.addClass('has-placeholder-logo');
            }
        }

        $('#update-project').empty();
        $('#update-project').removeClass('loading');

        // Filters
        let categories = getCategories();
        $.each( categories, function( key, value ) {
          let duplicate = $('.eclipsefdn-project-list-filters').find("button:contains('"+ value +"')");
          if (duplicate.length > 0) {
            return;
          }
          var button = document.createElement('button');
          button.innerHTML = value;
          button.className = 'btn btn-filter-project';
          button.setAttribute('data-toggle','button');
          $('.eclipsefdn-project-list-filters').append(button);
        });

        $('.btn-filter-project').on('click', function (elem) {
          $('.btn-filter-project').not(this).each(function(){
            $(this).removeClass('active');
          });
          setTimeout(function () {
            list.filter(computeFilterFunction());
          }, 10);
        });


        

        // Making sure each projects have the same height using match-height
        $('.eclipsefdn-project-list').trigger('shown.ef.news');
      }
    });
  }
  // Validate URL.
  var validateUrl = function validateUrl(str) {
    return /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(
      str
    );
  };

  var computeFilterFunction = function () {
    return function (item) {
      var filter = [];

      $('.btn-filter-project').each(function (index, elem) {
        if ($(elem).hasClass('active')) {
          filter.push($(elem).text());
        }
      });

      if (filter.length == 0) {
        return true;
      }

      var found = false;

      for (var i = 0; i < filter.length; i++) {
        var element = filter[i];       
        if (typeof item.values().category !== "undefined" && item.values().category.indexOf(element) !== -1) {
          found = true;
          continue;
        }
        found = false;
        break;
      }

      return found;
    };
  };

  // Remove html, add ellipsis and cut strings.
  var stringJanitor = function (str, options) {
    var settings = $.extend(
      {
        // These are the defaults.
        start: 0,
        end: 250,
        html: false,
        ellipsis: '',
        cut: false,
      },
      options
    );
    var text = '';
    // Remove HTML.
    if (!settings.html) {
      text = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/g, '');
    }

    // Shorten the string.
    if (settings.cut) {
      if (text.length < settings.end) {
        return text;
      } else {
        var cutat = text.lastIndexOf(' ', settings.end);
        if (cutat !== -1) {
          text = text.substring(settings.start, cutat) + settings.ellipsis;
        }
      }
    }
    return text;
  };

  var getCategories = function() {
    var categories = {
        "ecd.cdt.cloud": "Cloud IDE",
        "ecd.che": "Cloud IDE",
        "ecd.che.che4z": "Extension Marketplace",
        "ecd.codewind": "IDE-Agnostic Library",
        "ecd.dirigible": "Service (IDEAAS)",
        "ecd.emfcloud": "Cloud IDE",
        "ecd.glsp": "Diagram Editors",
        "ecd.jkube": "Cloud IDE",
        "ecd.openvsx": "Extension Marketplace",
        "ecd.sprotty": "Framework",
        "ecd.theia": "Cloud IDE",
        "ecd.cft": "Cloud IDE",
        "ecd.orion": "Extension Marketplace"
    };
    return categories;
  }

  var getCategory = function(project_id) {
    var categories = getCategories();
    if (typeof categories[project_id] !== "undefined") {
      return categories[project_id];
    }
    return "";
  }
})(jQuery);
// The global jQuery object is passed as a parameter

export default EclipseProjectList;
