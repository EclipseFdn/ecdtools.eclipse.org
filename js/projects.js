/*!
 * community.js by Christopher Guindon - @chrisguindon
 * Copyright 2013 Eclipse Foundation
 * projects.js by Yi Liu - @yiliu
 * Copyright 2020 Eclipse Foundation
 * http://www.eclipse.org/org/documents/epl-v10.php
 */

 // Polyfill for IE11
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw TypeError('"this" is null or not defined');
        }
  
        var o = Object(this);
  
        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;
  
        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw TypeError('predicate must be a function');
        }
  
        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];
  
        // 5. Let k be 0.
        var k = 0;
  
        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }
  
        // 7. Return undefined.
        return undefined;
      },
      configurable: true,
      writable: true
    });
  }
 
(function($, window, document) {
    $(function() {

        $.ajax({
            type: "GET",
            url: "/js/projects.json",
            dataType: "json",
            cache: true,
            success: function(data) {

                var projectInfos = [];

                var val = 20;
                $('.progress-bar').css('width', val + '%').attr('aria-valuenow', val);

                var i = 0;

                $.each(data, function(key, value) {
                    
                    if (value.state === "Archived") {
                      return true;
                    }
                  
                    i++;
                    var val = 20 + (i / Object.keys(data).length) * 80;

                    $('.progress-bar').css('width', val + '%').attr('aria-valuenow', val);
                    var title = stringJanitor(value.name);
                    var id = stringJanitor(value.project_id);
                    var link = value.url;
                    if (!validateUrl(link)) {
                        link = "http://projects.eclipse.org/projects/" + id;
                    }
                    var desc = stringJanitor(value.summary, {
                        "cut": true,
                        "ellipsis": ' [&hellip;] <br><a href="' + link + '"> Read more&hellip;</a>'
                    });

                    projectInfo = {};
                    projectInfo.link = value.url;
                    if (!validateUrl(projectInfo.link)) {
                        projectInfo.link = "http://projects.eclipse.org/projects/" + id;
                    }
                    projectInfo.logo = value.logo || '//fakeimg.pl/400x200/f5f5f5/000/?text=' + title //; || 'https://placeholdit.imgix.net/~text?txtsize=42&txt=' + title + '&w=200&h=80&bg=f5f5f5&txtclr=000000' ; //|| 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
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

                    projectInfos.push(projectInfo);

                    i++;
                });

                var options = {
                    item: '<li class="col-md-24"><div class="media">\
                              <div class="row"><div class="col-sm-4">\
                                <a href="#" class="link">\
                                  <img class="media-object img-responsive logo logo_alt center-block" alt="project">\
                                </a>\
                              </div>\
                              <div class="col-sm-20">\
                                 <h4 class="media-heading name"> </h4><span class="labels"></span>\
                                   <div class="row">\
                                    <p class="fullDescription" style="display:none;"></p>\
                                    <p class="description col-md-16"></p>\
                                    <div class="col-md-8 details"><div class="row">\
                                        <p class="downloads" style="display:none;"></p>\
                                        <div class="col-md-24"><p>Latest release: <span class="badge version">1.4</span></p></div>\
                                        <div class="col-md-24 margin-bottom-10"><p>Project status: <span class="badge project_state">Incubating</span></p></div>\
                                        <div class="col-md-24"><p><a class="btn btn-sm btn-primary downloadUrl" href="#">Get Started</a></p></div>\
                                    </div></div>\
                                </div>\
                              </div></div>\
                            </div><hr></li>',
                    valueNames: ['name', 'description', 'fullDescription', {
                            name: 'logo',
                            attr: 'src'
                        }, 'version', {
                            name: 'link',
                            attr: 'href'
                        }, {
                            name: 'downloadUrl', attr:'href',
                        }, {
                          name: 'logo_alt', attr: 'alt'
                        },
                        'labels', 'project_state'
                    ]
                };

                var ecd_cft = projectInfos.find(el => el.id === "ecd.cft");
                var ecd_orion = projectInfos.find(el => el.id === "ecd.orion");
                projectInfos.push(projectInfos.splice(projectInfos.indexOf(ecd_cft), 1)[0]);
                projectInfos.push(projectInfos.splice(projectInfos.indexOf(ecd_orion), 1)[0]);
                
                var list = new List('project-list', options, projectInfos);

                for (var i in list.visibleItems) {
                    var elem = list.visibleItems[i].elm;
                    var logoElem = $("img.logo", elem);

                    if (logoElem.attr('src').includes('fakeimg')) {
                        logoElem.addClass('has-placeholder-logo');
                    }
                }

                $("#update-project").empty();
                $("#update-project").removeClass("loading");

                $('.btn-filter-project').on('click', function() { setTimeout(function() {
                    list.filter();
                    // list.filter(computeFilterFunction());
                    }, 10) ; });

            },
        });

    });

    // Validate URL.
    var validateUrl = function validateUrl(str) {
        return (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i).test(str);
    };

    // Remove html, add ellipsis and cut strings.
    var stringJanitor = function(str, options) {
        var settings = $.extend({
            // These are the defaults.
            start: 0,
            end: 250,
            html: false,
            ellipsis: "",
            cut: false,
        }, options);
        var text = "";
        // Remove HTML.
        if (!settings.html) {
            text = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/g, "");
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

}(window.jQuery, window, document));
// The global jQuery object is passed as a parameter