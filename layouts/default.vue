<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :background-color = "sidebarBackground"
      short-title="IOT"
      title="IngenIoT"
    >
<!--      <template slot-scope="props" slot="links">
-->      <template  slot="links">
        <sidebar-item
          :link="{
            name: 'Home',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/home'
          }"
        >
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Rules',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/rules'
          }"
        >
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Customers',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/customers'
          }"
        >
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Domains',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/domains'
          }"
        >
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Devices',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/devices'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Entities',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/entities'
          }"
        >
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Widgets',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/widgets'
          }"
        >
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Dashboards',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/dashboards'
          }"
        >
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Integrations',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/integrations'
          }"
        >        
        </sidebar-item>
                <sidebar-item
          :link="{
            name: 'Logs',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/logs'
          }"
        >
        </sidebar-item>
<!--
        <li class="active-pro">
          <a href="https://www.creative-tim.com/product/nuxt-black-dashboard-pro" target="_blank">
            <i class="tim-icons icon-spaceship"></i>
            <p>Upgrade to PRO</p>
          </a>
        </li>-->
      </template>
    </side-bar>
    <!--Share plugin (for demo purposes). You can remove it if don't plan on using it-->
    <sidebar-share :background-color.sync="sidebarBackground"> </sidebar-share>
    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div
        :class="{ content: !isFullScreenRoute }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="500" mode="out-in">
          <!-- your content here -->
          <nuxt></nuxt>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!isFullScreenRoute"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';
  import SidebarShare from '@/components/Layout/SidebarSharePlugin';
  
  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue';
  import ContentFooter from '@/components/Layout/ContentFooter.vue';
  import DashboardContent from '@/components/Layout/Content.vue';
  import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';
  import mqtt from 'mqtt';
  
  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      SlideYDownTransition,
      ZoomCenterTransition,
      SidebarShare
    },

    data() {
      return {
        sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
        client: null,
        options: {
          host: process.env.mqtt_host,
          port: process.env.mqtt_port,
          endpoint: '/mqtt',
          clientId:"web_" + this.$store.state.auth.userData.name + "_" + Math.floor(Math.random()*1000000+1),
          username: null,
          password: null,
          connectTimeOut: 5000,
          reconnectPeriod: 5000,
          //protocolId:'MQIsdp',
          //protocolVersion: 3,
          clean: true,
          //encoding: 'utf8'
        }  
      };
    },
      mounted() {
      this.$store.dispatch("getNotifications");
      this.initScrollbar();
      setTimeout(() => {
            this.startMqttClient(); 
      }, 2000);

    },
    computed: {
      isFullScreenRoute() {
        return this.$route.path === '/maps/full-screen'
      }
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      initScrollbar() {
        let docClasses = document.body.classList;
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          // if we are on windows OS we activate the perfectScrollbar function
          initScrollbar('sidebar');
          initScrollbar('main-panel');
          initScrollbar('sidebar-wrapper');

          docClasses.add('perfect-scrollbar-on');
        } else {
          docClasses.add('perfect-scrollbar-off');
        }
      },
      //Added methods
      //mqtt methods
      async startMqttClient(){
        await this.createMqttAuth();
        //topic struct  userId/dId/variableId/sdata
        const deviceSubscribeTopic = this.$store.state.auth.userData._id + "/+/+/sdata";
        const notifSubscribeTopic = this.$store.state.auth.userData._id + "/+/+/notif";     
        const connectUrl = process.env.mqtt_prefix + this.options.host + ":" + this.options.port + this.options.endpoint;
        try {
          this.client = mqtt.connect(connectUrl,this.options);       
        } catch (error) {
          console.log(error);
        }
        this.client.on('connect',()=>{
          console.log('Conection successfull!');
          this.client.subscribe(deviceSubscribeTopic, {qos:0}, (error)=>{
            if(error){
              console.log("Error in device subscription");
              return;
            }
            console.log("Device subscription success!");
            console.log(deviceSubscribeTopic);
          });
          this.client.subscribe(notifSubscribeTopic, {qos:0}, (error)=>{
            if(error){
              console.log("Error in notif subscription");
              return;
            }
            console.log("Notif subscription success!");
            console.log(notifSubscribeTopic);
          });
        });
        this.client.on('error', error =>{
          console.log('Conection fails',error);
        });
        this.client.on('reconnect', (error) =>{
          console.log('Reconnecting',error);
          this.getMqttAuth();
        }); 
        this.client.on('offline', (error) =>{
          console.log('The client is offline',error);
        });    

        this.client.on("message",(topic,message)=>{
          console.log("Message MQTT from "+topic+" -->");
          console.log(message.toString());
          try {
            const splittedTopic = topic.split("/");        
            const msgType = splittedTopic[3];
            if(msgType == "notif"){
              this.$notify({
                type: 'danger',
                icon: 'tim-icons icon-alert-circle-exc',
                message: message.toString()
              });
              this.$store.dispatch("getNotifications");
              return;
              
            } else if(msgType == "sdata"){
              $nuxt.$emit(topic,JSON.parse(message.toString()));
              return;
            }
          } 
          catch (error) {
          console.log(error);
          }
        });
                
        $nuxt.$on('mqtt-sender',(toSend)=>{
          this.client.publish(toSend.topic,JSON.stringify(toSend.msg));
        });
      },       
      async createMqttAuth(){ //getMqttCredentials()
        try {
          const axiosHeader = {
            headers:{
              token: this.$store.state.auth.token
            }
          };
          const mqttAuth = await this.$axios.post("/mqttauth", null, axiosHeader); 
          console.log(mqttAuth.data);   
          if(mqttAuth.data.status == "success"){
            console.log("********mqtt auth success!********");
            this.options.username = mqttAuth.data.username,
            this.options.password = mqttAuth.data.password
            console.log("username===>"+this.options.username);
            console.log("password===>"+this.options.password);            
          }    
        } catch (error) {
          console.log(error);
          if(error.response.status == 401){
            console.log("NO VALID TOKEN");
            localStorage.clear();
            const auth = {};
            this.$store.commmit("setAuth", auth);            
            window.location.href = "/login";
          }
        }

      },
     async getMqttAuth(){ //getMqttCredentialsForReconnection() 
        try {
          const axiosHeader = {
            headers:{
              token: this.$store.state.auth.token
            }
          };
          const mqttAuth = await this.$axios.post("/mqttauthget", null, axiosHeader); 
          console.log(mqttAuth.data);   
          if(mqttAuth.data.status == "success"){
            console.log("********mqtt auth reconnect success!********");
            this.client.options.username = mqttAuth.data.username;
            this.client.options.password = mqttAuth.data.password;
            console.log("username===>"+this.options.username);
            console.log("password===>"+this.options.password);            
          }    
          else{
            console.log("Error getting mqtt user auth");
          } 
        } catch (error) {
          console.log(error);
        };

      }

    }

  };
</script>
<style lang="scss">
  $scaleSize: 0.95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }

  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }

  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }
</style>
