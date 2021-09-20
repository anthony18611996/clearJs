let modalBackground = document.getElementById("modal-background");
let closeBtn = document.getElementById("close-btn");

function openModal(url) {
  const _container = document.getElementById("modal");
  modalBackground.style.display = "block";
  _container.append(createImage(url));

  closeBtn.addEventListener("click", function () {
    modalBackground.style.display = "none";
    ClearImage();
  });

  window.addEventListener("click", function (event) {
    if (event.target === modalBackground) {
      modalBackground.style.display = "none";
      ClearImage();
    }
  });

  const ClearImage = () => {
    _container.childNodes.forEach((img) => {
      img.remove();
    });
  };
}

function createImage(src) {
  let image = document.createElement("img");
  image.setAttribute("src", src);
  return image;
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
        this.update(0);
        this.setClick();
      } else {
        return "nothing was found";
      }
    }
  }

  const url = "https://json.medrating.org/users/",
    app = document.querySelector(".content__list"),
    errorBlock = `
    <div class="server-error d-flex">
    <div class="server-error__image">
      <img src="./assets/img/servererror.png" alt="" />
    </div>
    <div class="server-error__text">
      <div class="server-error__title">
      <h2>Сервер не отвечает</h2>
      </div>
      <div class="server-error__desc">
        <p>уже работаем над этим</p>
      </div>
    </div>
  </div>
    `,
    errorHtml = document.querySelector(".server-error");
  let loader = `
    <div class="load-wrap d-none">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `;

  GET(url)
    .then(function (response) {
      document.body.classList.add("loaded");
      const filteredUsers = response.filter((user) => user.name !== undefined);
      DrawDoctorsList("#doctors__list", filteredUsers);
    })
    .catch((error) => {
      errorHtml.classList.remove("hide");
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
                      
                  </div>
              <h2>${item.username}</h2>
          </div>
          <ul class="content__hidden show">
  
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

    container.innerHTML += loader;

    const Toggle = () => {
      container.querySelector(".load-wrap").classList.toggle("d-none");
      container.querySelector(".load-wrap").classList.toggle("active");
      show = !show;
      if (show) {
        GET(`https://json.medrating.org/albums?userId=${id}`)
          .then(function (response) {
            dropdown.classList.add("active");
            container.classList.add("show");
            response.forEach((album) => {
              const twoLevel = `
            <li class="content__two-level">
            <div class="dropdown__wrapper">
              <div class="dropdown">
                
              </div>
              <p>${album.title}</p>
            </div>
            <ul class="content__three-level show">
  
            </ul>
          </li>
            `;
              container.querySelector(".load-wrap").classList.add("d-none");
              container.innerHTML += twoLevel;
              setupAlbumsPhotos(container, album.id);
            });
          })
          .catch((error) => {
            container.innerHTML += errorBlock;
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

    container.innerHTML = loader;

    const Toggle = () => {
      container.querySelector(".load-wrap").classList.toggle("d-none");
      container.querySelector(".load-wrap").classList.toggle("active");
      show = !show;
      if (show) {
        GET(`https://json.medrating.org/photos?albumId=${id}`)
          .then(function (response) {
            dropdown.classList.add("active");
            container.classList.add("show");
            response.forEach((photo) => {
              let li = document.createElement("li");
              const threeLevel = `
              <img src="${photo.thumbnailUrl}" alt="" title="${photo.title}" data-photo-id="${photo.id}" onclick="openModal('${photo.thumbnailUrl}');">
              <div class="favorite__button" data-is-active="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M8.0868 1.04641C8.43933 0.256421 9.56067 0.25642 9.9132 1.0464L11.9048 5.50932L16.767 6.02193C17.628 6.1127 17.9746 7.1804 17.3311 7.75964L13.7 11.0284L14.7145 15.8063C14.8943 16.6527 13.9869 17.3124 13.2371 16.8805L9 14.4393L4.76287 16.8805C4.01306 17.3124 3.10573 16.6527 3.28547 15.8063L4.3 11.0284L0.668853 7.75964C0.0253845 7.1804 0.372042 6.1127 1.23305 6.02193L6.09524 5.50932L8.0868 1.04641Z" fill="#D0D0D0"/>
                </svg>
              </div>
            `;
              container.querySelector(".load-wrap").classList.add("d-none");
              li.innerHTML += threeLevel;
              container.append(li);
              let _btns = li.querySelector(".favorite__button");
              let star = _btns.querySelector("svg path");
              let ddd = document.querySelector(
                ".content__three-level.show.favorites"
              );
              _btns.onclick = function () {
                const isFavorite = isInFavorite(photo);
                if (isFavorite) {
                  removeFromFavorites(photo);
                  star.classList.remove("active");
                  DrawFavoritesList();
                } else {
                  addToFavorites(photo);
                  star.classList.add("active");
                  ddd.childNodes.forEach((item) => item.remove());
                  DrawFavoritesList();
                }
              };
            });
          })
          .catch((error) => {
            container.innerHTML += errorBlock;
          });
      } else {
        Clear();
      }
    };
    dropdown.onclick = Toggle;
  }

  function addToFavorites(favorite) {
    const storage = localStorage.getItem("favorites");

    if (storage) {
      let tmp = JSON.parse(storage);
      localStorage.setItem("favorites", JSON.stringify([...tmp, favorite]));
    } else {
      localStorage.setItem("favorites", JSON.stringify([favorite]));
    }
  }

  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites"));
  }

  function removeFromFavorites(favorite) {
    const storage = localStorage.getItem("favorites");

    let tmp = JSON.parse(storage);
    tmp = tmp.filter((item) => item.id !== favorite.id);
    localStorage.setItem("favorites", JSON.stringify(tmp));
  }

  function isInFavorite(favorite) {
    const storage = localStorage.getItem("favorites");
    if (!storage) return false;
    let tmp = JSON.parse(storage);

    return tmp.find((item) => item.id === favorite.id);
  }

  DrawFavoritesList();

  function DrawFavoritesList() {
    const container = document.querySelector(
        ".content__three-level.show.favorites"
      ),
      noFavoriteContainer = document.querySelector(".favorites__wrapper");
      let hide = document.querySelector("#favorites");
    container.childNodes.forEach((item) => item.remove());
    if (getFavorites()) {
      getFavorites().forEach((photo) => {
        const favoriteLevel = `
        <img src="${photo.thumbnailUrl}" alt="" title="${photo.title}">
        <div class="favorite__button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path class="active" d="M8.0868 1.04641C8.43933 0.256421 9.56067 0.25642 9.9132 1.0464L11.9048 5.50932L16.767 6.02193C17.628 6.1127 17.9746 7.1804 17.3311 7.75964L13.7 11.0284L14.7145 15.8063C14.8943 16.6527 13.9869 17.3124 13.2371 16.8805L9 14.4393L4.76287 16.8805C4.01306 17.3124 3.10573 16.6527 3.28547 15.8063L4.3 11.0284L0.668853 7.75964C0.0253845 7.1804 0.372042 6.1127 1.23305 6.02193L6.09524 5.50932L8.0868 1.04641Z" fill="#D0D0D0"/>
          </svg>
        </div>
        <p>${photo.title}</p>
        `;
        let li = document.createElement("li");
        li.innerHTML += favoriteLevel;
        container.append(li);
        let _btns = li.querySelector(".favorite__button");
        let star = _btns.querySelector("svg path");
        _btns.onclick = function () {
          const isFavorite = isInFavorite(photo);
          if (isFavorite) {
            removeFromFavorites(photo);
            star.classList.remove("active");
            DrawFavoritesList();
          }
        };
        if (favoriteLevel === "" || undefined || getFavorites().length === 0) {
          noFavoriteContainer.classList.remove("hide");
        } else {
          noFavoriteContainer.classList.add("hide");
          hide.classList.remove("d-none");
        }
      });
    }
  }

  let tabs = new ShadowTabs(".heading__tabs-item", ".content");
  tabs.create();
});
