# Credits

`security-audit` is adapted from the `security-audit-static` command in the pm-ai-shipping plugin of [phuryn/pm-skills](https://github.com/phuryn/pm-skills), by Pawel Huryn, under the MIT License reproduced below.

The pm-skills command notes that its method is itself adapted from the public, Apache-2.0 `security-guidance` plugin in Anthropic's `claude-plugins-official` repository, and is not affiliated with or endorsed by Anthropic. The same applies here.

What Keelwork changed: the scope is the branch diff (with the code it reaches) instead of a whole repository; intent is checked against the spec and ADRs instead of a `documentation/` folder; model-selection and reroute guidance specific to one product line is dropped; and critical findings block the PR, matching SRD requirement Q2.

## pm-skills license

```
MIT License

Copyright (c) 2026 Pawel Huryn

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
