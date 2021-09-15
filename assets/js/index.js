function setValues(id, url, title, isActive) {
  const favoritesItem = {
    url: url,
    title: title,
  };

  if (isActive == "false") {
    localStorage.setItem("item-" + id, JSON.stringify(favoritesItem));
  } else {
    localStorage.removeItem("item-" + id);
  }

}

window.addEventListener("load", function () {
  class ShadowTabs {
    constructor(triggers, bodyes) {
      this.triggers = document.querySelectorAll(triggers);
      this.bodyes = document.querySelectorAll(bodyes);
    }
    setClick() {
      this.triggers.forEach((trigger, i) => {
        trigger.onclick = () => {
          this.update(i);
        };
      });
    }

    update(active) {
      for (let x = 0; x < this.triggers.length; x++) {
        this.triggers[x].classList.remove("active");
        this.bodyes[x].classList.remove("show");
      }
      this.triggers[active].classList.add("active");
      this.bodyes[active].classList.add("show");
    }
    create() {
      if (
        this.triggers &&
        this.bodyes &&
        this.triggers.length == this.bodyes.length &&
        this.triggers.length != 0 &&
        this.bodyes.length != 0
      ) {
        console.log(this.triggers.length);
        console.log(this.bodyes.length);
        this.update(0);
        this.setClick();
      } else {
        return "nothing was found";
      }
    }
  }

  const url = "https://json.medrating.org/users/",
    app = document.querySelector(".content__list");

  GET(url).then(function (response) {
    document.body.classList.add("loaded");
    const filteredUsers = response.filter((user) => user.name !== undefined);
    DrawDoctorsList("#doctors__list", filteredUsers);
  });

  async function GET(url) {
    let request = await fetch(url);
    let response = await request.json();
    return response;
  }

  function DrawDoctorsList(container, list) {
    const _container = document.querySelector(container);

    list.forEach((item) => {
      let listItem = document.createElement("li");
      listItem.classList.add("content__list-item");

      const dropdownWrapper = `
              <div class="dropdown__wrapper">
                  <div class="dropdown">
                      +
                  </div>
              <h2>${item.username}</h2>
          </div>
          <ul class="content__hidden">
  
          </ul>
      `;
      listItem.innerHTML += dropdownWrapper;
      _container.append(listItem);
      setupAlbums(listItem, item.id);
    });
  }

  function setupAlbums(el, id) {
    const dropdown = el.querySelector(".dropdown__wrapper");
    const container = el.querySelector(".content__hidden");
    let show = false;

    const Clear = () => {
      dropdown.classList.remove("active");
      container.classList.remove("show");

      container.childNodes.forEach((item) => {
        item.remove();
      });
    };

    const Toggle = () => {
      show = !show;
      if (show) {
        GET(`https://json.medrating.org/albums?userId=${id}`).then(function (
          response
        ) {
          dropdown.classList.add("active");
          container.classList.add("show");
          response.forEach((album) => {
            const twoLevel = `
            <li class="content__two-level">
            <div class="dropdown__wrapper">
              <div class="dropdown">
                +
              </div>
              <p>${album.title}</p>
            </div>
            <ul class="content__three-level">
  
            </ul>
          </li>
            `;
            container.innerHTML += twoLevel;
            setupAlbumsPhotos(container, album.id);
          });
        });
      } else {
        Clear();
      }
    };
    dropdown.onclick = Toggle;
  }

  function setupAlbumsPhotos(el, id) {
    const dropdown = el.querySelector(".dropdown__wrapper");
    const container = el.querySelector(".content__three-level");
    let show = false;

    const Clear = () => {
      dropdown.classList.remove("active");
      container.classList.remove("show");

      container.childNodes.forEach((item) => {
        item.remove();
      });
    };

    const Toggle = () => {
      show = !show;
      if (show) {
        GET(`https://json.medrating.org/photos?albumId=${id}`).then(function (
          response
        ) {
          dropdown.classList.add("active");
          container.classList.add("show");

          response.forEach((photo) => {
            const threeLevel = `
            <li> 
              <img src="${photo.thumbnailUrl}" alt="" title="${photo.title}" data-photo-id="${photo.id}">
              <div class="favorite__button" data-is-active="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M8.0868 1.04641C8.43933 0.256421 9.56067 0.25642 9.9132 1.0464L11.9048 5.50932L16.767 6.02193C17.628 6.1127 17.9746 7.1804 17.3311 7.75964L13.7 11.0284L14.7145 15.8063C14.8943 16.6527 13.9869 17.3124 13.2371 16.8805L9 14.4393L4.76287 16.8805C4.01306 17.3124 3.10573 16.6527 3.28547 15.8063L4.3 11.0284L0.668853 7.75964C0.0253845 7.1804 0.372042 6.1127 1.23305 6.02193L6.09524 5.50932L8.0868 1.04641Z" fill="#D0D0D0"/>
                </svg>
              </div>
            </li>
            `;
            container.innerHTML += threeLevel;
            let _btns = document.querySelectorAll(".favorite__button");
            _btns.forEach((btn) => {
              btn.onclick = function () {
                let isActive = this.getAttribute("data-is-active"),
                  photoId = this.previousElementSibling.getAttribute("data-photo-id"),
                  photoUrl = this.previousElementSibling.getAttribute("src"),
                  photoTitle = this.previousElementSibling.getAttribute("title"),
                  star = btn.querySelector('svg path');
                setValues(photoId, photoUrl, photoTitle, isActive);
                if (isActive == "false") {
                  this.setAttribute("data-is-active", true);
                  star.style.fill = 'orange';
                } else {
                  this.setAttribute("data-is-active", false);
                  star.style.fill = '';
                }
              };
            });
          });
        });
      } else {
        Clear();
      }
    };
    dropdown.onclick = Toggle;
  }

  let tabs = new ShadowTabs(".heading__tabs-item", ".content");
  tabs.create();
  // DropdownItems(
  //   ".content__two-level",
  //   ".content__two-level .dropdown__wrapper",
  //   ".content__three-level",
  //   ".dropdown"
  // );
  // DropdownItems(
  //   ".content__list-item",
  //   ".dropdown__wrapper",
  //   ".content__hidden",
  //   ".dropdown"
  // );

  function DropdownItems(items, trigger, hidden, text) {
    let _items = document.querySelectorAll(items);
    if (!_items) return false;
    _items.forEach((item) => {
      const Trigger = item.querySelector(trigger),
        Hidden = item.querySelector(hidden),
        Text = item.querySelector(text);
      Trigger.onclick = function () {
        this.classList.toggle("active");
        Hidden.classList.toggle("show");
        Hidden.classList.contains("show")
          ? (Hidden.style.height = Hidden.scrollHeight + "px")
          : (Hidden.style.height = "");
        if (Trigger.classList.contains("active")) {
          Text.style.backgroundColor = "rgba(255, 175, 55, 1)";
          Text.textContent = "-";
        } else {
          Text.style.backgroundColor = "rgba(17, 125, 193, 1)";
          Text.textContent = "+";
        }
      };
    });
  }

  let openBtn = document.getElementById("open-btn");
  let modalBackground = document.getElementById("modal-background");
  let closeBtn = document.getElementById("close-btn");

  openBtn.addEventListener("click", function () {
    modalBackground.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    modalBackground.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modalBackground) {
      modalBackground.style.display = "none";
    }
  });
});
