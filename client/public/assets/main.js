new Vue({
  el: "#app",
  data: {
    isLoggedIn: false,
    isRegister: false,
    todos: [],
    email: "",
    password: "",
    name: "",
    newItem: "",
    tags: "",
    editItemId: "",
    updateItem: "",
    addTags: "",
    removeTags: "",
    search: "",
    user: ""
  },
  methods: {
    login: function() {
      let payload = {
        email: this.email,
        password: this.password
      };
      axios
        .post("https://server-todo.mcang.ml/signin", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLoggedIn = true;
            localStorage.setItem("name", data.name);
            this.user = data.name;
            localStorage.setItem("token", data.token);
            this.getTodos();
            this.cleanInput();
            swal({
              title: "Login Success!",
              icon: "success"
            });
          } else {
            swal({
              title: "Warning!",
              text: data.err.message,
              icon: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    logout: function() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
    },
    register: function() {
      let payload = {
        email: this.email,
        password: this.password,
        name: this.name
      };
      axios
        .post("https://server-todo.mcang.ml/signup", payload)
        .then(({ data }) => {
          if (data.token) {
            this.isLoggedIn = true;
            localStorage.setItem("name", data.name);
            this.user = data.name;
            localStorage.setItem("token", data.token);
            this.getTodos();
            this.cleanInput();
            this.isRegister = false;
          } else {
            let errors = []
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const error = data[key];
                errors.push(error.message)
              }
            }
            swal({
              title: "Warning!",
              text: errors.join('\n'),
              icon: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginFB: function() {
      let provider = new firebase.auth.FacebookAuthProvider()
      let self = this;
      firebase.auth().signInWithPopup(provider).then(function (result) {
        let user = result.user
        let payload = {
          name: user.displayName,
          email: user.email,
          password: user.email.slice(0, 8)
        }
        axios
        .post("https://server-todo.mcang.ml/login-fb", payload)
        .then(({ data }) => {
          if (data.token) {
            self.isLoggedIn = true;
            localStorage.setItem("name", data.name);
            self.user = data.name;
            localStorage.setItem("token", data.token);
            self.getTodos();
            self.cleanInput();
            swal({
              title: "Login with FB Success!",
              text: "Your account password is first 8 character of your email",
              icon: "success"
            });
          } else {
            swal({
              title: "Warning!",
              text: data.err.message,
              icon: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      }).catch(function (error) {
        let errorMessage = error.message
        swal(JSON.stringify(errorMessage))
      })
    },
    getTodos: function() {
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      axios
        .get("https://server-todo.mcang.ml/user/", config)
        .then(({ data }) => {
          console.log(data);
          this.todos = data.todos;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addTodo: function() {
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      let payload = {
        action: this.newItem,
        tags: this.tags.split(" ")
      };
      axios
        .post("https://server-todo.mcang.ml/user", payload, config)
        .then(({ data }) => {
          if (data.action) {
            this.cleanInput();
            swal({
              title: "Warning!",
              text: data.action.message,
              icon: "warning"
            });
          } else {
            this.getTodos();
            this.cleanInput();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateTodo: function() {
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      let itemId = this.editItemId;
      let payload = {
        addTags: this.addTags.split(" "),
        removeTags: this.removeTags.split(" ")
      };
      if (this.updateItem !== "") {
        payload.action = this.updateItem;
      }
      axios
        .put(`https://server-todo.mcang.ml/user/todo/${itemId}`, payload, config)
        .then(({ data }) => {
          console.log(data);
          this.getTodos();
          this.cleanInput();
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteTodo: function(itemId) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this todo item!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          let token = localStorage.getItem("token");
          let config = { headers: { token } };
          axios
            .delete(`https://server-todo.mcang.ml/user/todo/${itemId}`, config)
            .then(({ data }) => {
              console.log(data);
              this.getTodos();
            })
            .catch(err => {
              console.log(err);
            });
          swal("Your to do item has been deleted!", {
            icon: "success"
          });
        } else {
          swal("Your to do item is not deleted!");
        }
      });
    },
    updateStatus: function(itemId, statusUpdate) {
      let update = { completed: statusUpdate };
      let token = localStorage.getItem("token");
      let config = { headers: { token } };
      axios
        .put(`https://server-todo.mcang.ml/user/todo/${itemId}`, update, config)
        .then(({ data }) => {
          console.log(data);
          this.getTodos();
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchTag: function() {
      if (this.search !== "") {
        let token = localStorage.getItem("token");
        let config = { headers: { token } };
        let query = this.search;
        axios
          .get(`https://server-todo.mcang.ml/user?tag=${query}`, config)
          .then(({ data }) => {
            console.log('search', data);
            this.cleanInput();
            this.todos = data.todos;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    getDate: function(input) {
      let d = new Date(input);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDay();
      return `${day}/${month}/${year}`;
    },
    getStatus: function(input, updatedAt) {
      if (input) {
        return "Completed on " + this.getDate(updatedAt);
      } else {
        return "Not Completed";
      }
    },
    cleanInput: function() {
      this.newItem = "";
      this.tags = "";
      this.updateItem = "";
      this.addTags = "";
      this.removeTags = "";
      this.email = "";
      this.password = "";
      this.name = "";
      this.search = "";
      this.updateItem = "";
    }
  },
  created: function() {
    if (localStorage.getItem("token")) {
      this.user = localStorage.getItem("name");
      this.isLoggedIn = true;
      this.getTodos();
    }
  }
});
