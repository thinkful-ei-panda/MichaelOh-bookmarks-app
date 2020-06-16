import store from './store.js';
import api from './api.js';



const generateBookmarkLoader = function (mark){

  const star = '<div class="clip-star"></div>';
  let starStore = [];
  for (let i = 0; i < mark.rating; i++) {
    starStore.push(star);
  }
  starStore = starStore.join('\n')
  
  let displayBox = `<div class="big-bookmark" id="${mark.id}" > 
        <h2>${mark.title}</h2>
        <p>${starStore}</p>
        <p>${mark.desc}</p>
        <div class="big-b-button" id="${mark.id}" >
          <a href="${mark.url}" class='visit-btn' type="button" target="_blank" >Visit Site</a>
          <button id="deleteMe" type="delete">Delete</button>
        </div>
        
    </div>`;
  if(!mark.expanded){
    displayBox =`
            <div class="small-bookmark" id="${mark.id}">
                <span>${mark.title}</span>
                <div>
                ${starStore}
                </div>
            </div>`;
  }
  return displayBox; 
};

const topBarLoader = function(){
  return `
    <div class="top-bar">
          <button class="add">Add new item</button>

          <form class="filter-selected" action="filter">
              <label for="filter">Filter By:</label>
              <select name="out-of-filter" id="filter">
                  <option disabled selected>Minimum Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
              </select>
          </form>    
      </div> 
  `;
};

const submissionBoxLoader = function(){
  return `
   <div class="submission-form">
      <form class="add-bookmark" id="add-bM" action="submit">
    <div class ="form-div"> 
      <label for="bookmark-title">Title</label>
        <input type="text" name="title" id="bookmark-title" placeholder="Bookmark Title" required>
    </div >
    <div class ="form-div"> 
      <label for="bookmark-url">URL</label>
        <input type="url" name="url"  id="bookmark-url" placeholder="https://Google.com" required oninvalid="this.setCustomValidity('Please Enter a URL with http(s)://')">
    </div >
    <div class ="form-div"> 
      <label for="bookmark-description">Description</label>
        <textarea name="desc" id="bookmark-description" placeholder="Add a Description!"></textarea>
    </div>
    <div class="submit buttons">
      <label for= "rating">score</label>
      <select name="out-of-filter" id="rating">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
      </select>
      <button type="submit" id="main-form-submit">Create</button>
      <button type="reset" id="reset">Cancel</button>
    </div>
                
        </form>
    </div>`;
};



const errorElement = function (error) {
  return `<section class="error-content">
            <button id="cancel-error">X</button>
            <p>${error}</p>
        </section>`;
};

const renderError = function(){
  if(store.error) {
    const Eelem = errorElement(store.error);
    $('.app-loader').html(Eelem);
  }
};

const errorButton = function(){
  $('.app-loader').on('click','#cancel-error',()=>{
    store.setError();
    render();
  });
};



const generateBookmarkList = function(bookmarkList){
  const bookmarks = bookmarkList.map( (object) =>  generateBookmarkLoader(object));
  return bookmarks.join('');
};



const render = function(){
  renderError();
  let html = '';
  let marks = store.bookmarks;
  if(store.ratingFilter > 0){
    marks = marks.filter(obj => obj.rating >= store.ratingFilter);
  }

  html = topBarLoader();

  html +=  generateBookmarkList(marks);
  
  $('.app-loader').html(html);
  
  if(store.add){
    $('.app-loader').html(submissionBoxLoader());
  }

};


const handleAddButton = function(){
  $('main').on('click','button.add',(x) => {
    x.preventDefault();
    store.add = true;
    render();
  });
};

const handleSubmissions = function() {
  $('main').on( 'submit','#add-bM', (e) =>{
    e.preventDefault();
    const newTitle = $('#bookmark-title').val();
    const newURL = $('#bookmark-url').val();
    const newDesc = $('#bookmark-description').val();
    const newVal = $('#rating').val();
    
    const newList = {
      title: newTitle,
      url: newURL,
      desc: newDesc,
      rating: newVal,
    };
    store.toggleSubmission();
    api.createBookmarks(newList)
      .then((newSub)=>{
        store.addBookmark(newSub);
        render();
      } )
      .catch((e) => {
        console.log(e);
        store.setError(e.message);
        renderError();
      });
  } );
};

const handleCancelButton = () => {
  $('main').on('click', '#reset',(e) => {
    e.preventDefault();
    store.toggleSubmission();
    render();
  });
};

const getBookmarkId = function (mark) {
  const id = $(mark).attr('id');
  return id; 
};

const handleDeleteMarkClicked = function() {
  $('.app-loader').on('click', '#deleteMe', (x) => {
    x.preventDefault();
    const target = $('#deleteMe').parent();
    const id = getBookmarkId(target);
    api.deleteMarks(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((e)=>{
        console.log(e);
        store.setError(e.message);
        renderError();
      });
  });
};

const handleClosingBigDisplay = () => {
  $('main').on('click','.big-bookmark',(e)=>{
    const id = getBookmarkId(e.currentTarget);
    store.toggleExpand(id);
    render();
  });
};

const handleMarkExpanded = function(){
  $('main').on('click', '.small-bookmark', (e) => {
    
    const id = getBookmarkId(e.currentTarget);
    store.toggleExpand(id);
    render();
  });
};

const handleFilterValChange = function(){
  $('main').on( 'change','#filter', () =>{ 
    store.ratingFilter = $('#filter').val();
    render();
  } );
};

const eventPackage = function () {
  handleAddButton(); 
  handleSubmissions();
  handleCancelButton();
  handleClosingBigDisplay();
  handleDeleteMarkClicked();
  handleMarkExpanded();
  handleFilterValChange();
  errorButton();
};






export default{
  eventPackage,
  render
};
