<template>
    <div>
        <!-- New alarm form-->
        <div class="row">
            <div class="col-sm-12">
                <card v-if="$store.state.devices.length > 0">
                    <div slot="header">
                        <h4 class="card-tittle">Create new alarm rule</h4>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <el-select required class="select-success" placeholder="variable" v-model= "selectedWidgetIndex" style="margin-top:25px;">
                                <el-option v-for= "widget, index in $store.state.selectedDevice.dashboard.widgets" :key= "index" class= "test-dark" :value= "index" :label= "widget.variableFullName"></el-option>
                            </el-select>
                        </div>
                        <div class="col-3">
                            <el-select required class= "select-warning" placeholder="Condition" v-model= "newRule.condition" style="margin-top:25px;"> 
                                <el-option class="text-dark" value= "=" label= "="></el-option>
                                <el-option class="text-dark" value= ">" label= ">"></el-option>                                
                                <el-option class="text-dark" value= ">=" label= ">="></el-option>
                                <el-option class="text-dark" value= "<" label= "<"></el-option>
                                <el-option class="text-dark" value= "<=" label= "<="></el-option>
                                <el-option class="text-dark" value= "!=" label= "!="></el-option>
                            </el-select>
                        </div>
                        <div class="col-3">
                            <base-input label= "Value" v-model= "newRule.value" type= "number"></base-input>
                        </div>
                        <div class="col-3">
                            <base-input label= "Trigger time " v-model= "newRule.triggerTime" type= "number"></base-input>
                        </div>                                                
                    </div>
                    <br><br>
                    <div class= "row pull-rigth">
                        <div class= "col-12">
                            <base-button @click= "createNewRule()" native-type= "submit" type= "primary" class= "mb3" size= "lg" :disable= "$store.state.devices.length == 0">
                            Add new rule
                            </base-button>

                        </div>
                    </div>

                </card>
            </div>
        </div>
         <!-- Alarms table-->       
    <div class="row" v-if= "$store.state.devices.length > 0">
        <div class="col-sm-12">
            <card >
                <div slot="header">
                    <h4 class="card-title">Rules </h4>
                </div>
                <el-table v-if= "$store.state.selectedDevice.alarmRules.length >0" :data= "$store.state.selectedDevice.alarmRules"> 
                   <el-table-column min-with="50" label="#" align="center">
                        <div class="photo" slot-scope="{$index}">
                            {{$index+1}}
                        </div>
                    </el-table-column>
                    <el-table-column prop="variableFullName" label="Var Name"></el-table-column>
                    <el-table-column prop="variable" label="Variable"></el-table-column>
                    <el-table-column prop="condition" label="Condition"></el-table-column>
                    <el-table-column prop="value" label="Value"></el-table-column>
                    <el-table-column prop="triggerTime" label="Trigger time"></el-table-column>
                    <el-table-column prop="counter" label="Matches"></el-table-column>
                    <el-table-column header-align="right" align="rigth" label="Actions">
                       <div slot-scope="{row}" class="text-right table-actions">
                            <el-tooltip content="Delete" effect="light" placement="top">
                                <base-button @click="deleteRule(row)" type="danger" icon size="sm" class="btn-link">
                                <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                            <el-tooltip content="Rule Status" style="margin-left: 20px;">
                                 <i class="fas fa-exclamation-triangle" :class= "{'text-warning':row.status}"></i>
                                 <!--no se ata row.status al v-model, porque al cambiar de status cambiaria directosobre store-->
                            </el-tooltip>
                            <el-tooltip content="Change Rule Status" style="margin-left: 5px;">
                                <base-switch @click="updateRuleStatus(row)" :value= "row.status" type="primary" on-text="ON"
                                off-text="OFF" style="margin-top: 10px;"></base-switch>
                            </el-tooltip>
                        </div>
                   </el-table-column>                    
                </el-table>
                <h4 v-else class="card tittle">No alarms rules</h4>
            </card>

        </div>
    </div>
        <h3>Selected device</h3>
        <Json :value="$store.state.selectedDevice"></Json>         
                <h3>Notifications</h3>
        <Json :value="$store.state.notifications"></Json>        
    </div>
