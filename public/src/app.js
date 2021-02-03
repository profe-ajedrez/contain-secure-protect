"use strict";



(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const d = document;
    d.gebi = document.getElementById;

    function buildSidebarItem(item) {
      return (
        "<li><a class='btn' data-item='" +
        item.label +
        "'>" +
        item.icon +
        " " +
        item.label +
        "</a></li>"
      );
    }

    function buildMenu(data) {
      let nav = "";
      for (const item in data) {
        if (data.hasOwnProperty(item)) {
          nav += buildSidebarItem(data[item]);
        }
      }
      return nav;
    }

    function onMenuFetched(snapshot) {
      const nav = d.getElementById("sidenav-container");
      snapshot.docs.forEach((doc) => {
        nav.innerHTML = buildMenu(doc.data());
      });
    }

    const menues = application.db.collection("menu").get().then(onMenuFetched);
  });
})();
