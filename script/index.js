import api from './api.js';
import store from './store.js';
import bookmarkApp from './bookmark-app.js';



const main = function(){
  

  api.getBookmarks()
    .then((marks) => {
      marks.forEach(bM => store.addBookmark(bM));
      bookmarkApp.render();
    })
    .catch(e => {
      console.log(e);
      store.error = e.message; 
      bookmarkApp.render();
    });
    bookmarkApp.eventPackage();
    bookmarkApp.render();
};

$(main);