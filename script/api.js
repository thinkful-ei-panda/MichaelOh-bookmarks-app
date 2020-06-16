const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michaeloh'; // bookmark

const errorCatch = function(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if(!res.ok) {
        error = {code : res.status};
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};



const getBookmarks = function(){
  return errorCatch(`${BASE_URL}/bookmarks`);
};

const createBookmarks = function(objInput){
  const newMark = JSON.stringify(objInput);
  console.log(newMark);

  return errorCatch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : newMark
  });
};



const deleteMarks = function(id){
  return errorCatch(`${BASE_URL}/bookmarks/${id}`,{
    method : 'DELETE',
  });
};


export default{
  getBookmarks,
  createBookmarks,
  deleteMarks,

};