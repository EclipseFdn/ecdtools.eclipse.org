/*!
 * Copyright (c) 2019 Eclipse Foundation, Inc.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 * 
 * Contributors:
 *   Eric Poirier <eric.poirier@eclipse-foundation.org>
 * 
 * SPDX-License-Identifier: EPL-2.0
*/

class EcdtoolsAdopters {
  precompiledRegex = /<([^>]*?)>;(\s?[\w-]*?="(?:\\"|[^"])*";){0,}\s?rel="next"/;
  // Default settings
  default_options = {
    project_id: '',
    selector: '.ecdtools-adopters',
    ul_classes: '',
    logo_white: false,
    working_group: '',
    src_root: 'https://api.eclipse.org/adopters',
    src_projects_prefix: '/projects'
  };

  getMergedOptions(options) {
    // Default settings copy
    var opts = JSON.parse(JSON.stringify(this.default_options));

    // Go through the parameters of Options if its defined and is an object
    if (typeof (options) !== 'undefined' && typeof (options) === 'object') {
      for (var optionName in this.default_options) {
        if (typeof (options[optionName]) === 'undefined' || (typeof (options[optionName]) !== 'string' && typeof (options[optionName]) !== 'boolean')) {
          continue;
        }
        opts[optionName] = options[optionName];
      }
    }
    return opts;
  }

  /**
   * Replace the adopters container
   * @public
   * @param {Object} options Videos attributes
   */

  getList = function(options) {
    var t = this;
    var opts = this.getMergedOptions(options);
    this.fireCall(opts, function(response) {
      t.createProjectList(response, opts, document.querySelectorAll(opts.selector));
      t.scrollToAnchor();
    });
  }

  /**
   * Replace the adopters container
   * @public
   * @param {Object} options Videos attributes
   */

  getWGList = function(options) {
    var t = this;
    var opts = this.getMergedOptions(options);
    // create callback on ready
    this.fireCall(opts, function(response) {
      t.createWGProjectsList(response, opts, document.querySelectorAll(opts.selector));
      t.scrollToAnchor();
    });
  }

  fireCall(opts, callback, currentData = []) {
    var t = this;
    var xhttp = new XMLHttpRequest();
    // create callback on ready
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // merge new data with current
        var json = JSON.parse(this.responseText);
        if (Array.isArray(currentData) || currentData.length) {
          json = currentData.concat(json);
        }

        // check the link header as long as its set
        var linkHeader = xhttp.getResponseHeader('Link');
        if (linkHeader !== null) {
          var match = linkHeader.match(t.precompiledRegex);
          // if there is no match, then there is no next and we are on the last page and should process data through callback
          if (match !== null) {
            opts.next = match[1];
            t.fireCall(opts, callback, json);
          } else {
            callback(json);
          }
        } else {
          callback(json);
        }

      } else if (this.readyState == 4) {
        console.log('Error while retrieving adopters data, could not complete operation');
      }
    };

