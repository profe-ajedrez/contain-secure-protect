"use strict";

(function () {

  document.addEventListener("DOMContentLoaded", function () {
    const signupform = document.getElementById("signup-form"),
      signinform = document.getElementById("signin-form"),
      logoutBtn = document.getElementById("logout");

    /** Mail sign up handler */
    signupform.addEventListener("click", (e) => {
      e.preventDefault();

      const signupMail = document.getElementById("signup-mail");
      const signupPass = document.getElementById("signup-pass");

      app.authSystem
        .createUserWithEmailAndPassword(signupMail.value, signupPass.value)
        .then((usercredential) => {
          console.log("sign up");
          signupform.reset();
          const modal = document.getElementById("signupmodal");
          const bsModal = mdb.Modal.getInstance(modal);
          bsModal.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    /** Mail sign in handler */
    signinform.addEventListener("click", (e) => {
      e.preventDefault();

      const signinMail = document.getElementById("signin-mail");
      const signinPass = document.getElementById("signin-pass");

      app.authSystem
        .signInWithEmailAndPassword(signinMail.value, signinPass.value)
        .then((usercredential) => {
          console.log("signed in");
          signinform.reset();
          const modal = document.getElementById("signinmodal");
          const bsModal = mdb.Modal.getInstance(modal);
          bsModal.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    /* Google login */

    const googleButton = document.getElementById("google-signin");

    googleButton.addEventListener("click", (e) => {
      const gProvider = new firebase.auth.GoogleAuthProvider();
      gProvider.setCustomParameters({
        login_hint: "user@example.com",
      });

      app.authSystem.useDeviceLanguage();
      app.authSystem.signInWithRedirect(gProvider);
    });

    app.authSystem
      .getRedirectResult()
      .then((result) => {
        if (result.credential) {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // ...
          // The signed-in user info.
          var user = result.user;
          console.log("signed in with google");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(error);
      });

    /* Logout */
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      app.authSystem.signOut().then(() => {
        console.log("loged out");
      });
    });

  });
})();
