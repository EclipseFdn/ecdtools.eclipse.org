/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
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

import $ from 'jquery';
import Mustache from 'mustache';
import template from '../templates/tpl-projects-item.mustache'; 
import "numeral";
import List from 'list.js';

export const processJSON = (json, options) => {

    function getCategory(project_id) {
        var categories = {
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
        return categories[project_id];
    }

    function fileExists(url) {
        if(url){
            var req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            return req.status == 200;
        } else {
            return false;
        }
    }

    // Initiate the projects array
    let projects = json;

    // Filter by project ID
    if (options.projectIds !== undefined && options.projectIds !== "") {
        const acceptedProjectIds = options.projectIds.split(",");
        projects = [];
        $(json).each(function(key, element){
            if (acceptedProjectIds.includes(element.project_id)) {
                projects.push(element);
            }
        });
    }

    $(projects).each(function(key, project){

        projects[key].category = getCategory(projects[key].project_id);

        projects[key].version = 'none';
        if (project.releases[0]) {
            projects[key].version = project.releases[0].name;
        }

        if (options.templateId !== "tpl-projects-item") {
            $(project.project_leads).each(function(project_lead_key, project_lead){
                projects[key].project_lead_image = '/images/ecdtools/home/silhouette.jpg';
                projects[key].project_lead_full_name = project_lead.full_name;
                if (fileExists('/images/ecdtools/projects/'+ project_lead.username +'.png')) {
                    projects[key].project_lead_image = '/images/ecdtools/projects/'+ project_lead.username +'.png';
                }
                return false;
            });
        }
        
    });

    return projects;
};

(function ($, document) {
    $('.featured-projects').each(function (index, element) {
        const options = {
            id: '',
            templateId: '',
            projectIds: '',
            url: '',
            ...$(element).data(),
        };

        // fetching the users
        function fetchProjects() {
            return fetch(options.url)
            .then(response => response.json())
        }

        let results = [];
        Promise.allSettled([fetchProjects()])
        .then(function (responses) {
            responses.forEach((el) => {
                // skip rejected promises
                if (el.status === 'fulfilled') {
                    const projects = processJSON(el.value, options);
                  if (projects.length > 0) {
                    results = projects;
                  }
                }
            });

            const data = {
                items: results,
            };

            // Render component
            let html = '';
            //console.log(options);
            if (options.templateId !== '' && document.getElementById(options.templateId)) {
                const theme = document.getElementById(options.templateId).innerHTML;
                html = Mustache.render(theme, data);
            } else {
                html = template(data);
            }
            element.innerHTML += html;
        })
        .catch(err => console.log(err));
    });
})(jQuery, document);


