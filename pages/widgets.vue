<template>
    <div class="row">
        <IotIndicator :config = "iotIndicatorConfig"></IotIndicator>
        <IotButton :config = "iotButtonConfig"></IotButton>

    </div>
</template>

<script>
export default {
    components: { Iotbutton },
    data(){
        return {
            value:false,
        iotIndicatorConfig: {
            userId:"userid",
            selectedDevice:{
                name:"home",
                dId:"8888",
                templateName:"Power Sensor",
                templateId:"868966887876",
                saveStatus:false,
            },
            label:"Pump",  
            variable:"var1",
            icon:"fa-sun",
            column:"col-6",
            widget:"indicator",
            class:"success"
            },
        iotButtonConfig: {
            userId:"userid",
            selectedDevice:{
                name:"home",
                dId:"8888",
                templateName:"Power Sensor",
                templateId:"868966887876",
                saveStatus:false,
            },
            label:"Pump",  
            variable:"var1",
            icon:"fa-sun",
            column:"col-6",
            widget:"indicator",
            class:"success",
            message:"{'fanstatus':'stop'}"
            }            
        }
    },
    methods:{
    }