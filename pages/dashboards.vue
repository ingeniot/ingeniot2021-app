<template>
  <div>
    <!-- WIDGET CONFIGURATOR -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Create new dasboard</h4>
        </div>

        <div class="row">
          <!-- WIDGET SELECTOR AND FORMS -->
          <div class="col-6">
            <!-- WIDGETS SELECTOR -->
            <el-select
              v-model="widgetType"
              class="select-success"
              placeholder="Select Widget"
              style="width: 100%;"
            >
              <el-option
                class="text-dark"
                value="numberchart"
                label="Number Chart INPUT <-"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="indicator"
                label="Boolean Indicator INPUT <-"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="map"
                label="Map INPUT <-"
              ></el-option>
              <el-option
                class="text-dark"
                value="switch"
                label="Switch OUTPUT ->"
              ></el-option>
              <el-option
                class="text-dark"
                value="button"
                label="Button OUTPUT ->"
              ></el-option>
            </el-select>

            <br />
            <br />

            <!-- FORMS NUMBER CHART TYPE -->
            <div v-if="widgetType == 'numberchart'">
              <base-input
                v-model="ncConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input v-model="ncConfig.unit" label="Unit" type="text">
              </base-input>

              <base-input
                v-model.number="ncConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <base-input
                v-model="ncConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.chartTimeAgo"
                label="Chart Back Time (mins)"
                type="number"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.variablePeriod"
                label="Device variable sending period"
                type="number"
              ></base-input>

              <br />
              <el-select
                v-model="ncConfig.class"
                class="select-success"
                placeholder="Select Class"
                label="Type"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="ncConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
                label="Columns"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM SWITCH TYPE -->
            <div v-if="widgetType == 'switch'">
              <base-input
                v-model="iotSwitchConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotSwitchConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotSwitchConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
                label="Type"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotSwitchConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
                label="Columns"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM BUTTON TYPE -->
            <div v-if="widgetType == 'button'">
              <base-input
                v-model="iotButtonConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotButtonConfig.message"
                label="Message to send"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotButtonConfig.text"
                label="Button Text"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotButtonConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotButtonConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
                label="Type"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotButtonConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
                label="Columns"                
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM INDICATOR TYPE -->
            <div v-if="widgetType == 'indicator'">
              <base-input
                v-model="iotIndicatorConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotIndicatorConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="iotIndicatorConfig.variablePeriod"
                label="Device variable sending period"
                type="number"
              ></base-input>

              <br />

              <el-select
                v-model="iotIndicatorConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
                label="Type"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotIndicatorConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
                label="Columns"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>
          </div>

          <!-- WIDGET PREVIEW -->
          <div class="col-6">
            <RTNumberChart
              v-if="widgetType == 'numberchart'"
              :config="ncConfig"
            ></RTNumberChart>
            <IotSwitch
              v-if="widgetType == 'switch'"
              :config="iotSwitchConfig"
            ></IotSwitch>
            <IotButton
              v-if="widgetType == 'button'"
              :config="iotButtonConfig"
            ></IotButton>
            <IotIndicator
              v-if="widgetType == 'indicator'"
              :config="iotIndicatorConfig"
              ></IotIndicator>
          </div>
        </div>

        <!-- ADD WIDGET BUTTON -->
        <div class="row pull-right">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              @click="addNewWidget()"
            >
              Add Widget
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- DASHBOARD PREVIEW -->
    <div class="row">
      <div
        v-for="(widget, index) in widgets"
        :key="index"
        :class="[widget.column]"
      >
        <i
          aria-hidden="true"
          class="fa fa-trash text-warning pull-right"
          @click="deleteWidget(index)"
          style="margin-bottom: 10px;"
        ></i>

        <RTNumberChart
          v-if="widget.widget == 'numberchart'"
          :config="widget"
        ></RTNumberChart>

        <IotSwitch
          v-if="widget.widget == 'switch'"
          :config="widget"
        ></IotSwitch>

        <IotButton
          v-if="widget.widget == 'button'"
          :config="widget"
        ></IotButton>

        <IotIndicator
          v-if="widget.widget == 'indicator'"
          :config="widget"
        ></IotIndicator>
      </div>
    </div>

    <!-- SAVE DASHBOARD-->
    <!--    <div class="row" v-if="widgets.length > 0">-->
    <div class="row" >
      <card>
        <div slot="header">
          <h4 class="card-title">Save Dashboard</h4>
        </div>

        <div class="row">
          <base-input
            class="col-4"
            v-model="dashboardName"
            label="Dashoard Name"
            type="text"
          >
          </base-input>

          <base-input
            class="col-8"
            v-model="dashboardDescription"
            label="Dashboard Description"
            type="text"
          >
          </base-input>
        </div>

        <br /><br />

        <div class="row">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="primary"
              class="mb-3 pull-right"
              size="lg"
              @click="saveDashboard()"
              :disabled="widgets.length == 0"
            >
              Save Dashboard
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- DASHBOARDS TABLE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Dashboards</h4>
        </div>

        <div class="row">
          <el-table :data="dashboards">
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>

            <el-table-column prop="name" label="Name"></el-table-column>

            <el-table-column
              prop="description"
              label="Description"
            ></el-table-column>

            <el-table-column
              prop="widgets.length"
              label="Widgets"
            ></el-table-column>

            <el-table-column header-align="right" align="right" label="Actions">
              <div
                slot-scope="{ row }"
                class="text-right table-actions"
              >
                <el-tooltip
                  content="Delete"
                  effect="light"
                  :open-delay="300"
                  placement="top"
                >
                  <base-button
                    @click="deleteDashboard(row)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove "></i>
                  </base-button>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
        </div>
      </card>
    </div>

    <!-- JSONS -->
