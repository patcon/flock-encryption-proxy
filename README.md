# Flock Encryption Proxy

This repo is currently a testbed for creating local encryption proxy for
[Flock](https://whispersystems.org/blog/flock/), an encrypted calendar and contact sync service for Android.

Since the Android Flock app encrypted all data on the device before
sending it to the sync server, it was not possible to access unencrypted
data from a desktop environment. This tool aspires to be a local
encryption proxy written in NodeJS. It will allow users to manage and
view Calendars and Contacts on their encrypted sync server using
standard desktop tools (ie. [The SOGo Connector
Extension](http://www.sogo.nu/downloads/frontends.html) for Mozilla's
[Thunderbird email client](https://www.mozilla.org/en-US/thunderbird/)
and [Lightning calendar
extension](https://www.mozilla.org/en-US/projects/calendar/).

## Approach

I am planning to use Apigee's [Argo](http://github.com/argo/argo/), a
modular HTTP gateway for Web APIs. I will be intercepting and
encrypting/decrypting appropriate portions of the DAV HTTP responses
on-the-fly using XPath parsing.

## Current Status

Right now, this project just logs output so that I can familiarize
myself with the traffic going from Flock app to WebDAV server. I am
publishing it so that any interested parties can see my approach.
