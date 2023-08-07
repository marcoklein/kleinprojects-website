---
tags: [impromat]
title: Fuzzy Search Considerations for Impromat
date: 2023-08-07
---

## Context

- Currently, the search for element is implemented with the fuzzy search library [fuse.js](https://www.fusejs.io/).
- For a search, all elements of the database are loaded and then searched via _fuse.js_.
- This provided an easy and start BUT: the approach does not scale as all elements have to be searched for every call.

### Technology Stack

The investigated options consider the current stack:

- [Postgresql](https://www.postgresql.org/) as database
- [Prisma](https://www.prisma.io/) for db mapping

Thus, options span from Postgres native features to Prisma capabilities to stay with the existing stack.

## Decision

Still unclear, how important fuzziness of the search is.

1. Switch to easiest `contains` option.
2. Observe user experience without fuzzy search and verify it is still usable.
3. Switch to `pg_trgm` in the mid-term if Prisma is not supporting a fuzzy search.

## Considered Options

- Prisma Full Text Search
- Postgres `pg_trgm`
- Basic text search via `LIKE %searchText%`

### Prisma Full Text Search

Prisma preview feature for searching through database fields via a search logic:

- Good, because Prisma is the db abstraction layer (shift complexity to abstraction layer).
- Bad, because the search is not fuzzy but is a set of static search rules.
- Good, because it provides huge performance benefits over the current solution.

See [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search)

### Postgres `pg_trgm`

Postgres trigram extension for fuzzy search features:

- Bad, because it requires raw SQL (mixing with Prisma as abstraction layer).
- Good, because it is extremely performant as it works directly with Postgres.
- Good, because it is fuzzy.

### Basic text search via `LIKE`

- Good, because it provides the fastest query time.
- Bad, because search is not fuzzy at all.
- Good, because it can be implemented via Prisma `contains` filter.
