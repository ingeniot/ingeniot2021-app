<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//card-primary.png" alt="" />
          <h1 class="card-title">IngenIoT</h1>
        </template>

        <div>
          <base-input
            name="email"
            v-model="user.email"
            placeholder="Email"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>

          <base-input
            name="password"
            v-model="user.password"
            type="password"
            placeholder="Password"
            addon-left-icon="tim-icons icon-lock-circle"
          >
          </base-input>
        </div>

        <div slot="footer">
          <base-button
            native-type="submit"
            type="primary"
            class="mb-3"
            size="lg"
            @click="login()"
            block
          >
            Login
          </base-button>
          <div class="pull-left">
            <h6>
              <nuxt-link class="link footer-link" to="/register">
                Create Account
              </nuxt-link>
            </h6>
          </div>

          <div class="pull-right">
            <h6><a href="#help!!!" class="link footer-link">Need Help?</a></h6>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  name: "login-page",
  layout: "auth",
  middleware: 'notAuthenticated',
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
      login(){
      this.$axios.post("/login", this.user)
      .then ((res)=> {
        if(res.data.status == "success"){
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: "Success. Welcome " + res.data.userData.name + "!"
          });
          console.log(res.data);
          const auth = {
            token: res.data.token,
            userData: res.data.userData
          }
          //Store token accesible all components (vuex)
          this.$store.commit('setAuth', auth);
          //set auth object in localstorage (persistance)
          localStorage.setItem('auth',JSON.stringify(auth));
          $nuxt.$router.push('/home');
          return;
        }
        else
          {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-circle-exc",
            message: "Login error. Try again"
          });
          return;
        };
      })
      .catch((e)=>{
        console.log(e.response.data);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-circle-exc",
            message: "Error"+ e.response.data + ". Try again"
          });
          return;          
        })
      }
    }
};
</script>

<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
