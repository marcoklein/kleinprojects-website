---
tags: [notes]
title: Documenting Decisions
date: 2024-08-17
---

This sheet describes some of my experiences with documentation. In particular decisions that would impact technologies and teams. There exist several approaches, one of the is the documentation via Markdown in the ADR or MADR format.

ADR is an architectural decision record, while MADR builds on that an tries to widen the scope to all decisions that are made in a project. Eventually, it doesn't matter what kind of format you would use as long as you decide on writing down agreements and context for your problems.

## Most Important Sections of a Decision

The most important sections of a decision record are:

- Context and Problem Statement
- Considered Options
- Decision Outcome

### Context and Problem Statement

When writing the decision record, the most important section is the description of _Context and Problem Statement_. This should describe the situation that led to the decision. Be clear and concise about the background and problem at hand.

Example:

```
When constructing the `o_employee` table, we realized that there are false entries. For example, it showed roles for certain engagements that were not added by the intended user. This sheet documents how the issue was debugged and the proposed solutions.
```

### Considered Options

The considered options gives a background on all options that you evaluated or thought about. You do not have to go into detail about each option, but this is the chance of providing a brief overview.

Example:

```
- Improve the internal merging of engagements for the employee table.
- Allow users to flag false and confirm correct merges.
```

### Decision Outcome

This section describes the decision that was made. If applicable, you can add an implication section that depicts consequences of the decision.

Example:

```
We decided to improve the internal merging of engagements. This will allow us to keep the system less complex because we would have to add additional logic for dealing with user input. The limitation is, that we might still miss on edge cases due to the complexity of merging engagements.
```

## Conclusion

It can be very easy to document decisions but it is so often overlooked or de-prioritized. In my experience, writing down small decisions help a lot with improving team collaboration and communication by pulling out already taken decisions to avoid reoccurring conversations about tech choices.

## References

- [Examples for Architecture Decision Records](https://github.com/joelparkerhenderson/architecture-decision-record): GitHub repo with examples for ADRs
- [Markown Any Decision Record](https://github.com/adr/madr): approach to document all decisions (not only architecture decisions) in a consistent way
