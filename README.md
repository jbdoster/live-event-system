# Summary
This is a template that wraps a product integration for live event data in React web applications.

I am adding a component to my product toolkit.

My goal is to make this production ready and keep it as a template.

This is a work in progress.

# Why
When I am using any app, I think it stinks to have to wait for requests to finish before I can do something else.

I want to enhance the user experience by leveraging Web Sockets and providing live event data to React applications.


# Compatibility
I wanted to use [WebTransport](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport#browser_compatibility) Web API like the community suggests, but it is not currently compatible with Safari/Safari Mobile/Safari WebView.

So I chose [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API#browser_compatibility) Web API in the front end and I'll just have to stick with HTTP/1.1 for now.

I am using the [npm ws package](https://www.npmjs.com/package/ws) for the backend.
It was written according to the [Internet Engineering Task Force (IETF) RFC-6455 Web Socket Protocol](https://datatracker.ietf.org/doc/html/rfc6455).

It is awesome.

# Architecture and Design
![System Architecture Diagram](./system-architecture-diagram.png "System Architecture Diagram")

# Contributing (TBD)

## Install Dependencies
(TBD)

## Building the Projects
(TBD)

## Running the tests
(TBD)

### Regression/Smoke Tests
### Unit Tests
### End to End Tests