/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *  Martin Lowe <martin.lowe@eclipse-foundation.org>
 *   Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import jQuery from 'jquery';
import template from './templates/blog-item.mustache';
import dateFormat from 'dateformat';
import 'core-js/modules/es.string.pad-start';

const eclipseFdnRenderRSS = (function ($, document) {
  function fetchRSSFeed(name) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'GET',
        dataType: 'xml',
        async: true,
        url: name,
      })
        .done(function (data) {
          let items = data.querySelectorAll('item');
          if (items.length === 0) {
            items = data.querySelectorAll('entry');
          }

          const blogPosts = [];
          items.forEach((el) => {
            const item = {
              title: '',
              link: '',
              summary: '',
              date: '',
              id: '',
              author: '',
              formatDate: function () {
                return function () {
                  return dateFormat(
                    item.date,
                    'dddd, mmmm dS, yyyy - h:MM:ss TT'
                  );
                };
              },
            };

            if (el.querySelector('title')) {
              item.title = el.querySelector('title').textContent;
            }

            if (el.querySelector('link')) {
              item.link = el.querySelector('link').textContent;
              if (el.querySelector('link').getAttribute('href')) {
                item.link = el.querySelector('link').getAttribute('href');
              }
            }

            if (el.querySelector('pubDate')) {
              item.date = el.querySelector('pubDate').textContent;
            }

            if (el.querySelector('published')) {
              item.date = el.querySelector('published').textContent;
            }

            if (item.date) {
              let date = new Date(item.date);
              item.date = date.toISOString();
            }

            if (el.querySelector('author')) {
              item.author = el.querySelector('author').textContent;
            }

            if (el.querySelector('name')) {
              item.author = el.querySelector('name').textContent;
            }

            if (el.querySelector('id')) {
              item.id = el.querySelector('id').textContent;
            }
            if (el.querySelector('guid')) {
              item.id = el.querySelector('guid').textContent;
            }

            if (el.querySelector('description')) {
              item.summary = el.querySelector('description').textContent;
            }

            if (el.querySelector('summary')) {
              item.summary = el.querySelector('summary').textContent;
            }

            blogPosts.push(item);
          });

          resolve(blogPosts);
        })
        .fail(function () {
          reject();
        });
    });
  }

  $(document).ready(function () {
    $('.solstice-rss-blog-list').each(function (index, element) {
      // @todo create pagination
      const options = {
        limit: 9999,
        urls: '',
        ...$(element).data(),
      };
      var promises = [];
      let urls = options.urls.split(',');
      urls.forEach((element) => promises.push(fetchRSSFeed(element)));

      let results = [];
      console.log(options);
      Promise.allSettled(promises).then(function (responses) {
        responses.forEach((el) => {
          results = results.concat(el.value);
        });

        // remove duplicate on link prop
        results = [...new Map(results.map((v) => [v.link, v])).values()];
        // sort by date
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
        results = results.slice(0, options.limit);
        element.innerHTML = template({
          items: results,
        });
      });
    });
  });
})(jQuery, document);

export default eclipseFdnRenderRSS;
