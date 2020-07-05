import * as functions from 'firebase-functions';

function calculateScore(a: number, b: number) {
    const diff = Math.abs(a - b);
    if (diff < 10) {
        return 10;
    } else if (diff < 20) {
        return 5;
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
                // return app.database().ref().set(99);
                return root.child('rounds').child(k).child('cloudScore').set(score);
            });
    });


