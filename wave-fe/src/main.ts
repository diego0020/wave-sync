import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as firebase from 'firebase/app';
import 'firebase/analytics';

import 'focus-visible';

if (environment.production) {
  enableProdMode();
}

const firebaseConfig = {
  apiKey: 'AIzaSyALrxgUY5ce40Bqdd2xo_I16D3Qab8qf_Q',
  authDomain: 'wavesync-6ac09.firebaseapp.com',
  databaseURL: 'https://wavesync-6ac09.firebaseio.com',
  projectId: 'wavesync-6ac09',
  storageBucket: 'wavesync-6ac09.appspot.com',
  messagingSenderId: '423781350664',
  appId: '1:423781350664:web:e0449449bf4521626c00bd',
  measurementId: 'G-XXL76TRHFD'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
