# Third-party notices

## Body diagram (History → Muscles)

`lib/data/body-paths.ts` contains SVG path data from [MuscleMap](https://github.com/melihcolpan/MuscleMap) by Melih Colpan (MIT License, reproduced below), as converted to JSON by [openGym](https://github.com/DuarteSantos8/openGym) (`frontend/src/lib/body-paths.js`, © 2026 Duarte Santos). openGym states this geometry is MuscleMap artwork under MIT, not openGym AGPL-3.0 code. Only the male front/back views are kept. The rendering component, exercise→muscle mapping and aggregation in Fortis are original code (the "relative to the most-trained muscle, five shade steps, secondaries count half" approach was inspired by openGym). No openGym exercise media (© Gym visual, gymvisual.com) is used.

```
MIT License

Copyright (c) 2026 Melih Colpan

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
MIT License

Copyright (c) 2026 Hasan Emir Yıldırım

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation and data files (the "Software"),
to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
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
MIT License

Copyright (c) 2021-2025 David Evans

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

## Exercise demos (workout screen → tap exercise name; Exercises → exercise page)

`public/demos/*.webp`, `public/demos/index.json` and `lib/data/demos.json` are adapted from [Everkinetic](https://github.com/everkinetic/data) (open data project based on everkinetic.com by Greg Priday), licensed **CC BY-SA 4.0** (https://creativecommons.org/licenses/by-sa/4.0/). Changes: start/end PNG frames converted to greyscale, padded square, resized to 480 px WebP; titles, steps and muscle names reused, with the leading "This is an exercise for…" primer sentence hidden in the UI. These adapted files are likewise licensed CC BY-SA 4.0. The credit is shown under every drawing in the app. The mapping from Fortis exercises to Everkinetic ids (`scripts/demo-map.json`) was reviewed by eye; `scripts/build-demos.py` regenerates the assets.

Deliberately **not** used: free-exercise-db / wrkout exercises.json images (their upstream author states the images were scraped and advises against commercial use), user-uploaded wger images without clear provenance, ExerciseDB, gymvisual, MuscleWiki.
