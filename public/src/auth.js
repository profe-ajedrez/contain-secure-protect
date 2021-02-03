"use strict";

(function () {


  function updateAppState() {
    switch (application.state) {
      case states.OUT:
        application.ui.nav.signupLink.style.display = 'block';
        application.ui.nav.signinLink.style.display = 'block';
        application.ui.nav.logout.style.display = 'none';
        application.ui.nav.openbtn.style.display = 'none';
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        break;
      case states.IN:
        application.ui.nav.signupLink.style.display = 'none';
        application.ui.nav.signinLink.style.display = 'none';
        application.ui.nav.logout.style.display = 'block';
        application.ui.nav.openbtn.style.display = 'block';
        document.getElementById("openbtn").style.display = "none";
        document.getElementById("mySidebar").style.width = "18rem";
        document.getElementById("main").style.marginLeft = "18rem";
        break;
    }

  }


  function onLoginSuccess() {
    application.state = states.IN;
    updateAppState();
  }

  function onLogoutSuccess() {
    application.state = states.OUT;
    updateAppState();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const signupform = document.getElementById("signup-form"),
      signinform = document.getElementById("signin-form"),
      logoutBtn = document.getElementById("logout");

    /** Mail sign up handler */
    signupform.addEventListener("click", (e) => {
      e.preventDefault();

      const signupMail = document.getElementById("signup-mail");
      const signupPass = document.getElementById("signup-pass");

      application.authSystem
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

      application.authSystem
        .signInWithEmailAndPassword(signinMail.value, signinPass.value)
        .then((usercredential) => {
          console.log("signed in");
          signinform.reset();
          const modal = document.getElementById("signinmodal");
          const bsModal = bootstrap.Modal.getInstance(modal);
          bsModal.hide();
          onLoginSuccess();
        })
        .catch((err) => {
          console.log(err);
          onLogoutSuccess();
        });
    });

    /* Google login */

    const googleButton = document.getElementById("google-signin");

    googleButton.addEventListener("click", (e) => {
      const gProvider = new firebase.auth.GoogleAuthProvider();
      gProvider.setCustomParameters({
        login_hint: "user@example.com",
      });

      application.authSystem.useDeviceLanguage();
      application.authSystem.signInWithRedirect(gProvider);
    });

    application.authSystem
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
          onLoginSuccess();
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
        onLogoutSuccess();
      });

    /* Logout */
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      application.authSystem.signOut().then(() => {
        console.log("loged out");
        onLogoutSuccess();
      });
    });



    application.authSystem.onAuthStateChanged(function (user) {
      if (user) {
        onLoginSuccess();
        application.user = user;
      } else {
        onLogoutSuccess();
        application.user = null;
      }
    });

  });
})();
