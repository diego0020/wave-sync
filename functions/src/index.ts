import * as functions from 'firebase-functions';

function calculateScore(a: number, b: number) {
    const diff = Math.abs(a - b);
    if (diff < 4) {
        return 4;
    } else if (diff < 12) {
        return 3;
    }
    else if (diff < 20) {
        return 2;
    }
    return 0;
}

exports.writeScore = functions.database.ref('/finalGuesses/{roundId}')
    .onCreate((snap, context) => {
        const values = snap.val();
        const k = snap.key;
        const finalGuess = values.value;
        const root = snap.ref.root;
        return root.child('roundsPrivate').child(k).child('truePosition').once('value')
            .then(trueValueSnap => {
                const trueValue = trueValueSnap.val();
                const score = calculateScore(finalGuess, trueValue);
                functions.logger.log("this is the snap:", k, values);
                const updates = {
                    [`rounds/${k}/cloudScore`]: score,
                    [`rounds/${k}/score`]: score,
                    [`rounds/${k}/trueValue`]: trueValue,
                };
                // return app.database().ref().set(99);
                return root.update(updates);
            });
    });
