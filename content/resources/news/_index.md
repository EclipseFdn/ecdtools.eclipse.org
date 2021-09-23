---
title: "News & Events"
seo_title: "News & Events - ECDtools"
headline: "News & Events"
jumbotron_bg_class: "featured-jumbotron-sub-pages header-membership-bg-img"
description: ""
keywords: ["ECDtools"]
---

{{< grid/section-container class="featured-news">}}
  {{< grid/div class="row" isMarkdown="false" >}}
    {{< grid/div class="col-sm-12" isMarkdown="false" >}}
      {{< newsroom/news
          title="News"
          id="news-list-container"
          publishTarget="ecd_tools"
          count="5"
          class="col-sm-24"
          templateId="custom-news-template" templatePath="/js/templates/news-home.mustache"
          paginate="true" >}}
    {{</ grid/div >}}

    {{< grid/div class="col-sm-12 featured-events text-center" isMarkdown="false" >}}
      {{< newsroom/events
          title="Upcoming Events"
          publishTarget="ecd_tools"
          class="col-sm-24"
          containerClass="event-timeline"
          upcoming="1"
          templateId="custom-events-template" templatePath="js/templates/event-list-format.mustache"
          count="4"  includeList="true" >}}
    {{</ grid/div >}}
   {{</ grid/div >}}
{{</ grid/section-container >}}

