---
title: "Running Developer Tools in Containers"
date: 2020-03-20T09:02:42-04:00
tags: []
output: "Standard and Reference Implementation(s)"
preliminary_work: ""
participants: ["ibm","redhat"]
---
The Standard developer Workspace definition contains a blueprint for how developer tools can interact with containers: e.g. containerized tools or runtimes. What if this isn’t just for IDEs?  

We will investigate and provide patterns for how this same definition could be used to build command line or other tools that interact with containers using the same ‘devfile 2.0’ definition: this may include creating projects via template, using containers for build, and iterative app dev in containers. Work will include a hosted registry of community devfiles and support for developers to share or extend these definitions.  

Note: the focus is cloud and Kubernetes, although we aim for as much as possible to work for local containers.
