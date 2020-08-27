## Hello

We hope to encourage awareness and peace through the act of writing a journal entry. To create a rewarding experience, we use NLP to measure the mood of the writing and generate a unique melody for every story using the Magenta MusicVAE ML model. As you write, you build your own visual and musical story.

Visit <TBD> to experience the newest deploy.

---

### Contributors:

- Stephen Haney – https://twitter.com/sdothaney
- Suyash Joshi – https://twitter.com/suyashcjoshi
- Devin Lane – https://twitter.com/gentle_return

### Prior art:

Jazz Keys: https://jazzkeys.plan8.co/
Magenta-js: https://github.com/magenta/magenta-js
Tone.js: https://tonejs.github.io/

### Credit:

Journal tree:
http://clipart-library.com/clip-art/tree-silhouette-svg-25.htm

Loading tree:
https://svgsilh.com/image/2013419.html

Excellent tutorial on MusicVAE:
https://medium.com/@torinblankensmith/melody-mixer-using-deeplearn-js-to-mix-melodies-in-the-browser-8ad5b42b4d0b

Fantastic tutorial on Magenta-js in general:
https://hello-magenta.glitch.me/

### Codebase instructions

#### To generate sequences:

To generate sequences, navigate to /generate-melodies. This will interpolate the two seed sequences and output the results to the browser console. You can then update /src/sequences.json with the output, which will be consumed by the app on the next deploy.

#### To convert from a midi file to INoteSequence:

Place your .mid file in the public folder and manually update /src/components/MidiConvert.tsx to point at the right path. Then navigate to /midi-convert in your browser. Check the console for the sequence version.
