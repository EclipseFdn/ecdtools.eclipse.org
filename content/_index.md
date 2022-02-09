---
title: "Eclipse Cloud DevTools"
seo_title: "Eclipse Cloud Development Tools Working Group"
headline: "THE COMMUNITY FOR INDUSTRY-BEST OPEN&nbsp;SOURCE&nbsp;CLOUD DEVELOPMENT TOOLS"
#tagline: "Industry collaboration on open source cloud development tools "
description: "The Eclipse Cloud Development Tools Working Group drives the evolution and broad adoption of de facto standards for cloud development tools, including language support, extensions, and developer workspace definition."
hide_page_title: true
hide_sidebar: true
hide_breadcrumb: true
show_featured_story: false
date: 2020-03-01T16:09:45-04:00
layout: "single"
#links: [[href: "#statement", text: "Developer Tools"],[href: "https://accounts.eclipse.org/contact/membership/ecdtools", text: "Become a member"],[href: "https://accounts.eclipse.org/mailing-list/ecd-tools-wg", text: "Join our Mailing List"]]
container: "container-fluid"
header_wrapper_class: "featured-jumbotron-home"
---
{{< home/powered-by >}}

{{< home/highlights
    id="featured-story-container"
    publishTarget="ecd_tools"
    templateId="featured-story-custom"
    count="5"
    templatePath="/js/templates/featured-story-custom.mustache" >}}

{{< home/projects 
    projectIds="ecd.openvsx,ecd.theia,ecd.jkube"
    templateId="homepage-featured-projects"
    url="https://projects.eclipse.org/api/projects?working_group=cloud-development-tools"
    classes="margin-top-30"
    >}}

{{< mustache_js template-id="homepage-featured-projects" path="/js/templates/homepage-featured-projects.mustache" >}}

{{< home/whats-new >}}
{{< mustache_js template-id="homepage-news-list-item" path="/js/templates/homepage-news-list-item.mustache" >}}
{{< home/stats >}}
{{< home/members limit="50" >}}
