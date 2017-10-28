(function($) {

  var app = {
    baseUrl: 'http://localhost:3001',
    init: function() {
      app.createOne();
      app.deleteOne();
      app.doCancel();
      app.getAllRecords();
      app.getOne();
      app.getProtected();
      app.loginHandler();
      app.openCreate();
      app.putOne();
      app.signUpHandler();
    },
    cancel: () => {
      $('#showOne').empty().removeClass('active');
    },
    createOne: () => {
      $('#showOne').on('click', '.create', (e) => {
        e.preventDefault();
        var body = {
          active: $('#isactive').val(),
          age: $('#theage').val(),
          name: $('#thename').val()
        };
        let promise = new Promise((res, rej) => {
          $.ajax({
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            headers: {
              "accept": "application/json; odata=verbose"
            },
            type: 'POST',
            url: `${app.baseUrl}/characters`,
            success: (data) => {
              app.getAllRecords();
              app.cancel();
              res();
            },
            error: (error) => {
              console.log(error);
              rej();
            }
          });
        });
        return promise;
      });
    },
    deleteOne: () => {
      $('#showAll').on('click', '.delete', (e) => {
        e.preventDefault();
        let _id = $(e.target).data('id');
        let promise = new Promise((res, rej) => {
          $.ajax({
            contentType: "application/json; charset=utf-8",
            data: {},
            headers: {
              "accept": "application/json; odata=verbose"
            },
            type: 'DELETE',
            url: `${app.baseUrl}/characters/${_id}`,
            success: (data) => {
              app.getAllRecords();
              app.cancel();
              res();
            },
            error: (error) => {
              console.log(error);
              rej();
            }
          });
        });
        return promise;
      });
    },
    doCancel: () => {
      $('#showOne').on('click', '.cancel', (e) => {
        e.preventDefault();
        app.cancel();
      });
    },
    getAllRecords: () => {
      let promise = new Promise((res, rej) => {
        $.ajax({
          headers: {
            "accept": "application/json; odata=verbose"
          },
          type: 'GET',
          url: `${app.baseUrl}/characters`,
          success: function(items) {
            $('#showAll').empty();
            $('#showAll').append(`
              <li class="listitem">
                <div class="name h">Name</div>
                <div class="active h">Active</div>
                <div class="age h">Age</div>
              </li>
            `);
            items.characters.forEach((item) => {
              $('#showAll').append(`
                <li class='listitem'>
                  <div class='name'>${item.name}</div>
                  <div class='active'>${item.active}</div>
                  <div class='age'>${item.age}</div>
                  <button data-id="${item.id}" class="delete">Delete</button>
                  <button data-id="${item.id}"class="edit">Edit</button>
                </li>
              `);
            });
            res();
          },
          error: (error) => {
            console.log(error);
            rej();
          }
        });
      });
      return promise;
    },
    getOne: () => {
      $('#showAll').on('click', '.edit', function(e) {
        e.preventDefault();
        $('#showOne').addClass('active');
        let id = $(this).data('id');
        let promise = new Promise((res, rej) => {
          $.ajax({
            headers: {
              "accept": "application/json; odata=verbose"
            },
            type: 'GET',
            url: `${app.baseUrl}/characters/${id}`,
            success: (item) => {
              $('#showOne').empty();
              $('#showOne').append(`
                <input id='thename' type='text' class='name e' value='${item.characters.name}' />
                <input id='isactive' type='text' class='active e' value='${item.characters.active}' />
                <input id='theage' type='text' class='age e' value='${item.characters.age}' />
                <div class='buttonwrap'>
                  <button data-id="${item.characters.id}" class="save">Save</button>
                  <button class="cancel">Cancel</button>
                </div>
              `)
              res();
            },
            error: (error) => {
              console.log(error);
              rej();
            }
          });
        });
        return promise;
      });
    },
    getProtected: () => {
      $(document).on('submit', '#get-protected', (e) => {
        e.preventDefault();
        let _token = `Bearer ${localStorage.getItem('jwToken')}`;
        let promise = new Promise((res, rej) => {
          $.ajax({
            // beforeSend: (req) => { req.setRequestHeader("Authorization", app.token) },
            headers: {
              "accept": "application/json; odata=verbose",
              "Authorization": _token
            },
            type: 'GET',
            url: `${app.baseUrl}/protected`,
            success: (item) => {
              console.log(item);
              res();
            },
            error: (error) => {
              console.log(error);
              rej();
            }
          });
        });
        return promise;
      });
    },
    loadPage: (page) => {
      let target = $('#root');
      let _page = `src/views/${page}.html`;
      $(target).html(_page);
      $.get(_page, function(data){
        $(target).html(data);
      });
    },
    loginHandler: () => {
      $(document).on('submit', '#login-submit', (e) => {
        e.preventDefault();
        let _body = {
          username: $('#login-username').val(),
          password: $('#login-password').val()
        };
        let promise = new Promise((res, rej) => {
          $.ajax({
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(_body),
            headers: {
              "accept": "application/json; odata=verbose",
            },
            type: 'POST',
            url: `${app.baseUrl}/auth/login`,
            success: (data) => {
              $('#login-username').val('');
              $('#login-password').val('');
              localStorage.setItem('jwToken', data.authToken);
              res();
            },
            error: (error) => {
              console.log(error);
              rej();
            }
          });
        });
        return promise;
      });
    },
    openCreate: () => {
      $('#open-create').on('click', (e) => {
        e.preventDefault();
        $('#showOne').empty();
        $('#showOne').append(`
          <input id='thename' type='text' class='name e' placeholder='Name' />
          <input id='isactive' type='text' class='active e' placeholder='Active' />
          <input id='theage' type='text' class='age e' placeholder='Age' />
          <div class='buttonwrap'>
            <button data-id="tbd" class="create">Save</button>
            <button class="cancel">Cancel</button>
          </div>
        `);
      });
    },
    putOne: () => {
      $('#showOne').on('click', '.save', function(e) {
        e.preventDefault();
        let id = $(this).data('id');
        var body = {
          active: $('#isactive').val(),
          age: $('#theage').val(),
          id: id,
          name: $('#thename').val()
        };
        let promise = new Promise((res, rej) => {
          $.ajax({
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            headers: {
              "accept": "application/json; odata=verbose"
            },
            type: 'PUT',
            url: `${app.baseUrl}/characters/${id}`,
            success: (data) => {
              $('#showOne').empty().removeClass('active');
              $('#showAll').empty();
              app.getAllRecords();
              res();
            },
            error: (error) => {
              console.log(error);
              rej();
            }
          });
        });
        return promise;
      });
    },
    signUpHandler: () => {
      $(document).on('submit', '#sign-up-submit', (e) => {
        e.preventDefault();
        var body = {
          firstName: $('#firstName').val(),
          lastName: $('#lastName').val(),
          username: $('#username').val(),
          password: $('#password').val()
        };
        let promise = new Promise((res, rej) => {
          $.ajax({
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            headers: {
              "accept": "application/json; odata=verbose"
            },
            type: 'POST',
            url: `${app.baseUrl}/users/register`,
            success: (data) => {
              $('#firstName').empty();
              $('#lastName').empty();
              $('#username').empty();
              $('#password').empty();
              res();
            },
            error: (error) => {
              console.log(error);
              rej();
            }
          });
        });
        return promise;
      });
    }
  };

  $(window).on('load', () => {
    app.init();
    app.loadPage('landing');
  });

})(window.jQuery);
