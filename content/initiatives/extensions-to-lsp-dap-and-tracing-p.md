---
title: "Extensions to LSP and DAP"
date: 2020-03-20T09:12:09-04:00
tags: []
output: | 
  We aim to have an impact in multiple vectors:
  <ul>
    <li>Eclipse ecosystem: replacing of all web tools through LSP/DAP based web tools
    <li>VSCode: continue supporting JDT.ls through upstream JDT refactorings
    <li>Help with Language Servers: extend XML Language Server to support Maven
    <li>Work with other parties on LSP definition to plug gaps we observe while integrating
  </ul>
preliminary_work: ""
participants: ["redhat"]
---
Developers operate more and more in a multi language/multi stack environment. A way is needed to simplify language support.

In our experience integrating language server protocols (LSP), and emerging debug adapter protocols (DAP) causes a major decrease in IDE maintenance due to offloading of the heavy-lifting to Language Servers. IDEs then are only responsible to present the results of the processing.

LSP and DAP are critical pieces of emerging cloud-based and containerized IDEs such as Theia and Che.
