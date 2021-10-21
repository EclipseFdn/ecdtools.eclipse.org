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

const EclipseFdnAdoptersAlternate = (function (window, document) {
  class EclipseFdnAdoptersAlternateClass {
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
  
    /** 
     * Get all the options
     * 
     * @param {Object} options
    */
    getMergedOptions(options) {
      // Default settings copy
      let opts = JSON.parse(JSON.stringify(this.default_options));
  
      // Go through the parameters of Options if its defined and is an object
      if (typeof (options) !== 'undefined' && typeof (options) === 'object') {
        for (let optionName in this.default_options) {
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
    getWGList = function(options) {
      let t = this;
      let opts = this.getMergedOptions(options);
      // create callback on ready
      this.fireCall(opts, function(response) {
        t.createWGProjectsList(
          response,
          opts,
          document.querySelectorAll(opts.selector)
        );
        t.scrollToAnchor();
      });
    }
  
    fireCall(opts, callback, currentData = []) {
      let t = this;
      let xhttp = new XMLHttpRequest();
      // create callback on ready
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // merge new data with current
          let json = JSON.parse(this.responseText);
          if (Array.isArray(currentData) || currentData.length) {
            json = currentData.concat(json);
          }
  
          // check the link header as long as its set
          let linkHeader = xhttp.getResponseHeader('Link');
          if (linkHeader !== null) {
            let match = linkHeader.match(t.precompiledRegex);
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
      let url;
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
      ul.setAttribute('role', "tablist");
  
      document.getElementById("sidebarAdopters").appendChild(ul);
  
      let int = 0;
      for (const project of json_object) {
        
        let projectOpts = JSON.parse(JSON.stringify(opts));
        projectOpts.project_id = project.project_id;
  
        const li = document.createElement('li');
        ul.appendChild(li);
  
        let pid = project.project_id;
        pid = pid.replace(".","_");

        const sidebarLink = document.createElement('a');
        sidebarLink.setAttribute('href', '#' + pid);
        sidebarLink.setAttribute('aria-controls', pid);
        sidebarLink.setAttribute('role', 'tab');
        sidebarLink.setAttribute('data-toggle', 'tab');
        sidebarLink.textContent = project.name;
        int = int + 1;
        if (int === 1) {
          li.setAttribute('class', 'active');
        }
        li.appendChild(sidebarLink);
  
        this.createProjectList(json_object, projectOpts, el);
      }
    }
  
    createProjectList(json_object, opts, el) {
  
      if (typeof json_object !== 'undefined') {
        let int = 0;
        for (const project of json_object) {
          int = int + 1;
          if (opts.project_id !== project.project_id) {
            continue;
          }
          let pid = project.project_id;
          pid = pid.replace(".","_");

          const project_div = document.createElement('div');
          let project_classes = "tab-pane";
          if (int === 1) {
            project_classes = project_classes + " active";
          }
          project_div.setAttribute('class', project_classes);
          project_div.setAttribute('role', 'tabpanel');
          project_div.setAttribute('id', pid);
  
          for (const adopter of project.adopters) {
            const col = document.createElement('div');
            col.setAttribute('class', "col-sm-8");

            const div = document.createElement('div');
            div.setAttribute('class', "white-bg-shadow margin-bottom-40 match-height-item");
  
            // Get the home page url of this adopter
            let url = '';
            if (typeof adopter['homepage_url'] !== 'undefined') {
              url = adopter['homepage_url'];
            }
  
            // Get the name of this adopter
            let name = '';
            if (typeof adopter['name'] !== 'undefined') {
              name = adopter['name'];
            }
  
            // Get the logo of this adopter
            let logo = '';
            if (typeof adopter['logo'] !== 'undefined') {
              logo = adopter['logo'];
            }
            if (opts['logo_white'] === true && typeof adopter['logo_white'] !== 'undefined') {
              logo = adopter['logo_white'];
            }
  
            let p_logo_adopter = document.createElement('p');
            let a_logo_adopter = document.createElement('a');
            let img_logo_adopter = document.createElement('img');
  
            a_logo_adopter.setAttribute('href', url);
            img_logo_adopter.setAttribute('alt', name);
            img_logo_adopter.setAttribute('src', opts.src_root + '/assets/images/adopters/' + logo);
            img_logo_adopter.setAttribute('class', 'featured-adopters-img img-responsive');
            a_logo_adopter.appendChild(img_logo_adopter);
            p_logo_adopter.appendChild(a_logo_adopter);
            p_logo_adopter.setAttribute('class', 'featured-adopters-p-logo');
  
            div.appendChild(p_logo_adopter);
            col.appendChild(div);
            project_div.appendChild(col);
  
          }
  
          for (let i = 0; i < el.length; i++) {
            el[i].appendChild(project_div);
          }
        }
      }
    }
  
    // Function to scroll when there is anchor in url
    scrollToAnchor() {
      if (location.hash) {
        let projectId = location.hash.replace('#', '');
        let element = document.getElementById(`${projectId}`);
        element.scrollIntoView();
      }
    }
  }
  window.eclipseFdnAdoptersAlternate = new EclipseFdnAdoptersAlternateClass();
})(window, document);

export default EclipseFdnAdoptersAlternate;

