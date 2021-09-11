class ShadowTabs{
  constructor(triggers, bodyes){
      this.triggers = document.querySelectorAll(triggers);
      this.bodyes =  document.querySelectorAll(bodyes);
  }
  setClick(){
      this.triggers.forEach((trigger,i)=>{
          trigger.onclick = ()=>{
              this.update(i);
          }
      });
  }

  update(active){
      for(let x = 0; x < this.triggers.length; x++){
          this.triggers[x].classList.remove('active');
          this.bodyes[x].classList.remove('show');
      }
      this.triggers[active].classList.add('active');
      this.bodyes[active].classList.add('show');
  }
  create(){
      if(this.triggers && this.bodyes && this.triggers.length == this.bodyes.length && this.triggers.length != 0 && this.bodyes.length != 0){
        console.log(this.triggers.length);
        console.log(this.bodyes.length);
          this.update(0);
          this.setClick();
      }
      else{
          return 'nothing was found';
      }
  }
}

// const url = 'https://json.medrating.org/users/',
//       app = document.querySelector('.content__list');

// GET(url).then(function(response) {
//     //app.append(createImage(response));
//     response.forEach((user,index) => {
//       if(user.name) {
//         console.log(user.name, index)
//         app.append(createText(user.name))
//       }
//     })
// });

// async function GET(url) {
//     let request = await fetch(url);
//     let response = await request.json();
//     return response;
// }

// function createImage(src) {
//     let image = document.createElement('img');
//     image.setAttribute('src', src);
//     return image;
// }

// function createText(text) {
//     let userName = document.createElement('h2');
//     userName.textContent = text;
//     return userName;
// }

let tabs = new ShadowTabs('.heading__tabs-item', '.content');
tabs.create();
DropdownItems('.content__two-level', '.content__two-level .dropdown__wrapper', '.content__three-level', '.dropdown');
DropdownItems('.content__list-item', '.dropdown__wrapper', '.content__hidden', '.dropdown');


function DropdownItems(items, trigger, hidden, text) {
    let _items = document.querySelectorAll(items);
    if (!_items) return false;
    _items.forEach(item => {
        const Trigger = item.querySelector(trigger),
            Hidden = item.querySelector(hidden),
            Text = item.querySelector(text);
        Trigger.onclick = function() {
            this.classList.toggle('active');
            Hidden.classList.toggle('show');
            Hidden.classList.contains('show') ? Hidden.style.height = Hidden.scrollHeight + 'px' : Hidden.style.height = '';
            if (Trigger.classList.contains('active')) {
                Text.style.backgroundColor = 'rgba(255, 175, 55, 1)';
                Text.textContent = "-";
            } else {
                Text.style.backgroundColor = 'rgba(17, 125, 193, 1)';
                Text.textContent = "+";
            }
        }
    });
}