<template>
    <div>
        <div>
            <h2>Integrations</h2>
        </div>
        <div class="col-12" >
            <base-button @click="getDevices()" type="primary" class="mb-3" size="lg" >Ewelink</base-button>   
            </div>        
        <!--Form add ewelink account-->
        <div class="row">
            <card>
            <div slot="header"> 
            <h4 class="card-tittle">Add EWELINK Account</h4>
            </div>
            <div class="row">
                <div class="col-4">
                    <base-input label="Ewelink user" type="text" placeholder="User*" v-model="newEwelinkAccount.user"></base-input>
            </div>         
                <div class="col-4">
                    <base-input label="Ewlink password" type="text" placeholder="Password*" v-model="newEwelinkAccount.password"></base-input>
            </div>    
                 <div class="col-4">
                    <slot name="label"> 
                        <label> Region</label>
                    </slot>

                    <el-select v-model="selectedRegion" placeholder="Select region" class="select-primary" style="width:100%">
                        <el-option v-for = "(region, index) in regions" :key= "region"  class="text-dark" :value= "region" :label= "region"></el-option>
                    </el-select>
            </div>   
                   
            </div>
            <div class="row pull-right" >
                <div class="col-12" >
                    <base-button @click="createEwelinkAccount()" type="primary" class="mb-3" size="lg" >Add</base-button>   
                </div>
            </div>
            </card>
        </div>
                <!--table ewelink accounts-->
        <div class="row">
            <card>
                <div slot="header"> 
                <h4 class="card-tittle">Accounts list</h4>
               </div>

               <el-table :data="$store.state.ewelinkAccounts">
                    <el-table-column label="#" min-width="50" allign="center">
                        <div slot-scope= "{ row, $index}">
                            {{$index+1}}
                        </div>
                    </el-table-column>

                    <el-table-column label="User" prop="user"></el-table-column>
                    <el-table-column label="Password"  prop="password"></el-table-column>
                    <el-table-column label="Region"  prop="region"></el-table-column>
                    <el-table-column label="Actions">
                        <div slot-scope="{row, $index}">
                            <el-tooltip content="Account status indicator" style="margin-right:10px">
                                <i class="fas fa-database" :class="{'text-success': row.ewelinkAccount.status,'text-dark': !row.ewelinkAccount.status}"></i>
                            </el-tooltip>
                            
                            <el-tooltip content="Account activate">
                                <base-switch @click="updateEwelinkAccountStatus(row.ewelinkAccount)" :value= "row.ewelinkAccount.status" type="primary" on-text="on" off-text="off" ></base-switch>
                            </el-tooltip>
                            <el-tooltip content="Delete" effect="light" :open:delay="300" placement="top">
                            <base-button type="danger" icon size="sm" class="btn-link" @click="deleteEwelinkAccount(row)">
                            <i class="tim-icons icon-simple-remove"></i>
                            </base-button>
                        </el-tooltip>
                        </div>
                   </el-table-column>
                </el-table>
            </card>            
        </div>
        <h3>Selected account</h3>
 <!--       <Json :value="$store.state.selectedEwelinkAccount"></Json>        
                <h3>Ewelink accounts</h3>
        <Json  :value="$store.state.ewelinkAccounts"></Json>
                <h3>Regions</h3>
        <Json :value="regions"></Json>-->
    </div>      
</template>
<script>
import { Table, TableColumn } from 'element-ui';
import { Select, Option } from 'element-ui';
import BaseButton from '../components/BaseButton.vue';
export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select
    },
    data(){
        return{
            sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
            regions: [
                us,
                cn
            ],
            selectedRegion: null,
            newEwelinkAccount: {
                user:"",
                password:"",
                region:""            
            },
            connection:'',
            devices: [],
            name: 'sinnombre'
        };
    },
    mounted(){
    //this.getEwelinkAccounts();
    },
    methods:{
    
        async getEwelinkAccounts(){
            const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                }
            };
            try {
                const res = await this.$axios.get("/ewelink-accounts", axiosHeader);
                console.log(res.data);
                if (res.data.status == "success"){
                this.ewelinkAccounts = res.data.data;
                }
            } catch (error) {
                this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: "Error getting accounts"
                });
                console.log(error);
                return;
            }
        },
        createEwelinkAccount(ewelinkAccount) {
            if(this.newEwelinkAccount.user == ""){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Ewelink account user is empty"
                    }); 
                    return;               
            }
            if(this.newEwelinkAccount.password == ""){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Password is empty"
                    }); 
                    return;                  
            }
            if(this.selectedRegion == null){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Region must be selected"
                    }); 
                    return;                  
            }
            const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                }
            };
            this.newEwelinkAccount.region = this.regions[this.selectedRegion].region;
            const toSend = {
                newEwelinkAccount: this.newEwelinkAccount
            };
            this.$axios
                .post("/ewelink", toSend, axiosHeader)
                .then(res => {
                    if(res.data.status == "success") {
                    this.$store.dispatch("getEwelinkAccounts");
                    this.newEwelinkAccount.user="";
                    this.newEwelinkAccount.password="";
                    this.selectedRegion=null;
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message: "Success! Ewelink account was added!"
                    });
                    return;
                }               
                })
                .catch(e => {
                if(e){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "The account is already resgistred"
                    }); 
                    return;                    
                }
                else{
                    this.$showNotify("danger","Error");
                    return;
                }
                });
            },
        deleteEwelinkAccount(ewelinkAccount) {
            const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                },
                params: {
                password: ewelinkAccount.password
                }
            };
            this.$axios
                .delete("/ewelink-account", axiosHeader)
                .then(res => {
                if (res.data.status == "success") {
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message: newEwelinkAccount.user + " deleted!"
                    });
                    this.$store.dispatch("getEwelinkAccounts");
                }
                
                })
                .catch(e => {
                console.log(e);
                this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: " Error deleting " + device.name
                });
            });

        },

        updateEwelinkAccountStatus(ewelinkAccount){
            var EwelinkAccountTemp = JSON.parse(JSON.stringify(ewelinkAccount.status));
            console.log("status"+ewelinkAccount.status);
            ewelinkAccount.status = !ewelinkAccountTemp.status;
            console.log("status"+ewelinkAccount.status);
            const toSend = {
                ewelinkAccount: ewelinkAccount
            };
            const axiosHeader = {
                headers: {
                    token: this.$store.state.auth.token
                }
            }
            this.$axios.put("/ewelin-account-status", toSend, axiosHeader)
            .then(res=>{
                if(res.data.status == 'success'){
                    this.$store.dispatch("getewelinkAccounts");
                    console.log("paso por success");
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message:  "Ewelink account status updated!"
                    });     
                }
                return;
            })
            .catch(e =>{
                console.log(e);
                    this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Error updating ewelink statius" 
                    });
                    return;
            });
        },

        async getDevices(){
          /*  const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                }
            };*/
            try {
                console.log("Ejecuta getDevices()");
                const res = await this.$axios.get("/ewelink/get-devices");
                console.log("pide dispositivos a la api de esprress");
                if (res.data.status == "success"){
                //this.devices = res.data.name;
                //this.connection = res.data.connection;

                console.log("respuesta1: ",res.data.status);
                console.log("respuesta2: ",res.data.data);
                console.log("respuesta3: ",res.data.nombre);
                this.name = res.data.data;
                console.log("nombre",this.name);
                //console.log("respuesta2: ",res.data.connection.region);             

                }
            } catch (error) {
                this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: "Error getting devices"
                });
                console.log(error);
                return;
            }
        }                            
    }
};
</script>

