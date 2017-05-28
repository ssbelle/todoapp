
//after doc is ready
//Shows each list when its corresponding button is clicked
$(document).ready(function(){
  $("#to-watch-list-btn").click(function(){
    event.preventDefault();
    $(".list-to-watch").show();
    })

  $("#to-read-list-btn").click(function(){
    event.preventDefault();
    $(".list-to-read").show();
    })

  $("#to-eat-list-btn").click(function(){
    event.preventDefault();
    $(".list-to-eat").show();
    })

  $("#to-buy-list-btn").click(function(){
    event.preventDefault();
    $(".list-to-buy").show();
    })

  })


  $('#view-lists').click(function() {
   loadLists();
  });

 $('#submit-btn').click(function() {
    event.preventDefault();
    var item = $('#form-textarea').val()
    waitingMsg("Categorizing...")
    $.ajax({
      method: "POST",
      url: "/todo/create",
      data: {'item': item}
    }).done((category) => {
      waitingMsgToggle(`${item} added to ${category} list`);
      renderElement(item, category);
    }).fail((error) => {
      waitingMsgToggle(error.responseText)
    })
  });


// on the click of the delete remove that specific list item
  $("li").on("click", ".flash-delete-btn", function(event) {
    event.preventDefault();
    let item = $(this).closest('li').data("title");//lie data attribute contains the items name
    let category = $(this).closest('ul').attr("class").split(' '); //this is an array of classes
    category = category[category.length-1]; //the last item of the array is the category
   $(this).closest('li').remove();//remove item on front end
    deleteItem(item, category) //remove item on back end
  });

  //on register click, register user
  $("#register-submit-btn").on("click", function(event) {
    event.preventDefault();
    let formData = $('#register-form').serializeArray();
    let name = formData[0].value;
    let email = formData[1].value;
    let password = formData[2].value;
    registerUser(name, email, password);
  });

  //on login click
  $("#login-submit-btn").on("click", function(event) {
    event.preventDefault()
    let formData = $('#login-form').serializeArray();
    let email = formData[0].value;
    let password = formData[1].value;
    loginUser(email, password);
  });

  $("#update-submit-btn").on("click", function(event) {
    event.preventDefault()
    let formData = $('#update-user-form').serializeArray();
    let name = formData[0].value;
    let email = formData[1].value;
    let password = formData[2].value;
    updateUser(name, email, password);
  });

  //logging out
  $("#logout").on("click", function(event) {
    logoutUser();
  });
})


function deleteItem(item, category) {
  $.ajax({
    url: `/todo/${category}/${item}`,
    type: "DELETE"
  })
};

function loadLists() {
  let categories = ['movie', 'restaurant', 'book', 'product'];
  categories.forEach(function (category) {
    loadItems(category);
  })
}



function loadItems(category) { //4 categories
  $.ajax({
    url: `todo/${category}`,
    method: "GET",
    success: function(result) {
      result.forEach(function (item) { //loops through all items and renders
        renderElement(item.name, category)//renders items for specified category
      })
    }
  }).fail(function() {
    console.log('ERROR NOT LOGGED IN')
  })
};

function renderElement(item, category) {
  const buttons =
  `<div class="update-and-delete-btns" style= "">
      <a class="flash-update-btn" href="#">Update</a>
      <a class="flash-delete-btn" href="#">Delete</a>
   </div>`

  // Renders items in list
  //target parent ul line 431 and data title on parent line 432
  $("<li>").text(item).attr('data-title', item).appendTo($("." + category));
  // appends buttons
  $("div[data-title=\""+item+"\"]").append($(buttons).addClass('update-and-delete-btns'));
  $("<div>").after()
};

function logoutUser() {
  $.ajax({
    url: "/todo/logout",
    method: "POST",
    success: function() {
      location.reload();
      //render the ejs where someone has to log in or register
    }
  })
};

function loginUser(email, password) {
  $.ajax({
    url: "/todo/login",
    method: "POST",
    data: {'email': email, 'password': password},
    success: function(result) {
      location.reload();
      return result;
      //render the ejs where someone has signed in
    }
  }).fail(function (error){
    waitingMsgToggle(error.responseText);
  })
};

function registerUser(name, email, password) {
  $.ajax({
    url: "/todo/register",
    method: "POST",
    data: {'username': name, 'email': email, 'password': password},
    success: function() {
      location.reload();
      //render the ejs where someone has signed in
    }
  }).fail(function(error) {
    waitingMsgToggle(error.responseText);
  })
};

function updateItem(item, category, newItem) {
  $.ajax({
    url: `/todo/${category}/${item}`,
    method: "PUT",
    data: {'item': newItem},
    success: function() {
      //update .val of item element
    }
  }).fail(function() {
      console.log('ERROR NOT LOGGED IN')
  })
};

function updateUser(newName, newEmail, newPassword) {
  $.ajax({
    url: `/todo/profile`,
    method: "PUT",
    //values not needed to be updated are set to undefined
    data: {'name': newName == "" ? undefined: newName,
     'newEmail': newEmail == "" ? undefined: newEmail,
     'password': newPassword == ""? undefined: newPassword},
    success: function () {
      let message = "";
      if(!(newName == "")) message += "Name ";
      if(!(newEmail == "")) message += "Email ";
      if(!(newPassword == "")) message += "Password ";
      waitingMsgToggle(`Updated ${message}`);
    }
  }).fail(function() {
    waitingMsgToggle('Error incorrect input')
  })
};

function selectCategoryBtns(){
  $('.flash-category-btn').show();
};


//msg user recives while waiting for the apis response
function waitingMsgToggle(msg){
  $('.alerts').text(msg).fadeIn("slow").delay(3000).fadeOut("slow");
};

function waitingMsg(msg){
  $('.alerts').text(msg);
};

//this function as per name collapses the uls and lis
function collapseList(parent) {
  $(parent).slideUp().addClass('collapsed').find('ul').slideUp().addClass('collapsed');
};
//expands the lists
function expandList(parent) {
  $(parent).slideDown().removeClass('collapsed');
};
