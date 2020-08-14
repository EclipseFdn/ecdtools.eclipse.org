---
title: "Extensions to Tracing Protocol"
date: 2020-08-14T19:15:49+01:00
tags: []
output: | 
  <ul>
    <li>A standard protocol specifying how trace analysis servers and trace visualization clients communicate​
    <li>This initiative will hopefully result in some front-end development collaboration and the establishment of a community around TSP
  </ul>
preliminary_work: ""
participants: ["ericsson"]
---
The purpose of the Trace Server Protocol (TSP) is to standardize how trace analysis back-ends and trace visualization front-ends communicate. TSP decouples the trace analysis smarts from a given client implementation. It transports trace analysis results of the trace analysis back-end in a standardized way.​

TSP opens doors to new opportunities and possibilities, thereby allowing to:​
<ul>
  <li>Integrate with other web-based solutions, such as Cloud IDEs, Continuous Integration Dashboards,  bug reporting tools
  <li>Leverage modern, state-of-the-art UI technologies due to decoupled visualization front-end
  <li>Scale by supporting huge traces potentially larger than a local physical disk size due to decoupled trace analysis
</ul>