    // get the URL to call, using the 'next' url if set, otherwise building from original option set
    var url;
    if (opts.next !== undefined) {
      url = opts.next;
    } else {
      url = opts.src_root + opts.src_projects_prefix;
      if (opts.project_id !== undefined && opts.project_id.trim() !== '') {
        url += '/' + opts.project_id;
      }
      if (opts.working_group !== undefined && opts.working_group.trim() !== '') {
        url += '?working_group=' + opts.working_group;
      }
    }
    // send request to get JSON data
    xhttp.open('GET', url, true);
    xhttp.send();
  }

  createWGProjectsList(json_object, opts, el) {

    const ul = document.createElement('ul');
    ul.setAttribute('class', "list-unstyled");

    document.getElementById("sidebarAdopters").appendChild(ul);

    for (const project of json_object) {
      var projectOpts = JSON.parse(JSON.stringify(opts));
      projectOpts.project_id = project.project_id;

      const li = document.createElement('li');
      ul.appendChild(li);

      const sidebarLink = document.createElement('a');
      sidebarLink.setAttribute('href', '#' + project.project_id);
      sidebarLink.textContent = project.name;
      li.appendChild(sidebarLink);

      this.createProjectList(json_object, projectOpts, el);
    }
  }

  createProjectList(json_object, opts, el) {
    
    if (typeof json_object !== 'undefined') {
      var int = 1; 
      for (const project of json_object) {
        if (opts.project_id !== project.project_id) {
          continue;
        }
        const project_div = document.createElement('div');
        project_div.setAttribute('class', project.project_id);
        if (int === 1) {
          project_div.setAttribute('class', project.project_id + " active " + int);
        }
        int += 1;

        // @Todo - increment is not working



        for (const adopter of project.adopters) {
          const div = document.createElement('div');
          div.setAttribute('class', "white-bg-shadow margin-bottom-40");

          // Get the home page url of this adopter
          var url = '';
          if (typeof adopter['homepage_url'] !== 'undefined') {
            url = adopter['homepage_url'];
          }

          // Get the name of this adopter
          var name = '';
          if (typeof adopter['name'] !== 'undefined') {
            name = adopter['name'];
          }

          // Get the logo of this adopter
          var logo = '';
          if (typeof adopter['logo'] !== 'undefined') {
            logo = adopter['logo'];
          }
          if (opts['logo_white'] === true && typeof adopter['logo_white'] !== 'undefined') {
            logo = adopter['logo_white'];
          }

          let p_logo_adopter = document.createElement('p');
          let p_logo_project = document.createElement('p');
          let p_description = document.createElement('p');  
          let p_learn_more = document.createElement('p');
          let a_learn_more = document.createElement('a');
          let a_logo_adopter = document.createElement('a');
          let a_logo_project = document.createElement('a');
          let img_logo_adopter = document.createElement('img');
          let img_logo_project = document.createElement('img');

          a_logo_adopter.setAttribute('href', url);
          img_logo_adopter.setAttribute('alt', name);
          img_logo_adopter.setAttribute('src', opts.src_root + '/assets/images/adopters/' + logo);
          img_logo_adopter.setAttribute('class', 'featured-adopters-img featured-adopters-adopter-img');
          a_logo_adopter.appendChild(img_logo_adopter);
          a_logo_adopter.setAttribute('class', "clearfix");
          p_logo_adopter.appendChild(a_logo_adopter);
          p_logo_adopter.setAttribute('class', 'featured-adopters-p-logo');

          a_logo_project.setAttribute('href', project.url);
          img_logo_project.setAttribute('alt', project.name);
          img_logo_project.setAttribute('src', project.logo);
          img_logo_project.setAttribute('class', 'featured-adopters-img featured-adopters-project-img');
          a_logo_project.appendChild(img_logo_project);
          p_logo_project.appendChild(a_logo_project);
          p_logo_project.setAttribute('class', 'featured-adopters-p-logo');
          
          p_description.setAttribute('class', 'margin-top-15');
          p_description.textContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
          
          a_learn_more.setAttribute('href', url);
          a_learn_more.setAttribute('alt', name);
          a_learn_more.textContent = "Learn More >";
          p_learn_more.appendChild(a_learn_more);

          div.appendChild(p_logo_project);
          div.appendChild(p_logo_adopter);
          div.appendChild(p_description);
          div.appendChild(p_learn_more);

          project_div.appendChild(div);
          
        }
        
        for (var i = 0; i < el.length; i++) {
          el[i].appendChild(project_div);
        }
      }
    }
  }

  // Function to scroll when there is anchor in url
  scrollToAnchor() {
    if (location.hash) {
      var projectId = location.hash.replace('#', '');
      var element = document.getElementById(`${projectId}`);
      element.scrollIntoView();
    }
  }
}
var ecdtoolsAdopters = new EcdtoolsAdopters();