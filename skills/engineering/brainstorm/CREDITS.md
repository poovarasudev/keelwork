# Credits

`brainstorm` is ported from the [`brainstorming`](https://github.com/obra/superpowers/tree/main/skills/brainstorming) skill in [obra/superpowers](https://github.com/obra/superpowers), by Jesse Vincent, under the MIT License reproduced below.

What Keelwork changed, per SRD requirement S3:

- **No auto-trigger.** The description scopes it to the design step of `/ship`; Superpowers fires it before any creative work.
- **Hands off to grilling, not writing-plans.** Its exit returns to `/ship`, which runs grilling and then `to-spec` and `to-tickets`. It never invokes writing-plans.
- **The design draft is grilling input.** The written spec, its self-review and the spec review gate are dropped: grilling and `to-spec` cover them.
- **Every approach lists its YAGNI cuts**, so the user can restore any of them by name.
- The spike and bounded paths, the visual-companion server and its scripts are dropped. Visual questions go to the `prototype` skill instead.

## Superpowers license

```
MIT License

Copyright (c) 2025 Jesse Vincent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
