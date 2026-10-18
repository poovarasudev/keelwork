## What it does

`brainstorm-ideas-existing` supports **continuous discovery** on a product that already has users. Working as the **product trio** (product manager, designer, engineer), it generates five ideas from each perspective toward an outcome you name, ranks the top five, and gives each its reasoning and the assumptions to validate.

The ranking weighs fit with your stated objective, likely impact on the outcome, feasibility and effort, and differentiation from what the product already does. It saves the result to a file and hands the chosen idea to [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md).

## When to reach for it

You invoke this by typing `/brainstorm-ideas-existing`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

| Your situation | Reach for |
| --- | --- |
| A live product and an outcome to move | `/brainstorm-ideas-existing` |
| No product yet | [brainstorm-ideas-new](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/brainstorm-ideas-new.md) |
| An idea already chosen | [strategy-red-team](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/strategy-red-team.md), or [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) directly |

## The product trio

Discovery works best when product, design and engineering think together, because the strongest ideas often come from the engineer who knows what data the product already has. The skill asks all three for ideas before ranking, so the engineer's "we already store that, we could just..." gets the same hearing as the product manager's market read.

## Common questions

**Can I point it at research I already have?**

Yes. Give it interview notes, an opportunity tree, personas or analytics, and it reads them before ideating. If you give it the product's URL, it looks the product up.

## It's working if

- Every idea ties back to the outcome you named.
- At least some of the engineering ideas use data or capabilities the product already has.
- The top five each carry assumptions to validate, and the result is saved for `/ship`.

## Where it fits

The **on-ramp** in front of [ship](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ship.md) for a live product, usually followed by [strategy-red-team](https://github.com/poovarasudev/keelwork/blob/main/docs/productivity/strategy-red-team.md). [ask-keelwork](https://github.com/poovarasudev/keelwork/blob/main/docs/engineering/ask-keelwork.md) routes you over the whole set.