</template>

<script>
import { Select, Option } from 'element-ui';
import { Table, TableColumn} from 'element-ui';

export default ({
    middleware: 'authenticated',
    components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,       
    },
    data (){
        return {
            selectedWidgetIndex: null,
            alarmRules:[],
            newRule:{
                dId: null,
                status: true,
                variableFullName: null,
                variable: null,
                value: null,
                condition: null,
                triggerTime: null,
                deviceName: null
            }
        }
    },
    methods:{
        createNewRule(){
            if(this.selectedWidgetIndex == null){
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message:"Variable must be selected"
                });
                return;                
            }
            if(this.newRule.condition == null){
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message:"Condition must be selected"
                });
                return;           
            }
            if(this.newRule.value == null){
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message:"Value is empty"
                });
                return;           
            } 
            if(this.newRule.triggerTime == null){
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message:"Trigger time is empty"
                });
                return;           
            } 
            this.newRule.dId = this.$store.state.selectedDevice.dId;
            this.newRule.deviceName = this.$store.state.selectedDevice.name;            
            this.newRule.variableFullName = this.$store.state.selectedDevice.dashboard.widgets[this.selectedWidgetIndex].variableFullName;
            this.newRule.variable = this.$store.state.selectedDevice.dashboard.widgets[this.selectedWidgetIndex].variable;
            const toSend = {
                newRule: this.newRule
            };    
            const axiosHeader = {
                headers: {
                token: this.$store.state.auth.token
                }
            };
            this.$axios.post("/rule",toSend , axiosHeader)
            .then (res => {
                if(res.data.status == "success"){
                    this.newRule.variable = null;
                    this.newRule.condition = null;             
                    this.newRule.value = null;      
                    this.newRule.triggerTime = null; 
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message:  "Alarm rule was added!"
                    }); 
                    this.$store.dispatch("getDevices");
                    return;                            
                }                   
            })
            .catch(e=> {
                this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message:"Error"
                });
                console.log(e);
                return;                         
            })

        },
        updateRuleStatus(rule){
            console.log("rule"+rule);
            console.log("rule.status="+rule.status)
            const axiosHeader = {
                headers: {
                    token: this.$store.state.auth.token
                }
            };
            var ruleTemp = JSON.parse(JSON.stringify(rule));
            ruleTemp.status = !ruleTemp.status;  
            console.log("ruleTemp.status="+ruleTemp.status) 
            const toSend = {
                rule: ruleTemp
            };

            this.$axios.put("/rule", toSend, axiosHeader)
            .then(res=>{
                if(res.data.status == 'success'){
                    console.log("paso por success de update de api");
                    this.$store.dispatch("getDevices");
                    console.log("paso por success");
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message:  "Rule status updated!"
                    });     
                }
                if(res.data.status == 'error'){
                    console.log("Error al actualizar regla en api");
                    this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-check-2",
                    message:  "Fail rule status update"
                    }); 
                }
                return;
            })
            .catch(e =>{
                console.log(e);
                    this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Error updating  rule" 
                    });
                    return;
            })
        },
        deleteRule(rule){
            const axiosHeader = {
                headers: {
                    token: this.$store.state.auth.token
                },
                params: {
                    emqxRuleId: rule.emqxRuleId
                }
            };
            this.$axios.delete("/rule",axiosHeader)
            .then(res=>{
                if(res.data.status == 'success'){
                    console.log("paso por success de delete de api");
                    this.$store.dispatch("getDevices");
                    this.$notify({
                    type: "success",
                    icon: "tim-icons icon-check-2",
                    message:  "Rule deleted!"
                    });     
                }
                if(res.data.status == 'error'){
                    console.log("Error al borrar  regla en api");
                    this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-check-2",
                    message:  "Fail rule delete"
                    }); 
                }
                return;
            })
            .catch(e =>{
                console.log(e);
                    this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Error updating  rule" 
                    });
                    return;
            })
        }
    }

});
</script>
