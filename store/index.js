export const state = () =>({
    auth: null,
    devices: [],
    selectedDevice: {},
    notifications: [],
    ewelinkAccounts: []
})

export const mutations = {
    setAuth(state, auth){
        state.auth = auth;
    },

    setDevices(state, devices){
        state.devices = devices;
    },

    setSelectedDevice(state, device){
        state.selectedDevice = device;
    },
    setNotifications(state, notifications){
        state.notifications = notifications;
    },
    setEwelinkAccounts(state, ewelinkAccounts){
        state.ewelinkAccounts = ewelinkAccounts;
    }

}

export const actions = {
    readToken(){
        let auth = null;
        try {
            auth=JSON.parse(localStorage.getItem('auth'));            
        } catch (error) {
            console.log(error);
        }
        this.commit('setAuth', auth);
    },

    getDevices(){
    console.log("getDevices");
        const axiosHeader = {
            headers: {
                token: this.state.auth.token
            }
        } 
        this.$axios.get("/device", axiosHeader)
            .then(res=>{
                console.log(res.data.data);
                res.data.data.forEach((device,index)=>{
                    if(device.selected){
                        this.commit('setSelectedDevice', device); 
                        $nuxt.$emit('selectedDeviceIndex',index);  
                    }
                });
                this.commit("setDevices", res.data.data);
            });  
    },
    getNotifications(){
        const axiosHeader = {
            headers: {
                token: this.state.auth.token
            }
        }
        this.$axios.get("/notifications", axiosHeader)
        .then(res=>{
            const notifications = res.data.data;
            console.log("Notificaciones recibidas desde el backend"+notifications);
            this.commit('setNotifications',notifications); 
        }).catch(error=> {
            console.log(error);
        });
    },
    getEwelinkAccounts(){
    console.log("getEwelinkAccounts");
        const axiosHeader = {
            headers: {
                token: this.state.auth.token
            }
        } 
        this.$axios.get("/ewelink-accounts", axiosHeader)
            .then(res=>{
                console.log(res.data.data);
                const ewelinkAccounts = res.data.data;
                console.log("Cuentas ewelink recibidas desde el backend"+ewelinkAccounts);
                this.commit('setEwelinkAccounts',ewelinkAccounts); 
            });  
    },
}  



