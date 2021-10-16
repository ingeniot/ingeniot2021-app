<template>
    <div class="row" v-if="$store.state.devices.length > 0">
      <div
        v-for="(widget, index) in $store.state.selectedDevice.dashboard.widgets"
        :key="index"
        :class="[widget.column]"
      >


        <RTNumberChart
          v-if="widget.widget == 'numberchart'"
          :config= "fixWidget(widget)"
        ></RTNumberChart>

        <IotSwitch
          v-if="widget.widget == 'switch'"
          :config= "fixWidget(widget)"
        ></IotSwitch>

        <IotButton
          v-if="widget.widget == 'button'"
          :config= "fixWidget(widget)"
        ></IotButton>

        <IotIndicator
          v-if="widget.widget == 'indicator'"
          :config= "fixWidget(widget)"

        ></IotIndicator>

                            <!-- JSONS -->
<!--                            <h4>Widgets</h4>
    <Json :value="fixWidget(widget)"></Json> 
-->
      </div>
    </div> 
    <div v-else>
      select a device ...
      </div>       
</template>

<script>
export default {
  middleware: "authenticated",
  name:'Home',
  methods:{
    fixWidget(widget){
      var widgetTemp = JSON.parse(JSON.stringify(widget));   // Hace una copia nueva
      widgetTemp.selectedDevice.dId = this.$store.state.selectedDevice.dId;
      widgetTemp.selectedDevice.name = this.$store.state.selectedDevice.name;
      widgetTemp.userId = this.$store.state.selectedDevice.userId;
      if(widget.widget == 'numberchart'){
      widgetTemp.demo = false;      // Elimina datos demos usados para el preview
      }
      return widgetTemp;
    }
  }
};
</script>