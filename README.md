# Turn your journal into music

## [DearDiary.ai](https://deardiary.ai/)

### **Breaking news –** We are honored to be a winning project in the [Magenta and Gray Area ML and music hackathon](https://bitrate.devpost.com/project-gallery)!

---

<img src="https://deardiary.ai/complete-tree.png" width="400" alt="Illustration of a peaceful tree, leaning to the left, with birds flying away" />

## Why use it?

We want you to journal and to feel better. [Studies](https://pubmed.ncbi.nlm.nih.gov/23790815/) [show](https://pubmed.ncbi.nlm.nih.gov/16942980/) that journaling increases mindfulness and alleviates stress, anxiety, and depression.

We also want you to create music. Like journaling, the mental health benefits of creating music are [well-documented](https://www.sciencedirect.com/science/article/abs/pii/S0272735809000026). And music is awesome.

## How it works

**Sentiment Analysis**
As you type each word, we perform sentiment analysis using the popular natural language processing library VADER.js. This returns a prediction score from -1.0 to +1.0, that we interpret as a sentiment along the spectrum of negative to neutral to positive.

**Music Creation using Magenta**
We use Google’s Magenta MusicVAE pre-trained model to interpolate between two pre-composed melodies—one happy, one sad—created by our teammate Devin Lane who has a background in music composition and education. As you type, our app creates new music that lives in the latent space of the emotion spectrum between happy, neutral, and sad based on our sentiment analysis.

**Visuals and a e s t h e t i c**
We opt for minimal and calming design because we want people to freely express their thoughts and feelings. We animate an SVG tree with leaves and birds by covering parts of the image with white squares that we dynamically remove as the user types.

**Playfulness and Creativity**
We build in Easter eggs to encourage playfulness and creativity. The music changes with punctuation, special characters, upper case, and deleting. Try strong emotion words to see what you can create!

**Playback and social sharing**
We save entries using Google Firestore for realtime persistence so that users can save, share, and replay the exact song they create. We integrate "share to Twitter" and "share as a link" functionality.

## What is exciting and useful about this project?

**Artistic and musical considerations**: Expanding the boundaries of user-generated art informed by AI trained on creative musicians' compositions.

**Music education and empowerment**: more people feel that—yes—they can create music.

**Mindfulness, mental health, emotional awareness**: A soothing, engaging return to the self. A recharge in the deluge of a storm.

**Coping during 2020**: Traumatic events abound—COVID-19, reckoning with social and racial justice, natural disasters, political division—we offer a moment to come into deeper awareness with your emotions. This radical self-compassion is an important step in societal transformation.

## Challenges we ran into, what we learned, and what we're proud of

**NLP sentiment score** is a limited metric for gauging emotion of text. We were hoping to find a multi-dimensional emotion library, but there are only a few available and they're all paid services. It would be a great open source project to build an detailed emotion NLP API that runs in the browser and is accessible to scrappy teams.

**Music**: writing melodies that were contrasted enough to convey different emotions, yet similar enough to create musically-satisfying interpolations. Lots of trial and error with very dissonant AI interpolations between the compositions.

**Playback**: Engineered advanced custom diffing solution to playback exact melody snapshot of user activity and implemented state management system to accurately play back each note character by character.

**Browser compatibility**: Extensive testing and bug resolution for Chrome, Firefox, Safari, MacOS, Windows, and iOS.

## What's next for Dear Diary

- Increase dialogue with mental health professionals for maximum emotional benefit and enjoyment for users

- Increase dialogue community of users who are musically timid, yet curious

- Increase dialogue with general users for next directions

- Offer new sound design and melodies

- Offer journal entry saving and user accounts as well as new sharing integrations

- Improved visuals using generative AI

## Areas for future research and technological developments in the community

- Improved multi-dimensional emotion ranking libraries

- ImprovRNN often produced results we found not musical

- Integrate MIDI to Tone.js and Magenta.js

- Improved documentation to match the quality of the examples

- Create audio plug-ins for DAWs like Logic and Reaper

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

[vaderSentiment-js](https://github.com/vaderSentiment/vaderSentiment-js)

[Journal tree](http://clipart-library.com/clip-art/tree-silhouette-svg-25.htm)

[Excellent tutorial on MusicVAE](https://medium.com/@torinblankensmith/melody-mixer-using-deeplearn-js-to-mix-melodies-in-the-browser-8ad5b42b4d0b)

[IP Location Finder by KeyCDN](https://tools.keycdn.com/geo)

[Fantastic tutorial on Magenta-js in general](https://hello-magenta.glitch.me/)

### Codebase instructions

#### To generate sequences:

To generate sequences, navigate to /generate-melodies. This will interpolate the two seed sequences and output the results to the browser console. You can then update /src/sequences.json with the output, which will be consumed by the app on the next deploy.

#### To convert from a midi file to INoteSequence:

Place your .mid file in the public folder and manually update /src/components/MidiConvert.tsx to point at the right path. Then navigate to /midi-convert in your browser. Check the console for the sequence version.

#### To run the repo

```
// install deps:
yarn
// run next dev:
yarn dev
```
