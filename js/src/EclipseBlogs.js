/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *   Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */

/*!
 * Copyright (c) 2020 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *  Martin Lowe <martin.lowe@eclipse-foundation.org>
 *  Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import jQuery from 'jquery';
import Q from 'q';
import template from './templates/blog-item.mustache';
import dateFormat from 'dateformat';

const eclipseFdnRenderRSS = (function ($, document) {
  function xmlPromise(name, id) {
    return Q.promise(function (resolve, reject, notify) {
      $.ajax({
        type: 'GET',
        dataType: 'xml',
        async: true,
        url: name,
      })
        .done(function (data) {
          const items = data.querySelectorAll(id);
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
                  return dateFormat(item.date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
                  //var date = new Date("2013-03-10T02:00:00Z");
                  //return date.toISOString().substring(0, 10);
                  //return item.date.substring(0, 10);
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

  function getData() {
    //your xml files can be stored in the promises variable
    var promises = [
      xmlPromise('/resources/blogs/index.xml', 'item'),
      xmlPromise('https://planeteclipse.org/planet/ecdtools.xml', 'entry'),
    ];

    let results = [];
    Q.allSettled(promises).then(function (responses) {
      responses.forEach((element) => {
        results = results.concat(element.value);
      });

      results.sort((a, b) => new Date(b.date) - new Date(a.date));

      const divArray = document.querySelectorAll('.solstice-rss-feed-test');

      // Use for loop instead of array.forEach or $().each to make sure
      // the following fetch won't be executed before the current one is done
      // so that the filter logic can work properly
      console.log(results);
      for (let index = 0; index < divArray.length; index++) {
        const element = divArray[index];
        element.innerHTML = template({
          items: results,
        });
      }
    });
  }
  getData();
})(jQuery, document);

export default eclipseFdnRenderRSS;
