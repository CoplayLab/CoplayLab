/// <reference types="@workadventure/iframe-api-typings" />

console.log("Script started successfully");

const reactionList = document.getElementById(
  "myReactionList"
) as HTMLUListElement;

function updateCounterAndSaveReaction(reactionKey: string) {
  let newReactions = WA.state.loadVariable("reactions") as {
    [key: string]: any;
  };

  if (!newReactions["playerId"].hasOwnProperty(WA.player.id)) {
    for (const [key, reaction] of Object.entries(newReactions)) {
      if (key === reactionKey) {
        reaction.counter++;
        var sound = WA.sound.loadSound(`../public/audios/${reactionKey}.mp3`);
        var config = {
          volume: 0.5,
          loop: false,
          rate: 1,
          detune: 1,
          delay: 0,
          seek: 0,
          mute: false,
        };
        sound.play(config);
      }
    }
    newReactions["playerId"][WA.player.id as string] = reactionKey;
  } else {
    for (const [key, reaction] of Object.entries(newReactions)) {
      if (key === reactionKey && reaction.counter > 0) {
        reaction.counter--;
        delete newReactions["playerId"][WA.player.id as any];
      }
    }
  }
  WA.state
    .saveVariable("reactions", newReactions)
    .catch((e) =>
      console.error("Something went wrong while saving variable", e)
    );
}

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready for reaction.ts");

    let myReactions = WA.state.loadVariable("reactions") as object;
    //console.log((myReactions as { happy: { counter: number } }).happy.counter);

    for (const [key, reaction] of Object.entries(myReactions)) {
      if (key != "playerId") {
        const reactionItem = document.createElement("li");
        reactionItem.classList.add("reaction-item"); // Ajout de la classe pour styliser l'élément

        const emojiSpan = document.createElement("span");
        emojiSpan.classList.add("emoji"); // Ajout de la classe pour styliser l'emoji
        emojiSpan.textContent = reaction.emoji;

        const counterSpan = document.createElement("span");
        counterSpan.classList.add("counter"); // Ajout de la classe pour styliser le compteur
        counterSpan.textContent = String(reaction.counter);

        reactionItem.appendChild(emojiSpan);
        reactionItem.appendChild(counterSpan);
        reactionItem.addEventListener("click", () => {
          updateCounterAndSaveReaction(key);
          counterSpan.textContent = String(reaction.counter);
        });

        reactionList.appendChild(reactionItem);
      }
    }
  })
  .catch((e) => console.error(e));

export {};
