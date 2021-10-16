<template>
    <div>
        <!--Form add device-->
        <div class="row">
        <card>
            <div slot="header"> 
            <h4 class="card-tittle">Add devices</h4>
            </div>
            <div class="row">
                <div class="col-4">
                    <base-input label="Device name" type="text" placeholder="Name*" v-model="newDevice.name"></base-input>
            </div>         
                <div class="col-4">
                    <base-input label="Serial number" type="text" placeholder="Serial Number*" v-model="newDevice.dId"></base-input>
            </div>    
                 <div class="col-4">
                    <slot name="label"> 
                        <label> Dashboard</label>
                    </slot>

                    <el-select v-model="selectedIndexDashboard" placeholder="Select dashboard" class="select-primary" style="width:100%">
                        <el-option v-for = "(dashboard, index) in dashboards" :key= "dashboard._id"  class="text-dark" :value= "index" :label= "dashboard.name"></el-option>
                    </el-select>
            </div>   
                   
            </div>
            <div class="row pull-right" >
                <div class="col-12" >
                    <base-button @click="createDevice()" type="primary" class="mb-3" size="lg" >Add</base-button>   
                </div>
            </div>
        </card>
        </div>

        <!--table device-->
        <div class="row">
            <card>
                <div slot="header"> 
                <h4 class="card-tittle">Devices list</h4>
               </div>

               <el-table :data="$store.state.devices">
                    <el-table-column label="#" min-width="50" allign="center">
                        <div slot-scope= "{ row, $index}">
                            {{$index+1}}
                        </div>
                    </el-table-column>

                    <el-table-column label="Name" prop="name"></el-table-column>
                    <el-table-column label="Device ID"  prop="dId"></el-table-column>
                    <el-table-column label="Password"  prop="password"></el-table-column>
                    <el-table-column label="Device Type"  prop="type"></el-table-column>
                    <el-table-column label="Dashboard"  prop="dashboardName"></el-table-column>
                    <el-table-column label="Actions">
                        <div slot-scope="{row, $index}">
                            <el-tooltip content="Saver status indicator" style="margin-right:10px">
                                <i class="fas fa-database" :class="{'text-success': row.saverRule.status,'text-dark': !row.saverRule.status}"></i>
                            </el-tooltip>
                            
                            <el-tooltip content="Save Data">
                                <base-switch @click="updateSaverRuleStatus(row.saverRule)" :value= "row.saverRule.status" type="primary" on-text="on" off-text="off" ></base-switch>
                            </el-tooltip>
                            <el-tooltip content="Delete" effect="light" :open:delay="300" placement="top">
                            <base-button type="danger" icon size="sm" class="btn-link" @click="deleteDevice(row)">
                            <i class="tim-icons icon-simple-remove"></i>
                            </base-button>
                        </el-tooltip>
                        </div>
                   </el-table-column>
                </el-table>
            </card>            
        </div>
        <h3>Selected device</h3>
        <Json :value="$store.state.selectedDevice"></Json>        
                <h3>Devices</h3>
        <Json  :value="$store.state.devices"></Json>
                <h3>Dashboards</h3>
        <Json :value="dashboards"></Json>
    </div>
</template>

<script>
import { Table, TableColumn } from 'element-ui';
import { Select, Option } from 'element-ui';
import BaseButton from '../components/BaseButton.vue';

export default{
    middleware: "authenticated",
    components: {
        [BaseButton.name]:BaseButton,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select,   

    },
    data(){
        return{        
            dashboards: [],
            selectedIndexDashboard: null,
            newDevice: {
                name:"",
                dId:"",
                dashboardId:"",
                dashboardname:""
            }
        };
    },
    mounted(){
        this.getDashboards();
        },

    methods: {
        createDevice(device) {
            if(this.newDevice.name == ""){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Device name is empty"
                    }); 
                    return;               
            }
            if(this.newDevice.dId == ""){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Device ID is empty"
                    }); 
                    return;                  
            }
            if(this.selectedIndexDashboard == null){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Dashboard must be selected"
                    }); 
                    return;                  
            }
            const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                }
            };
            this.newDevice.dashboardId = this.dashboards[this.selectedIndexDashboard]._id;
            this.newDevice.dashboardName = this.dashboards[this.selectedIndexDashboard].name;
            const toSend = {
                newDevice: this.newDevice
            };
            this.$axios
                .post("/device", toSend, axiosHeader)
                .then(res => {
                    if(res.data.status == "success") {
                    this.$store.dispatch("getDevices");
                    this.newDevice.name="";
                    this.newDevice.dId="";
                    this.selectedIndexDashboard=null;
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message: "Success! Device was added!"
                    });
                    return;
                }               
                })
                .catch(e => {
                if(e.response.data.status == "error" && e.response.data.error.errors.dId.kind == "unique"){
                    this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "The device si already resgistred"
                    }); 
                    return;                    
                }
                else{
                    this.$showNotify("danger","Error");
                    return;
                }
                });
            },


        deleteDevice(device) {
            const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                },
                params: {
                dId: device.dId
                }
            };
            this.$axios
                .delete("/device", axiosHeader)
                .then(res => {
                if (res.data.status == "success") {
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message: device.name + " deleted!"
                    });
                    this.$store.dispatch("getDevices");
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

        updateSaverRuleStatus(saverRule){
            var saverRuleTemp = JSON.parse(JSON.stringify(saverRule));
            console.log("status"+saverRuleTemp.status);
            saverRuleTemp.status = !saverRuleTemp.status;
            console.log("status"+saverRuleTemp.status);
            const toSend = {
                saverRule: saverRuleTemp
            };
            const axiosHeader = {
                headers: {
                    token: this.$store.state.auth.token
                }
            }
            this.$axios.put("/saver-rule", toSend, axiosHeader)
            .then(res=>{
                if(res.data.status == 'success'){
                    this.$store.dispatch("getDevices");
                    console.log("paso por success");
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message:  "Device saver status updated!"
                    });     
                }
                return;
            })
            .catch(e =>{
                console.log(e);
                    this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Error updating saver rule" 
                    });
                    return;
            });
        },

        async getDashboards(){
            const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                }
            };
            try {
                const res = await this.$axios.get("/dashboard", axiosHeader);
                console.log(res.data);
                if (res.data.status == "success"){
                this.dashboards = res.data.data;
                }
            } catch (error) {
                this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: "Error getting dashboards"
                });
                console.log(error);
                return;
            }
        }           
    }
};
</script>
