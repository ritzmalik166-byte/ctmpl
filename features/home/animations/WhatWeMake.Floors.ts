"use client";

import gsap from "gsap";
import { blinkFrames, talkFrames, talkOverOpenArt, usePuppet } from "./puppet";
import { LIFT_DOORS_OPEN } from "./WhatWeMake.Lift";

/**
 * Floor 1 · Brand films. The cameraman leans in towards you, gives three little
 * "ready?" nods, and takes the shot: the camera flashes, the room lights up for
 * an instant, and the take board moves on to the next take. The REC light blinks.
 */
export function useFilmStudio() {
  return usePuppet((q) => {
    const [man, burst, fill, rec, take] = [q("cameraman"), q("flash-burst"), q("flash-fill"), q("rec"), q("take")];
    let takeNumber = 12;
    // flash parts start hidden; their tweens below don't render until the click
    gsap.set(burst, { scale: 0, opacity: 0 });
    gsap.set(fill, { opacity: 0 });

    const shoot = gsap
      .timeline({ repeat: -1, repeatDelay: 2.4, delay: 0.6 })
      // lean in: "look here!"
      .to(man, { scale: 1.028, rotation: -0.6, duration: 0.6, ease: "power2.out" })
      // three little ready-nods
      .to(man, { rotation: 0.5, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 5 })
      // click: flash from the lens, the room lights up, next take
      .addLabel("click")
      .to(man, { y: "+=1.5", duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, "click")
      .fromTo(burst, { scale: 0.2, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, "click")
      .fromTo(fill, { opacity: 0.5 }, { opacity: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, "click")
      .call(() => {
        takeNumber = takeNumber >= 99 ? 1 : takeNumber + 1;
        take.forEach((el) => (el.textContent = `TAKE  ${takeNumber}`));
      }, undefined, "click+=0.25")
      // ease back
      .to(man, { scale: 1, rotation: 0, duration: 0.8, ease: "power2.inOut" }, "click+=0.4");

    const recording = gsap.to(rec, { opacity: 0.15, duration: 0.6, ease: "steps(1)", yoyo: true, repeat: -1 });
    return [shoot, recording];
  });
}

/**
 * Floor 2 · Reels. Every 3 seconds the creator does her bit: waves (the whole
 * arm, from the shoulder), lifts her phone, tilts her head and says a few words, and
 * the ring light shines with her: bulbs light up round the ring, then all glow
 * together and fade. She blinks and breathes in between.
 */
export function useReelsStudio() {
  return usePuppet((q) => {
    const [creator, head, eyes, eyesHalf, mouthSmall, mouthWide, wave, phone, bulbs, halo] = [
      q("creator"), q("head"), q("eyes"), q("eyes-half"), q("mouth-small"), q("mouth-wide"),
      q("arm-wave"), q("arm-phone"), q("bulb"), q("ring-halo"),
    ];

    const show = gsap.timeline({ repeat: -1, delay: 0.6 });
    show.to({}, { duration: 3 }).addLabel("go"); // 3 s rest, then she moves and the light shines

    // ring light: a chase round the ring, then the whole ring glows, then off
    show
      .to(bulbs, { opacity: 1, duration: 0.12, stagger: 0.035, ease: "power1.out" }, "go")
      .to(halo, { opacity: 1, duration: 0.4, ease: "power2.out" }, "go+=0.6")
      .to(bulbs, { opacity: 0.8, duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, "go+=0.9")
      .to([...bulbs, ...halo], { opacity: 0, duration: 0.5, ease: "power2.in" }, "go+=1.9");

    // the creator: wave, lift the phone, tilt the head, a little bounce, a few words
    show
      // wave from the shoulder: the whole arm lifts and swings (+ = up), never into her hair
      .to(wave, { rotation: 10, duration: 0.28, ease: "sine.inOut" }, "go")
      .to(wave, { rotation: -6, duration: 0.3, ease: "sine.inOut" }, "go+=0.28")
      .to(wave, { rotation: 9, duration: 0.3, ease: "sine.inOut" }, "go+=0.58")
      .to(wave, { rotation: -4, duration: 0.3, ease: "sine.inOut" }, "go+=0.88")
      .to(wave, { rotation: 0, duration: 0.4, ease: "sine.inOut" }, "go+=1.18")
      .to(phone, { rotation: -5, duration: 0.45, ease: "power2.out" }, "go")
      .to(phone, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, "go+=1.3")
      .to(head, { rotation: 4, duration: 0.45, ease: "sine.inOut" }, "go")
      .to(head, { rotation: -2, duration: 0.5, ease: "sine.inOut" }, "go+=0.6")
      .to(head, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, "go+=1.3")
      .to(creator, { yPercent: -0.8, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, "go");
    talkFrames(show, mouthSmall, mouthWide, show.labels.go + 0.15, 8);

    const blinking = blinkFrames(eyes, eyesHalf);
    const breathing = gsap.to(creator, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [show, blinking, breathing];
  });
}

/**
 * Floor 3 · AI creatives. Every 3 seconds the strategist explains his idea:
 * he lifts his pencil hand off the tablet (the forearm, from the elbow) and
 * marks his points with it, tilts his head and talks, while the wall's stars
 * shine. He blinks and breathes all the time, and the sticky notes on the
 * wall flutter gently, each in its own rhythm.
 */
export function useAiCreativesStudio() {
  return usePuppet((q) => {
    const [strategist, head, eyes, eyesHalf, mouthSmall, mouthWide, forearm, notes, stars, glows] = [
      q("strategist"), q("head"), q("eyes"), q("eyes-half"), q("mouth-small"), q("mouth-wide"),
      q("forearm"), q("note"), q("star"), q("star-glow"),
    ];

    const show = gsap.timeline({ repeat: -1, delay: 0.6 });
    show.to({}, { duration: 3 }).addLabel("go"); // 3 s rest, then he explains and the stars shine

    // stars: each one swells, turns a little and glows, one after another
    show
      .to(stars, { scale: 1.3, rotation: 12, duration: 0.4, ease: "power2.out", stagger: 0.15 }, "go")
      .to(glows, { opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.15 }, "go")
      .to(stars, { scale: 1, rotation: 0, duration: 0.6, ease: "power2.inOut", stagger: 0.15 }, "go+=0.55")
      .to(glows, { opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.15 }, "go+=0.55");

    // the phrase, and the gestures timed to it
    const go = show.labels.go;
    const end = talkFrames(show, mouthSmall, mouthWide, go + 0.2, 10);
    show
      // pencil hand comes up off the tablet (+ = up), beats twice on his points, settles back
      .to(forearm, { rotation: 11, duration: 0.5, ease: "power2.out" }, go)
      .to(forearm, { rotation: 7, duration: 0.25, ease: "sine.inOut" }, go + 0.7)
      .to(forearm, { rotation: 11, duration: 0.25, ease: "sine.inOut" }, go + 0.95)
      .to(forearm, { rotation: 8, duration: 0.25, ease: "sine.inOut" }, go + 1.3)
      .to(forearm, { rotation: 10, duration: 0.25, ease: "sine.inOut" }, go + 1.55)
      .to(forearm, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, end - 0.1)
      // head: tilts as he starts, turns back the other way mid-sentence, then straight
      .to(head, { rotation: -2.5, duration: 0.5, ease: "sine.inOut" }, go)
      .to(head, { rotation: 1.5, duration: 0.6, ease: "sine.inOut" }, go + 0.8)
      .to(head, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, end - 0.2)
      .to(strategist, { yPercent: -0.4, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 1 }, go + 0.1);

    // sticky notes: a gentle flutter from the top edge where they are stuck
    const flutter = notes.map((note, i) =>
      gsap.fromTo(
        note,
        { rotation: i % 2 ? 1.8 : -1.8, skewX: i % 2 ? -1.2 : 1.2 },
        { rotation: i % 2 ? -1.8 : 1.8, skewX: i % 2 ? 1.2 : -1.2, duration: gsap.utils.random(1.1, 1.5), ease: "sine.inOut", yoyo: true, repeat: -1 }
      ).seek(gsap.utils.random(0, 2)) // each note starts at a different point of its flutter
    );

    const blinking = blinkFrames(eyes, eyesHalf);
    const breathing = gsap.to(strategist, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [show, blinking, breathing, ...flutter];
  });
}

/**
 * Floor 4 · Print. The reader reads line by line: his head follows the line
 * while his lips murmur the words, then drops back to the start of the next
 * line; after two lines he snaps the paper straight (the right page flexes).
 * His hands are never quite still, he blinks and breathes. The hanging signs
 * swing gently and light up in their own colour, one after another every 2 s.
 */
export function usePrintStudio() {
  return usePuppet((q) => {
    const [reader, head, eyes, eyesHalf, mouthSmall, mouthWide, paper, page, signs, glows, lights] = [
      q("reader"), q("head"), q("eyes"), q("eyes-half"), q("mouth-small"), q("mouth-wide"),
      q("paper"), q("page"), q("sign"), q("sign-glow"), q("sign-light"),
    ];

    // reading: two lines, then a snap of the paper and a short pause
    const reading = gsap.timeline({ repeat: -1, delay: 0.4 });
    const readLine = (at: number) => {
      reading.to(head, { xPercent: 0.5, duration: 1.8, ease: "sine.inOut" }, at); // eyes along the line
      talkFrames(reading, mouthSmall, mouthWide, at + 0.15, 7);
      reading
        .to(head, { xPercent: -0.5, duration: 0.45, ease: "power2.inOut" }, at + 1.85) // back to the next line
        .to(head, { rotation: 0.8, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 1 }, at + 1.85);
    };
    gsap.set(head, { xPercent: -0.5 });
    readLine(0);
    readLine(2.4);
    reading
      .to(paper, { yPercent: -1.2, duration: 0.14, ease: "power2.out" }, 4.9) // snap!
      .to(paper, { yPercent: 0, duration: 0.4, ease: "power2.inOut" }, 5.04)
      .to(page, { rotation: -2, duration: 0.12, ease: "power1.out" }, 4.9)
      .to(page, { rotation: 1.2, duration: 0.18, ease: "sine.inOut" }, 5.02)
      .to(page, { rotation: 0, duration: 0.3, ease: "sine.out" }, 5.2)
      .to({}, { duration: 1 }, 5.6); // a moment before the next line

    // hands holding the paper are never perfectly still
    const holding = gsap.fromTo(paper, { rotation: -0.5 }, { rotation: 0.5, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // hanging signs: a gentle swing each, out of step with one another
    const swing = signs.map((sign, i) =>
      gsap.fromTo(
        sign,
        { rotation: i % 2 ? 2.2 : -2.2 },
        { rotation: i % 2 ? -2.2 : 2.2, duration: gsap.utils.random(1.5, 1.9), ease: "sine.inOut", yoyo: true, repeat: -1 }
      ).seek(gsap.utils.random(0, 1.5))
    );

    // the signs light up one by one, one every 2 s (NEW orange, SALE blue, OPEN yellow)
    const shine = gsap.timeline({ repeat: -1, delay: 1 });
    signs.forEach((_, i) => {
      shine
        .to([glows[i], lights[i]], { opacity: 1, duration: 0.35, ease: "power2.out" }, i * 2)
        .to([glows[i], lights[i]], { opacity: 0, duration: 0.7, ease: "power2.in" }, i * 2 + 0.8);
    });
    shine.set({}, {}, signs.length * 2);

    const blinking = blinkFrames(eyes, eyesHalf);
    const breathing = gsap.to(reader, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [reading, holding, shine, blinking, breathing, ...swing];
  });
}

/**
 * Floor 5 · Radio. The host talks to her listeners in sentences: her free arm
 * comes off her hip (from the shoulder) and marks her words, her head tilts as
 * she speaks, and she pauses between sentences. She blinks and breathes. The
 * acoustic panels sway like curtains in a soft draught, a wave running across
 * the wall, and every 3 seconds the ON AIR sign flickers on and glows red.
 */
export function useRadioStudio() {
  return usePuppet((q) => {
    const [host, head, arm, eyes, eyesHalf, closed, small, panels, glow, light] = [
      q("host"), q("head"), q("arm"), q("eyes"), q("eyes-half"), q("mouth-closed"), q("mouth-small"),
      q("panel"), q("on-air-glow"), q("on-air-light"),
    ];

    // on air: two sentences with a breath between, then a longer pause
    const talking = gsap.timeline({ repeat: -1, delay: 0.5 });
    const first = talkOverOpenArt(talking, closed, small, 0, 12);
    talking
      // the free arm leaves her hip, beats on the words, then rests again (- = out from the hip)
      .to(arm, { rotation: -6, duration: 0.5, ease: "power2.out" }, 0.1)
      .to(arm, { rotation: -3.5, duration: 0.25, ease: "sine.inOut" }, 0.8)
      .to(arm, { rotation: -6, duration: 0.25, ease: "sine.inOut" }, 1.05)
      .to(arm, { rotation: -4, duration: 0.25, ease: "sine.inOut" }, 1.5)
      .to(arm, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, first - 0.2)
      .to(head, { rotation: 1.5, duration: 0.6, ease: "sine.inOut" }, 0)
      .to(head, { rotation: -1, duration: 0.7, ease: "sine.inOut" }, 0.9);
    const secondAt = first + 0.7;
    const second = talkOverOpenArt(talking, closed, small, secondAt, 9);
    talking
      .to(head, { rotation: 1, duration: 0.6, ease: "sine.inOut" }, secondAt)
      .to(head, { rotation: 0, duration: 0.6, ease: "sine.inOut" }, second - 0.1)
      .to(arm, { rotation: -3, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, secondAt + 0.3)
      .to(host, { yPercent: -0.3, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 1 }, secondAt)
      .to({}, { duration: 1.6 }, second); // listening to the next caller

    // ON AIR: 3 s off, then it flickers on like a neon tube, glows red, and fades
    const onAir = gsap.timeline({ repeat: -1 });
    onAir
      .to({}, { duration: 3 })
      .set([glow, light], { opacity: 0.8 })
      .set([glow, light], { opacity: 0.15 }, "+=0.07")
      .set([glow, light], { opacity: 1 }, "+=0.06")
      .to([glow, light], { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.9");

    // acoustic panels: a gentle sway, rippling across the wall column by column
    const sway = gsap.fromTo(
      panels,
      { rotation: -1.3, skewX: 1 },
      {
        rotation: 1.3, skewX: -1, duration: 1.6, ease: "sine.inOut",
        stagger: { each: 0.12, grid: [4, 5], from: "start", axis: "x", yoyo: true, repeat: -1 },
      }
    );

    const blinking = blinkFrames(eyes, eyesHalf);
    const breathing = gsap.to(host, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [talking, onAir, sway, blinking, breathing];
  });
}

/**
 * Singing: a run of notes. Each note is the art's own open mouth or a wide
 * "aah" held a little longer, with a quick humming close between some notes.
 * Returns when the phrase ends (the mouth back on the art's note).
 */
function sing(timeline: gsap.core.Timeline, hum: Element[], wide: Element[], at: number, notes: number) {
  let t = at;
  for (let i = 0; i < notes; i++) {
    const held = Math.random() < 0.45;
    const length = held ? gsap.utils.random(0.35, 0.65) : gsap.utils.random(0.2, 0.38);
    if (held) timeline.set(wide, { opacity: 1 }, t).set(wide, { opacity: 0 }, t + length);
    t += length;
    if (Math.random() < 0.35) {
      const close = gsap.utils.random(0.08, 0.14);
      timeline.set(hum, { opacity: 1 }, t).set(hum, { opacity: 0 }, t + close);
      t += close;
    }
  }
  return t;
}

/**
 * Floor 6 · Events. The singer sings in phrases: his mouth follows the notes,
 * his free arm opens out to the audience from the shoulder and drifts with the
 * melody, his head sways and lifts on the long notes, and he takes a breath
 * (lips closed) between phrases. He blinks, breathes and sways from the feet.
 * The curtains sway in a soft ripple, and as the lift doors open a shower of
 * confetti falls once and stays on the stage floor.
 */
export function useEventsStage() {
  return usePuppet((q) => {
    const [singer, head, arm, eyes, eyesHalf, hum, wide, curtains, confetti] = [
      q("singer"), q("head"), q("arm"), q("eyes"), q("eyes-half"), q("mouth-hum"), q("mouth-wide"),
      q("curtain"), q("confetti"),
    ];

    // the song: two phrases, each followed by a breath
    const song = gsap.timeline({ repeat: -1, delay: 0.4 });
    const phrase = (at: number, notes: number, reach: number) => {
      const end = sing(song, hum, wide, at, notes);
      song
        // the arm rises out to the audience (+ = up), floats on the melody, then settles
        .to(arm, { rotation: reach, duration: 0.9, ease: "sine.inOut" }, at)
        .to(arm, { rotation: reach - 3, duration: 0.7, ease: "sine.inOut" }, at + 1.1)
        .to(arm, { rotation: reach - 1, duration: 0.6, ease: "sine.inOut" }, at + 1.8)
        .to(arm, { rotation: 0, duration: 0.8, ease: "sine.inOut" }, end - 0.3)
        // the head sways with the line and lifts a little into it
        .to(head, { rotation: -1.4, duration: 0.8, ease: "sine.inOut" }, at)
        .to(head, { rotation: 1, duration: 0.9, ease: "sine.inOut" }, at + 1)
        .to(head, { rotation: 0, duration: 0.6, ease: "sine.inOut" }, end - 0.2)
        // breath between phrases: lips together
        .set(hum, { opacity: 1 }, end)
        .set(hum, { opacity: 0 }, end + 0.55);
      return end + 0.6;
    };
    const second = phrase(0, 8, 10);
    phrase(second, 7, 6);

    // the whole figure sways gently to the music, from his feet
    const sway = gsap.fromTo(singer, { rotation: -0.5 }, { rotation: 0.5, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // curtains: a soft ripple from the top, strip by strip
    const curtainSway = gsap.fromTo(
      curtains,
      { skewX: -0.6 },
      { skewX: 0.6, duration: 2.2, ease: "sine.inOut", stagger: { each: 0.25, yoyo: true, repeat: -1 } }
    );

    // confetti: waits behind the valance, then showers down once as the lift doors
    // open, each piece fluttering down on its own, and stays lying on the stage floor
    gsap.set(confetti, { top: () => `${gsap.utils.random(0.5, 3)}%` });
    const shower = () => {
      confetti.forEach((piece) => {
        const start = gsap.utils.random(0, 1.4); // a gentle shower, not a burst
        const fall = gsap.utils.random(2.4, 3.2);
        gsap
          .timeline({ delay: start })
          .to(piece, { top: `${gsap.utils.random(86, 96)}%`, rotation: `+=${gsap.utils.random(180, 540)}`, duration: fall, ease: "sine.in" }, 0)
          .to(piece, { x: gsap.utils.random(6, 14) * (Math.random() < 0.5 ? -1 : 1), duration: fall / 4, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0)
          .to(piece, { scaleY: -1, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: Math.round(fall / 0.25) - 1 }, 0)
          .to(piece, { scaleY: 0.45, duration: 0.2, ease: "power2.out" }, fall); // lands flat on the floor
      });
    };
    const scene = confetti[0]?.closest('[data-lift="scene"]');
    const doorsOpen = scene?.closest<HTMLElement>("[data-doors]")?.dataset.doors !== "closed";
    if (doorsOpen) shower(); // already standing open (e.g. the lift started on this floor)
    else scene?.addEventListener(LIFT_DOORS_OPEN, shower, { once: true });

    const blinking = blinkFrames(eyes, eyesHalf);
    const breathing = gsap.to(singer, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [song, sway, curtainSway, blinking, breathing];
  });
}

/**
 * Floor 7 · Artists. She waves hello: the forearm and hand swing from the
 * elbow (the arm follows a little from the shoulder), and she smiles as she
 * waves (a smile, a bright open smile on "hel-lo", then a smile again), with a
 * small head tilt and bounce. Then a pause. The gold star shines every 3 s.
 */
export function useArtistsCarpet() {
  return usePuppet((q) => {
    const [artist, head, arm, forearm, smile, smileOpen, star, glow, gleam] = [
      q("artist"), q("head"), q("arm"), q("forearm"), q("smile"), q("smile-open"),
      q("star"), q("star-glow"), q("star-gleam"),
    ];

    // hello: smile, wave, "hel-lo", smile on, then back to rest
    const hello = gsap.timeline({ repeat: -1, delay: 0.6, repeatDelay: 2.2 });
    hello
      .set(smile, { opacity: 1 }, 0)
      .to(forearm, { rotation: -12, duration: 0.3, ease: "sine.inOut" }, 0.15)
      .to(forearm, { rotation: 10, duration: 0.32, ease: "sine.inOut" }, 0.45)
      .to(forearm, { rotation: -10, duration: 0.32, ease: "sine.inOut" }, 0.77)
      .to(forearm, { rotation: 8, duration: 0.32, ease: "sine.inOut" }, 1.09)
      .to(forearm, { rotation: -6, duration: 0.3, ease: "sine.inOut" }, 1.41)
      .to(forearm, { rotation: 0, duration: 0.35, ease: "sine.out" }, 1.71)
      .to(arm, { rotation: -2, duration: 0.6, ease: "sine.inOut" }, 0.15)
      .to(arm, { rotation: 1.5, duration: 0.7, ease: "sine.inOut" }, 0.75)
      .to(arm, { rotation: 0, duration: 0.6, ease: "sine.inOut" }, 1.45)
      .to(head, { rotation: 2, duration: 0.5, ease: "sine.inOut" }, 0.1)
      .to(head, { rotation: 0, duration: 0.6, ease: "sine.inOut" }, 1.9)
      .to(artist, { yPercent: -0.35, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.4)
      // "hel" … "lo": the smile opens, closes a moment, opens again
      .set(smileOpen, { opacity: 1 }, 0.45).set(smileOpen, { opacity: 0 }, 0.7)
      .set(smileOpen, { opacity: 1 }, 0.82).set(smileOpen, { opacity: 0 }, 1.25)
      .set(smile, { opacity: 0 }, 2.5);

    // the star: 3 s rest, then a warm glow, a little swell and a gleam across it
    const shine = gsap.timeline({ repeat: -1 });
    shine
      .to({}, { duration: 3 })
      .addLabel("shine")
      .to(glow, { opacity: 1, duration: 0.4, ease: "power2.out" }, "shine")
      .to(star, { scale: 1.06, duration: 0.4, ease: "power2.out" }, "shine")
      .fromTo(gleam, { left: "-40%", opacity: 1 }, { left: "110%", duration: 0.8, ease: "power1.inOut", immediateRender: false }, "shine+=0.1")
      .to(star, { scale: 1, duration: 0.6, ease: "power2.inOut" }, "shine+=0.6")
      .to(glow, { opacity: 0, duration: 0.7, ease: "power2.in" }, "shine+=0.6");

    const breathing = gsap.to(artist, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [hello, shine, breathing];
  });
}

/**
 * Floor 8 · Digital. Every 3 seconds the strategist explains: her hand lifts
 * off the laptop (forearm from the elbow) and marks her points, she talks and
 * tilts her head, and the heart and star badges shine. Behind her the chart
 * keeps growing: the trend line draws up to its arrow while each bar rises as
 * the line reaches it, then it glows, dips and grows again. She blinks and breathes.
 */
export function useDigitalGrowth() {
  return usePuppet((q) => {
    const [strategist, head, eyes, eyesHalf, mouthSmall, mouthWide, forearm, bars, trend, trendGlow, badges, badgeGlows, gleams] = [
      q("strategist"), q("head"), q("eyes"), q("eyes-half"), q("mouth-small"), q("mouth-wide"), q("forearm"),
      q("bar"), q("trend"), q("trend-glow"), q("badge"), q("badge-glow"), q("badge-gleam"),
    ];

    const show = gsap.timeline({ repeat: -1, delay: 0.6 });
    show.to({}, { duration: 3 }).addLabel("go");
    const go = show.labels.go;

    // the chart keeps growing, on its own loop: the trend line draws up to its arrow
    // and each bar rises as the line reaches it, together; the arrow glows at the
    // top, then the chart dips and grows again
    const DRAW = 2.6;
    const BAR_LEFTS = [7.56, 21.94, 36.31, 50.68, 65.05, 79.43]; // % of the board, as in the component
    gsap.set(bars, { scaleY: 0.06 });
    gsap.set(trend, { clipPath: "inset(0% 100% 0% 0%)" });
    const chart = gsap.timeline({ repeat: -1, delay: 0.3 });
    chart.to(trend, { clipPath: "inset(0% 0% 0% 0%)", duration: DRAW, ease: "none" }, 0);
    bars.forEach((bar, i) => chart.to(bar, { scaleY: 1, duration: 0.55, ease: "back.out(1.5)" }, (DRAW * BAR_LEFTS[i]) / 100));
    chart
      .to(trendGlow, { opacity: 1, duration: 0.3, ease: "power2.out" }, DRAW - 0.1)
      .to(trendGlow, { opacity: 0.35, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 1 }, DRAW + 0.2)
      .to(trendGlow, { opacity: 0, duration: 0.4, ease: "power2.in" }, DRAW + 1)
      .to(bars, { scaleY: 0.06, duration: 0.35, ease: "power2.in" }, DRAW + 1.5)
      .to(trend, { clipPath: "inset(0% 100% 0% 0%)", duration: 0.35, ease: "power2.in" }, DRAW + 1.5)
      .to({}, { duration: 0.15 });

    // heart, then star: glow, swell, gleam
    badges.forEach((badge, i) => {
      const at = go + 0.2 + i * 0.35;
      show
        .to(badgeGlows[i], { opacity: 1, duration: 0.35, ease: "power2.out" }, at)
        .to(badge, { scale: 1.12, duration: 0.35, ease: "power2.out" }, at)
        .fromTo(gleams[i], { left: "-50%", opacity: 1 }, { left: "110%", duration: 0.6, ease: "power1.inOut", immediateRender: false }, at + 0.1)
        .to(badge, { scale: 1, duration: 0.5, ease: "power2.inOut" }, at + 0.55)
        .to(badgeGlows[i], { opacity: 0, duration: 0.6, ease: "power2.in" }, at + 0.55);
    });

    // the strategist explains: hand up off the laptop (+ = up), a few beats, words, head tilts
    const end = talkFrames(show, mouthSmall, mouthWide, go + 0.2, 9);
    show
      .to(forearm, { rotation: 10, duration: 0.5, ease: "power2.out" }, go)
      .to(forearm, { rotation: 6.5, duration: 0.25, ease: "sine.inOut" }, go + 0.7)
      .to(forearm, { rotation: 10, duration: 0.25, ease: "sine.inOut" }, go + 0.95)
      .to(forearm, { rotation: 7.5, duration: 0.25, ease: "sine.inOut" }, go + 1.35)
      .to(forearm, { rotation: 9, duration: 0.25, ease: "sine.inOut" }, go + 1.6)
      .to(forearm, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, end - 0.1)
      .to(head, { rotation: -2, duration: 0.5, ease: "sine.inOut" }, go)
      .to(head, { rotation: 1.5, duration: 0.6, ease: "sine.inOut" }, go + 0.8)
      .to(head, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, end - 0.2)
      .to(strategist, { yPercent: -0.4, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 1 }, go + 0.1);

    const blinking = blinkFrames(eyes, eyesHalf);
    const breathing = gsap.to(strategist, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [show, chart, blinking, breathing];
  });
}