<h4>Widgets</h4>
    <Json :value="widgets"></Json>
    <h4>Widgets</h4>
    <Json :value="dashboards"></Json>    
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
export default {
  middleware: "authenticated",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      widgets: [],
      dashboards: [],
      widgetType: "",
      dashboardName: "",
      dashboardDescription: "",
      ncConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        variableType: "input",
        variablePeriod: "30",
        unit: "Watts",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widget: "numberchart",
        icon: "fa-bath",
        chartTimeAgo: 1566,
        demo: true
      },
      iotSwitchConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "Luz",
        variable: "varname",
        variableType: "output",
        variablePeriod: "",
        class: "danger",
        widget: "switch",
        icon: "fa-bath",
        column: "col-6"
      },
      iotButtonConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        variableType: "output",
        variablePeriod: "",
        text: "send",
        message: "testing123",
        widget: "button",
        icon: "fa-bath",
        column: "col-6"
      },
      iotIndicatorConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        variableType: "input",
        variablePeriod: "30",
        class: "success",
        widget: "indicator",
        icon: "fa-bath",
        column: "col-6"
      },


    };
  },

  mounted(){
    this.getDashboards();
  },

  methods: {
    addNewWidget() {
      if (this.widgetType == "numberchart") {
        this.ncConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
      }
      if (this.widgetType == "switch") {
        this.iotSwitchConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotSwitchConfig)));
      }
      if (this.widgetType == "button") {
        this.iotButtonConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotButtonConfig)));
      }
      if (this.widgetType == "indicator") {
        this.iotIndicatorConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotIndicatorConfig)));
      }
    },
    deleteWidget(index) {
      this.widgets.splice(index, 1);
    },
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },


    async saveDashboard(){
      const axiosHeader = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
        const toSend = {
        dashboard: {
          name: this.dashboardName,
          description: this.dashboardDescription,
          widgets: this.widgets,
        }
      }

      try {
        const res = await this.$axios.post("/dashboard", toSend, axiosHeader) ;
        if(res.data.status == "success"){
          this.$notify({type: 'success', icon: 'tim-icons icon-alert-circle-exc', message: 'Dashboard created!'});
          this.getDashboards();
          this.widgets =[];
        } 
      } catch (error) {
          this.$notify({type: 'danger', icon: 'tim-icons icon-alert-circle-exc', message: 'Dashboard creating error!'});
          console.log(error);
          return;
        
      }

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
        console.log("respuesta API:", res.data);
        console.log("respuesta API:", res.data.data[0].name);
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
    },
    async deleteDashboard(dashboard) {
      const axiosHeader = {
          headers: {
          token: this.$store.state.auth.token
          },
          params: {
          dashboardId: dashboard._id
          }
      };
      try {
        const res = await this.$axios.delete("/dashboard", axiosHeader);   
        if(res.data.status == "error" && res.data.error == "Dashboard in use"){
          this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: dashboard.name + " is in use. First remove devices using this dashboard"
          });            
        }
        if(res.data.status == "success"){
              this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: dashboard.name + " deleted!"
              }); 
              this.getDashboards();               
        } 
      } catch (error) {
          this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: " Error deleting " + dashboard.name
          });              
      };
    }
  }
};
</script>