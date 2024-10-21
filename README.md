# Joiner

## What's this?

It's WIP continuation of ideas that were put into
[evologi/join](https://github.com/evologi/join) with **EXTREME** typescript
support, expanded join types and join aliases support, predefined result
mappers, ability to join any Iterable instead of just Maps and more!

```bash
c; npm start
```

## TODO

1. Ability to deduplicate entries on keyGenerator with ability to choose what to do with with duplcates where 1|2 slots are empty
2. Context Expander merger where entries of expandable context are accessible by Symbols and not string names
3. Pre-made join functions like `leftJoin(...)`
4. pipeline joiner which accepts multiple datasets and sequential instruction on how to join them. Pipeline types from [nikelborm/autism-stats/index.ts](https://github.com/nikelborm/autism-stats/blob/main/index.ts), allows to make multiple joins on them, can be used as a part of queryBuilder
5. `USING` syntax in joins. Allow joining many columns by their respective names (also ability to determine from all the context are there any ambiguous column names with all previous datasets in join)
6. ability to name left side and right side so they can be extracted by name later (force uniqueness of the names) (just like aliases in sql)
7. ability to get generator on discarded values `not(...)`
8. remove never used stuff
9. Recursive `spreadObjectMerger`, which also merges nested objects
10. Joiner using indicies
