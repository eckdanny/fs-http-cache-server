Filesystem HTTP Cache Server
============================

Demonstrates the use of streams in NodeJS to crate a basic file-system cache server for HTTP requests.

*Do not use in production!*

## Overview

This simple demonstrative implementation uses the server's local filesystem to cache HTTP requests to a remote Product Details web service. The node server exposes the product API: 

`GET /upc/:upcNumber`

A response is then either streamed from the origin server or from the filesystem cache according the the diagram below:

<figure>
  <img style="text-align: center;" src="https://raw.github.com/eckdanny/fs-http-cache-server/master/dfm.jpg" alt="Activity Diagram">
  <figcaption>My Caption</figcaption>
</figure>

The file-system cache may be implemented to reduce latency in a computationally-expensive SQL query.
