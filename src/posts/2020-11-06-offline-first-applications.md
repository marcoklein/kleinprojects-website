---
title: Offline First Applications
date: 2020-11-06
unlisted: true
---

The offline first approach is a popular approach to increase usability of mobile end user applications.
Here my notes about this, using GraphQL for backend communication:

## Use RxDB

[RxDB](https://rxdb.info/replication-graphql.html) is a database that also comes with replication functionality through GraphQL. Additionally, it offers a CouchDB synchronization protocol.
Therefore, this database system can take over a schema-based data management for an offline first approach and sync changes to the server as needed.

This comes at a price:

1. The schema of RxDB and the GraphQL schema are nearly duplicates. However, we cannot use the exact same schema, as RxDB will need some other data for local storage (e.g. local keys).
2. Mixing of Database access and GraphQL queries?
    - You cannot directly request stuff from the server because you first need to cache it in your DB. And then you can present it to the user.
    - Otherwise, you would mix up queries to the backend and to GraphQL
    - Advantage: you have your queries always cached (however, Apollo Client also caches)

> Code duplication through database and GraphQL schema is too large for a small development team!
> Therefore, we should focus on getting the **Apollo client offline first**!

## Use Apollo as GraphQL

Readings:

-   https://medium.com/twostoryrobot/a-recipe-for-offline-support-in-react-apollo-571ad7e6f7f4
-   https://codeburst.io/highly-functional-offline-applications-using-apollo-client-12885bd5f335
