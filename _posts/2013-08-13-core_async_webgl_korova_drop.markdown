---
layout: post
title:  "core.async + WebGL = korova-drop"
date:   2013-08-13 00:22:09
categories: cljs core.async
---

Try out the demo [here](/examples/korova_drop/). The source code is available [here](https://github.com/kapilreddy/korova-drop).

For this project I have used three.js (which is an awesome library), webGL and Audio API.
This will only work on Chrome for now.

I won't talk about how I have used three.js with cljs in this post.
This post mostly concentrates on how core.async makes handling events a whole lot easier.

## Workflow

Since I had never used clojurescript before this project, I spent some
time exploring the tools and setting up a basic workflow for cljs.

I used the following tools for my cljs workflow.

- [lein-cljsbuild](https://github.com/emezeske/lein-cljsbuild) is a very
  useful leiningen plugin that takes care of building cljs files into
  javascript outputs.

- [Piggieback](https://github.com/cemerick/piggieback) is a cljs repl that
runs on nrepl. I cannot stress enough how much it improved my workflow
after discovering it halfway through working on my project.

[Here](https://github.com/kapilreddy/dotemacs/blob/master/configurations/cljs-config.el) is some emacs config I use to quickly start off with piggieback.

## Getting Mp3 in browser

I'll try to compare js, cljs and cljs + core.async. Observe the
difference that core.async makes to the whole structure of the code.

Let's start with the code that handles file drag and drop. All it does
is add a couple of event handlers to a drop zone DOM element and provide a
way to process files.

```js
function init_file_handling (callback) {
  var drop_zone = document.getElementById ("drop_zone");
  drop_zone.addEventListener ("dragover", function (e) {
    e.stopPropagation ();
    e.preventDefault ();
    e.dataTransfer.dropEffect = "copy";
    return false;
  });

  drop_zone.addEventListener ("drop", function (e) {
    e.stopPropagation ();
    e.preventDefault ();
    callback (e.dataTransfer.files);
    return false;
  });
}
```

A plain cljs version.

```clj
(defn init-file-handling
  [callback]
  (let [drop-zone (by-id "drop_zone")
        files-chan (chan)]
    (.addEventListener drop-zone
                       "dragover"
                       (fn [e]
                         (.stopPropagation e)
                         (.preventDefault e)
                         (aset e "dropEffect" "dataTransfer" "copy"))
                       false)
    (.addEventListener drop-zone
                       "drop"
                       (fn [e]
                         (.stopPropagation e)
                         (.preventDefault e)
                         (callback (aget e "dataTransfer" "files")))
                       false)))
```

In following example, the function is just returning a files channel
instead of accepting callback to process on files.

```clj
(defn init-file-handling
  []
  (let [drop-zone (by-id "drop_zone")
        files-chan (chan)]
    (.addEventListener drop-zone
                       "dragover"
                       (fn [e]
                         (.stopPropagation e)
                         (.preventDefault e)
                         (aset e "dropEffect" "dataTransfer" "copy"))
                       false)
    (.addEventListener drop-zone
                       "drop"
                       (fn [e]
                         (.stopPropagation e)
                         (.preventDefault e)
                         (put! files-chan
                               (aget e "dataTransfer" "files")))
                       false)
    files-chan))
```

Nothing impressive right? But I'll get there soon.

## Playing audio

Now I can process the files to play the audio

```js
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function loadSound(file, callback) {
  var reader = new FileReader();
  reader.onload = function() {
    context.decodeAudioData(reader.result, function(buffer) {
      callback (buffer);
    }, onError);
  }
  reader.readArrayBuffer(file);
}

function playSound(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}
```

Lets convert this example to plain cljs

```clj
(def audio-context (if window/webkitAudioContext
                     (new window/webkitAudioContext)
                     window/AudioContext))

(defn play-sound
  [buffer]
  (let [source (.createBufferSource source)]
    (aset source "buffer" buffer)
    (.connect source (aget audio-context "destination"))
    (.start source 0)))


(defn load-sound
  [file callback]
  (let [reader (FileReader.)]
    (aset reader "onload" (fn []
                             (.decodeAudioData audio-context
                                               (aget reader "result")
                                               (fn [buffer]
                                                 (callback buffer)))))
    (.readAsArrayBuffer reader file)))

```

And now using core.async

```clj
(def audio-context (if window/webkitAudioContext
                     (new window/webkitAudioContext)
                     window/AudioContext))

(defn play-sound
  [buffer]
  (let [source (.createBufferSource source)]
    (aset source "buffer" buffer)
    (.connect source (aget audio-context "destination"))
    (.start source 0)))


(defn local-file->chan
  [file]
  (let [reader (new window/FileReader)
        resp-c (chan)
        c (chan)]
    (set! (.-onload reader) (fn []
                              (put! resp-c (.-result reader))))
    (.readAsArrayBuffer reader file)
    (go-loop (let [resp (<! resp-c)]
               (.decodeAudioData audio-context
                                 resp
                                 #(put! c %))))
    c))
```

There is not much of difference in any of these examples. I am just
pushing the results to a channel and returning the channel instead
of relying on a callback function for further processing. Why would
I go through all this trouble just to play some audio file?

Let's get to that bit now.


## Bringing it all together

Let's use previous functions and write basic code to handle playing
audio from a file dropped in drop zone.

```js
function main () {
  init_file_handling (function (files) {
    var file = files [0];
    var drop_zone_wrapper = document.getElementById ("drop_zone_wrapper");
    drop_zone_wrapper.addClass ("loading");
    loadSound (file, function (buffer) {
      drop_zone_wrapper.removeClass ("loading");
      drop_zone_wrapper.addClass ("corner");
      playSound (buffer);
    });
  });
}
```

```clj
(defn -main
  []
  (init-file-handling (fn [files]
                        (let [file (aget files 0)
                              drop-zone-wrapper (by-id "drop_zone_wrapper")]
                          (add-class drop-zone-wrapper "loadding")
                          (load-sound file (fn [buffer]
                                             (remove-class drop-zone-wrapper "loading")
                                             (add-class drop-zone-wrapper "corner")
                                             (play-sound buffer)))))))
```

In both examples it's very hard to read and comprehend what is
happening and in what order (well not for a javascripter).

Instead of explaining what I am trying to do I am just going to
add code written using core.async.

```clj
(defn -main
  []
  (let [files-chan (init-file-handling)]
    (go-loop (let [files (<! files-chan)
                   file (aget files 0)]
               (add-class (by-id "drop_zone_wrapper") "loading")
               (let [audio (<! (local-file->chan file))]
                 (remove-class (by-id "drop_zone_wrapper") "loading")
                 (add-class (by-id "drop_zone_wrapper") "corner")
                 (play-sound audio))))))
```

Pretty clear right? Get the file from the 'files-chan', get the audio
from the file and play the sound.

Let's get to the fun part now.

From now on I'll just add code written using cljs + core.async.

## Analyzing audio data

Audio api provides audio analyzers which I am going to
use to vizualize audio.

```clj
(defn sound-+>analyzer
  [source-node]
  (let [analyzer (.createAnalyser audio-context)]
    (set! (.-fftSize analyzer) 1024)
    (set! (.-smoothingTimeConstant analyzer) 0.7)
    (.connect source-node analyzer)
    (.connect analyzer (.-destination audio-context))
    analyzer))

(defn -main
  []
  (let [files-chan (init-file-handling)
        audio-chan (chan)]
    (go-loop (let [files (<! files-chan)
                   file (aget files 0)]
               (add-class (by-id "drop_zone_wrapper") "loading")
               (let [audio (<! (local-file->chan file))]
                 (remove-class (by-id "drop_zone_wrapper") "loading")
                 (add-class (by-id "drop_zone_wrapper") "corner")
                 (remove-class (by-id "progress-bar-wrapper") "hidden")
                 (aset (by-id "progress") "style" "0%")
                 (put! audio-chan audio))))
    (go
     (loop [audio-source nil]
       (let [buff (<! audio-chan)
             source-node (play-sound-buff buff)]
         (when audio-source
           (.noteOff audio-source 0))
         (sound-+>analyzer source-node)
         (recur source-node))))))
```
I create an anlyzer node. Right now I don't do anything with it. Later
on I'll use it to render audio specturm data.

## Rendering stuff
Mordern browsers provide an API for UI loop called 'requestAnimationFrame'.
I'll create a UI channel to read available frames.

'render-stuff' is just a generic function which gets audio data to
render the specturm data.

{% highlight clojure %}
(defn animloop
  [ui-chan ts]
  (.requestAnimationFrame js/window (partial animloop ui-chan))
  (put! ui-chan ts))

(defn -main
  []
  (let [files-chan (init-file-handling)
        audio-chan (chan)
        ui-chan (chan)
        analyzer (atom nil)]
    (animloop ui-chan 0)
    (go-loop (let [files (<! files-chan)
                   file (aget files 0)]
               (add-class (by-id "drop_zone_wrapper") "loading")
               (let [audio (<! (local-file->chan file))]
                 (remove-class (by-id "drop_zone_wrapper") "loading")
                 (add-class (by-id "drop_zone_wrapper") "corner")
                 (remove-class (by-id "progress-bar-wrapper") "hidden")
                 (aset (by-id "progress") "style" "0%")
                 (put! audio-chan audio))))
    (go
     (loop [audio-source nil]
       (let [buff (<! audio-chan)
             source-node (play-sound-buff buff)]
         (put! progress-chan {:type :duration
                              :val (aget buff "duration")})
         (when audio-source
           (.noteOff audio-source 0))
         (reset! analyzer (sound-+>analyzer source-node))
         (recur source-node))))

    (go (loop [prev-data nil]
          (let [frame-time (<! ui-chan)]
            (if @analyzer
              (do
                (let [arr (new window/Uint8Array (.-innerWidth js/window))]
                  (.getByteFrequencyData @analyzer arr)
                  (let [audio-data (for [i (range (.-length arr))]
                                     (aget arr i))]
                    (recur (render-stuff audio-data prev-data)))))
              (recur prev-data)))))))
{% endhighlight %}

## Conclusion

core.async makes code structure readable and hence easy to manage.

Please comment for suggestions on github or send a pull request.

## Resources and further reading.

- [Core.async documentation](http://clojure.github.io/core.async/)
- [Core.async examples by David Nolen](https://github.com/swannodette/async-tests)
- [Awesome Dots game by Bruce Hauman](http://rigsomelight.com/2013/08/12/clojurescript-core-async-dots-game.html)
- [korova-drop Source](https://github.com/kapilreddy/korova-drop)
